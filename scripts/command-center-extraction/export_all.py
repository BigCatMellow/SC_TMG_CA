#!/usr/bin/env python3
"""Archive StarCraft TMG Command Center pages in one Playwright browser run.

Local-only outputs. No rulebook, card images, or session state are uploaded to
the companion repository. Run with Python 3.10+ and playwright installed.
"""
from __future__ import annotations

import argparse
from collections import Counter
from datetime import datetime
import json
from pathlib import Path
import re
import sys
import zipfile

from playwright.sync_api import sync_playwright, TimeoutError as BrowserTimeout

DEFAULT_URL = "https://sc.starcraft-tmg.com/"
HERE = Path(__file__).resolve().parent
EXPECTED_PARTS = set(range(1, 13))
HISTORIC_CARD_COUNTS = {"ZERG": 34, "TERRAN": 30, "PROTOSS": 30}
HISTORIC_MISSIONS = 14
HISTORIC_MAPS = 13


class ExportError(RuntimeError):
    pass


def filename_slug(value: str) -> str:
    result = re.sub(r"[^A-Za-z0-9]+", "_", value).strip("_")
    return result[:100] or "unnamed"


def unique_path(directory: Path, desired_name: str) -> Path:
    candidate = directory / desired_name
    stem, suffix = candidate.stem, candidate.suffix
    index = 2
    while candidate.exists():
        candidate = directory / f"{stem}_{index}{suffix}"
        index += 1
    return candidate


def audit_rules(contents: str) -> dict:
    parts = {int(n) for n in re.findall(r"(?m)^PART\s+(\d+)\s*:", contents)}
    missing = sorted(EXPECTED_PARTS - parts)
    return {
        "numbered_parts_found": sorted(parts),
        "missing_numbered_parts": missing,
        "characters": len(contents),
        "historical_part_1_empty": bool(re.search(
            r"(?ms)^PART\s+1:\s*LEARN TO PLAY.*?No rules defined\.",
            contents[:2000],
        )),
        "warnings": ["Missing Part " + str(part) for part in missing],
    }


def audit_factions(contents: str) -> dict:
    headings = list(re.finditer(r"(?m)^FACTION:\s*(ZERG|TERRAN|PROTOSS)\s*$", contents))
    counts = Counter()
    ids_by_faction: dict[str, list[str]] = {}
    for i, heading in enumerate(headings):
        end = headings[i + 1].start() if i + 1 < len(headings) else len(contents)
        section = contents[heading.end():end]
        key = heading.group(1)
        counts[key] = len(re.findall(r"(?m)^CARD:\s*", section))
        ids_by_faction[key] = re.findall(r"(?m)^ID:\s*(\S+)", section)
    warnings = []
    for name, previous in HISTORIC_CARD_COUNTS.items():
        found = counts.get(name, 0)
        if found != previous:
            warnings.append(f"{name}: {found} cards; archive baseline was {previous}")
        ids = ids_by_faction.get(name, [])
        if len(set(ids)) != len(ids):
            warnings.append(f"{name}: duplicate card IDs")
        if len(ids) != found:
            warnings.append(f"{name}: {found} cards but {len(ids)} ID lines")
    return {
        "cards_per_faction": dict(counts),
        "card_total": sum(counts.values()),
        "characters": len(contents),
        "warnings": warnings,
    }


def image_extension(blob: bytes) -> str:
    if blob.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if blob.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if blob.startswith(b"RIFF") and blob[8:12] == b"WEBP":
        return ".webp"
    raise ExportError("Download did not contain a recognized JPG, PNG, or WebP image")


def open_screen(page, name: str, visible_selector: str) -> None:
    page.wait_for_function("() => !!window.app && typeof window.app.nav === 'function'", timeout=45000)
    page.evaluate("name => window.app.nav(name)", name)
    page.locator(visible_selector).wait_for(state="visible", timeout=45000)
    page.wait_for_timeout(500)


