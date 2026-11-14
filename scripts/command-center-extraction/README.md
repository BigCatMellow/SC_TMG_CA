# Command Center extraction tools

Archived Firefox Developer Tools console scripts for collecting data from the Archon Studio **StarCraft TMG Command Center** (Beta v1.4 in the 2026-11-13 inspections). These scripts are **not** used by the companion at runtime.

## Automated export (recommended)

The [Python Playwright exporter](export_all.py) runs **all four collection tasks in one browser session**, without repeated Firefox Console pasting. It opens the Command Center, uses **Enter as Guest** when needed, navigates each page, and writes files locally. It does **not** access saved credentials or push publisher content to GitHub.

Requirements: **Python 3.10+**, a network connection, and Playwright's Chromium browser. From the repository root, install once:

```shell
python -m pip install playwright
```

```shell
python -m playwright install chromium
```

Run the full extraction:

```shell
python scripts/command-center-extraction/export_all.py
```

Outputs are written to an ignored folder, `command-center-exports/YYYY-MM-DD_HHMMSS/`:

- `starcraft-complete-rules.txt`: all Game Rules text from the nested accordion.
- `starcraft-all-factions-and-cards.txt`: all three factions' cards with statistics, abilities, weapons, and upgrades.
- `missions/*.jpg`: each official Mission Card **rendered from its full-size HTML card** (high-resolution screenshot, not the website's native JPG export); `missions/mission-index.json` stores its visible fields.
- `deployment-maps.zip`: original image files downloaded from the official map page, bundled with an index.
- `report.json`: per-step results, historic-count warnings, errors, and missing numbered parts.

Run only one source, if needed:

```shell
python scripts/command-center-extraction/export_all.py --only maps
```

Other flags: `--headless` for unattended guest-mode browser, `--output DIR` to choose the local destination, `--url URL` if the source domain changes, or `--browser-path PATH` for a locally installed Chromium executable. By default, the browser window is visible. The script reports failure for missing parts, missing factions, image-download errors, or an inaccessible source, and continues other collections when possible. Its historical counts are **warnings**, not hard limits.

Offline parser tests (the Playwright dependency must be installed):

```shell
python -m unittest discover -s scripts/command-center-extraction -p test_export_all.py
```

**Verification:** The Python helpers were syntax-checked and exercised offline against the 2026-11-13 HTML snapshots and exported text: Parts 1–12, 94 cards, all 14 rendered mission cards, and all 13 map entries into a ZIP. Live browser execution against the publisher's current site is **not yet verified**. Card layout fidelity depends on the site's live CSS loading successfully; inspect the generated JPGs before relying on them.

## Manual Firefox Console scripts (fallback)

### Quick start

1. Visit the original Command Center in Firefox and sign in or enter as guest as appropriate.
2. Open the correct menu page, clear search / format filters, press **F12** and choose **Console**.
3. Open the matching `.js` file below, copy its **whole contents**, and paste into the console. Run **one script at a time**.
4. Approve the browser's multiple-download prompt if needed. Check the Firefox Downloads folder and the final console report.
5. Keep the resulting files locally for import/review. Compare totals with the current visible page; **do not assume historic counts are current**.

| Source page | Script | Output | Observed baseline on 2026-11-13 |
| --- | --- | --- | --- |
| Game Rules | [rules.js](rules.js) | `starcraft-complete-rules.txt` + console audit | 15 menu entries (Parts 1–12 plus 3 other sections); Part 1 was empty in source |
| Factions & Cards | [factions.js](factions.js) | `starcraft-all-factions-and-cards.txt` + console audit | Zerg 34, Terran 30, Protoss 30 = 94 cards |
| Mission Cards → Official Missions | [missions.js](missions.js) | Individual JPG downloads using the page's built-in `mcDownloadCard` function | 14 (7 Standard + 7 Skirmish) |
| Deployment Maps → Official Deployments | [deployment-maps.js](deployment-maps.js) | `starcraft-deployment-maps.zip` containing original JPG images | 13 |
| Any Command Center page | [inspect-dom.js](inspect-dom.js) | `starcraft-page-inspection.html` | Only the currently rendered DOM; collapsed content may be absent |

### Why separate scripts?

The Command Center dynamically re-renders accordions. The early rule scraper revisited an already-open header and caused repeated **expand/collapse** behavior. The archived rules extractor walks nested sections by index and captures each while it is open. The faction script saves each individual card before closing it; it does not need all cards open together.

The Mission Cards are **HTML-rendered cards**, not ordinary `img` elements. Use the site's own JPG exporter. The Deployment Maps are **image-backed**: their original Firebase Storage image URLs appear in `img.dm-img-scale`. The map script downloads those images directly and packages them with JSZip; it does not click the page's download button, which previously opened the first image.

### Validation / limitations

- Rules: verify all 12 `PART N` headings, section lengths, and the console's missing-section warnings. The historic export had 6,947 lines but did not include illustrations; the source also displayed `No rules defined` in the first Learn to Play section and a placeholder for its worked example.
- Factions: compare **expected vs captured** for each faction/category; verify weapons, abilities, upgrades and phase text for a few representative units. `innerText` flattens tables, so use structured parsing before importing into the app. Image placeholders are not portrait files.
- Missions: the site opens or downloads JPGs depending on its implementation and browser settings. Check filenames/actual downloads; initiating a request does not prove the save succeeded.
- Deployment Maps: count files **inside the ZIP**, not the single ZIP itself. If Firefox shows a CORS/network error, ZIP creation should halt rather than silently omit images.
- These are archive/recovery utilities tested against the 2026-11-13 page structure and may need selector updates if the publisher changes the site. Browser execution of the revised rules extractor has not been independently re-verified against a new live snapshot.
- HTML snapshots and downloaded output can contain third-party media URLs, dynamic tokens, account-related page state, or copyrighted text. **Review/redact before sharing.** Avoid saving auth/session credentials. The scripts do not request or use credentials.

### Repository policy

Do **not** commit bulk verbatim publisher rules, publisher PDFs, or downloaded card/map images just because these utilities can obtain them. This public repo's [contributing rules](../../CONTRIBUTING.md) require linking to official sources and owner review. For updating the app's generated datasets, see [Updating game data](../../docs/updating-data.md) and [scripts/README.md](../README.md). Those build scripts consume a different `uploads/` format; these console exports are collection/inspection artifacts and are not drop-in build inputs.

The official reference/downloads site is [starcraft-tmg.com/downloads](https://starcraft-tmg.com/downloads).