def export_script_download(page, filename: str, script_name: str, directory: Path) -> dict:
    script = (HERE / script_name).read_text(encoding="utf-8")
    target = directory / filename
    with page.expect_download(timeout=600000) as event:
        page.evaluate(script)
    download = event.value
    error = download.failure()
    if error:
        raise ExportError(f"Browser download failed for {script_name}: {error}")
    download.save_as(target)
    if not target.is_file() or target.stat().st_size < 100:
        raise ExportError(f"Downloaded file is empty or absent: {target}")
    print(f"  Saved {target.name} ({target.stat().st_size:,} bytes)")
    return {"file": str(target), "bytes": target.stat().st_size}


def mission_catalog(page) -> list[dict]:
    return page.evaluate("""() => [...document.querySelectorAll(
      '#mc-grid-container .mc-card-entry'
    )].map((card, index) => {
      const button = card.querySelector('button[onclick*="mcDownloadCard"]');
      const match = button?.getAttribute('onclick')?.match(/mcDownloadCard\\('([^']+)'\\)/);
      const title = card.querySelector('.mission-title')?.innerText?.trim();
      const wrapper = card.querySelector('.mission-card-wrapper');
      const sections = [...card.querySelectorAll('.mission-section')].map(s => ({
        heading: s.querySelector('.ms-header')?.innerText?.trim() || '',
        text: s.querySelector('.ms-text')?.innerText?.trim() || ''
      }));
      return {
        index, id: match?.[1] || null, title: title || null,
        format: card.querySelector('.mission-format-tag')?.innerText?.trim() || '',
        supply: card.querySelector('.mission-stat-box .ms-val')?.innerText?.trim() || '',
        game_length: card.querySelector('.mission-length-badge')?.innerText?.trim() || '',
        sections, has_card: !!wrapper
      };
    })""")


def setup_mission_staging(page, index: int) -> dict:
    """Clone the full 600x900 HTML mission card outside the scaled preview."""
    return page.evaluate("""index => {
      document.querySelector('#cc-export-staging')?.remove();
      const card = document.querySelectorAll('#mc-grid-container .mc-card-entry')[index];
      const original = card?.querySelector('.mission-card-wrapper');
      if (!original) throw new Error('No mission-card-wrapper at index ' + index);
      const stage = document.createElement('div');
      stage.id = 'cc-export-staging';
      stage.style.cssText = [
        'position:fixed', 'top:0', 'left:0', 'z-index:2147483647',
        'width:600px', 'height:900px', 'background:#e2e8f0',
        'overflow:hidden', 'pointer-events:none'
      ].join(';');
      const clone = original.cloneNode(true);
      clone.style.transform = 'none';
      clone.style.width = '600px';
      clone.style.height = '900px';
      stage.appendChild(clone);
      document.body.appendChild(stage);
      return {
        scrollHeight: clone.scrollHeight,
        clientHeight: clone.clientHeight,
        scrollWidth: clone.scrollWidth,
        clientWidth: clone.clientWidth
      };
    }""", index)


def export_missions(page, directory: Path) -> dict:
    open_screen(page, "mission-cards", "#mc-grid-container")
    page.wait_for_function("() => document.querySelectorAll('#mc-grid-container .mc-card-entry').length > 0", timeout=45000)
    page.evaluate("() => window.mcSwitchTab('official')")
    page.wait_for_timeout(400)
    page.evaluate("""() => {
      const search = document.querySelector('.mc-search-input');
      const format = document.querySelector('.mc-format-select');
      if (search) search.value = '';
      if (format) format.value = 'All';
      window.mcHandleSearch('');
      window.mcHandleFilter('All');
    }""")
    page.wait_for_timeout(600)
    records = mission_catalog(page)
    if not records:
        raise ExportError("No official mission cards were found")
    if len(records) != len({x['id'] for x in records}):
        raise ExportError("Mission IDs are duplicated or missing")
    out = directory / "missions"
    out.mkdir(parents=True, exist_ok=True)
    failures = []
    saved = []
    warnings = []
    page.evaluate("async () => { await document.fonts.ready; return true; }")
    for i, info in enumerate(records):
        name = info['title'] or info['id'] or f"mission_{i+1}"
        print(f"  Rendering mission {i+1}/{len(records)}: {name}")
        if not info['has_card']:
            failures.append(name + ": missing HTML card")
            continue
        try:
            dimensions = setup_mission_staging(page, info['index'])
            if dimensions['scrollHeight'] > dimensions['clientHeight'] + 2:
                warnings.append(name + ": HTML exceeds 900px height; inspect image")
            path = unique_path(out, filename_slug(info['id'] or name) + '.jpg')
            page.locator('#cc-export-staging').screenshot(
                path=str(path), type='jpeg', quality=94,
                scale='device', animations='disabled', timeout=45000
            )
            if image_extension(path.read_bytes()) != '.jpg':
                raise ExportError('Not a valid JPEG')
            info['file'] = path.name
            saved.append(path.name)
        except Exception as exc:
            failures.append(f"{name}: {exc}")
        finally:
            page.evaluate("() => document.querySelector('#cc-export-staging')?.remove()")
    (out / 'mission-index.json').write_text(
        json.dumps(records, indent=2, ensure_ascii=False) + '\n', encoding='utf-8'
    )
    if len(records) != HISTORIC_MISSIONS:
        warnings.append(f"Now {len(records)} missions; historical baseline {HISTORIC_MISSIONS}")
    if failures:
        raise ExportError("Mission images incomplete: " + '; '.join(failures))
    return {"expected_on_page": len(records), "saved": len(saved),
            "folder": str(out), "warnings": warnings}


def deployment_catalog(page) -> list[dict]:
    return page.evaluate("""() => [...document.querySelectorAll(
      '#dm-grid-container .dm-card-entry'
    )].map((card, index) => ({
      index,
      name: card.querySelector('.dm-card-actions div[style*="font-size:14px"]')
        ?.innerText?.trim() || '',
      format: card.querySelector('.dm-card-actions div[style*="font-size:10px"]')
        ?.innerText?.trim() || '',
      url: card.querySelector('img.dm-img-scale')?.src || ''
    }))""")


def export_deployments(page, directory: Path) -> dict:
    open_screen(page, "deployment-maps", "#dm-grid-container")
    page.wait_for_function("() => document.querySelectorAll('#dm-grid-container .dm-card-entry').length > 0", timeout=45000)
    page.evaluate("() => window.dmSwitchTab('official')")
    page.wait_for_timeout(400)
    page.evaluate("""() => {
      const search = document.querySelector('.dm-search-input');
      const format = document.querySelector('.dm-format-select');
      if (search) search.value = '';
      if (format) format.value = 'All';
      window.dmHandleSearch('');
      window.dmHandleFilter('All');
    }""")
    page.wait_for_timeout(500)
    records = deployment_catalog(page)
    if not records:
        raise ExportError('No official deployment maps were found')
    if any(not x['url'] for x in records):
        raise ExportError('Some deployment map image URLs are missing')
    target = directory / "deployment-maps.zip"
    errors = []
    index = []
    used_names = set()
    with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_STORED) as archive:
        for i, info in enumerate(records):
            name = info['name'] or f"deployment_{i+1}"
            print(f"  Downloading map {i+1}/{len(records)}: {name}")
            try:
                response = page.context.request.get(info['url'], timeout=45000)
                if not response.ok:
                    raise ExportError(f"HTTP {response.status}")
                blob = response.body()
                suffix = image_extension(blob)
                stem = filename_slug(name)
                filename = stem + suffix
                number = 2
                while filename.lower() in used_names:
                    filename = f"{stem}_{number}{suffix}"
                    number += 1
                used_names.add(filename.lower())
                archive.writestr('deployment-maps/' + filename, blob)
                index.append({"name": name, "format": info['format'],
                              "file": filename, "bytes": len(blob)})
            except Exception as exc:
                errors.append(f"{name}: {exc}")
        archive.writestr('deployment-maps/index.json',
                         json.dumps(index, indent=2, ensure_ascii=False) + '\n')
    if errors:
        target.unlink(missing_ok=True)
        raise ExportError('Incomplete deployment download: ' + '; '.join(errors))
    warnings = []
    if len(records) != HISTORIC_MAPS:
        warnings.append(f"Now {len(records)} maps; historical baseline {HISTORIC_MAPS}")
    return {"expected_on_page": len(records), "saved": len(index),
            "zip": str(target), "bytes": target.stat().st_size,
            "warnings": warnings}


def acquire_guest(page, source_url: str) -> None:
    page.goto(source_url, wait_until='domcontentloaded', timeout=60000)
    page.wait_for_timeout(1600)
    if page.locator('#login-overlay').is_visible():
        guest = page.get_by_text('ENTER AS GUEST', exact=False)
        if guest.count():
            guest.first.click()
            page.wait_for_timeout(800)
    try:
        page.wait_for_function(
            "() => !!window.app && typeof window.app.nav === 'function'",
            timeout=40000
        )
    except BrowserTimeout as exc:
        raise ExportError('The Command Center did not initialize. Check the visible browser window, then try again.') from exc
    if page.locator('#login-overlay').is_visible():
        raise ExportError('Guest access did not open. Sign in manually before rerunning or use a URL that permits guest access.')


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', default=DEFAULT_URL, help='Original Command Center URL')
    parser.add_argument('--output', type=Path, default=Path('command-center-exports'))
    parser.add_argument('--only', choices=['all', 'rules', 'factions', 'missions', 'maps'], default='all')
    parser.add_argument('--headless', action='store_true', help='Hide browser (guest access must work)')
    parser.add_argument('--browser-path', help='Optional path to an installed Chromium executable')
    args = parser.parse_args(argv)
    name = datetime.now().astimezone().strftime('%Y-%m-%d_%H%M%S')
    folder = args.output.expanduser().resolve() / name
    folder.mkdir(parents=True, exist_ok=False)
    report: dict = {"source": args.url, "created_local": name,
                    "results": {}, "errors": {}}
    selected = (['rules', 'factions', 'missions', 'maps'] if args.only == 'all'
                else [args.only])

    try:
        with sync_playwright() as playwright:
            options = {"headless": args.headless}
            if args.browser_path:
                options['executable_path'] = args.browser_path
            browser = playwright.chromium.launch(**options)
            context = browser.new_context(
                viewport={"width": 1300, "height": 1100},
                device_scale_factor=2,
                accept_downloads=True,
            )
            page = context.new_page()
            try:
                acquire_guest(page, args.url)
                for name in selected:
                    print('\n[' + name.upper() + ']')
                    try:
                        if name == 'rules':
                            open_screen(page, 'rules', '#rules-section-select')
                            page.wait_for_function(
                                "() => document.querySelector('#rules-section-select')?.options.length >= 12",
                                timeout=45000
                            )
                            saved = export_script_download(
                                page, 'starcraft-complete-rules.txt', 'rules.js', folder
                            )
                            parsed = audit_rules(Path(saved['file']).read_text(encoding='utf-8'))
                            report['results'][name] = {**saved, **parsed}
                            if parsed['missing_numbered_parts']:
                                raise ExportError('Rules export missed numbered parts: ' + str(parsed['missing_numbered_parts']))
                        elif name == 'factions':
                            open_screen(page, 'factions', '#fac-main-content')
                            page.wait_for_function(
                                "() => document.querySelectorAll('#fac-main-content .fac-item-btn').length > 0",
                                timeout=45000
                            )
                            saved = export_script_download(
                                page, 'starcraft-all-factions-and-cards.txt', 'factions.js', folder
                            )
                            parsed = audit_factions(Path(saved['file']).read_text(encoding='utf-8'))
                            report['results'][name] = {**saved, **parsed}
                            if not all(n in parsed['cards_per_faction'] for n in HISTORIC_CARD_COUNTS):
                                raise ExportError('One or more factions are missing from the data')
                        elif name == 'missions':
                            report['results'][name] = export_missions(page, folder)
                        elif name == 'maps':
                            report['results'][name] = export_deployments(page, folder)
                    except Exception as exc:
                        report['errors'][name] = str(exc)
                        print('  ERROR:', exc, file=sys.stderr)
            finally:
                browser.close()
    except Exception as exc:
        report['errors']['browser'] = str(exc)
        print('  BROWSER ERROR:', exc, file=sys.stderr)
    finally:
        (folder / 'report.json').write_text(
            json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8'
        )

    print('\nReport:', folder / 'report.json')
    print('Completed:', ', '.join(report['results']) or '(none)')
    if report['errors']:
        print('Failed:', ', '.join(report['errors']), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
