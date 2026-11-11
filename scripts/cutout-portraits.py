#!/usr/bin/env python3
"""Build transparent "cutout" versions of unit portraits for the breakout Library cards.

Reads every portrait source listed in model-portraits.js, removes the photo background
with rembg, trims to the model, and writes WebP files with alpha to portraits/cutout/.
Then regenerates portraits/cutout/index.js, which maps each original src to its cutout.
Units without a cutout keep the original framed portrait, so this is safe to re-run.

  pip install "rembg[cpu]" pillow
  python3 scripts/cutout-portraits.py            # local publisher JPEGs only
  python3 scripts/cutout-portraits.py --remote   # also download + cut external gallery images
  python3 scripts/cutout-portraits.py --force    # rebuild files that already exist

Remote gallery photos are often group shots: check the result and add a crop box in
CROPS below (fractions of the source image) if the wrong model is picked out.

Remote photos are cut per unit (one publisher image can show several models) and stored
under the unit key "faction/id". The downloaded originals go to portraits-src/remote/
(not published), and portraits-src/remote/preview.png puts each original next to its
cutout for review. GitHub Actions runs this via the "Portrait cutouts" workflow, because
the publisher sites are not reachable from every machine.
"""
import argparse, io, json, os, subprocess, sys, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'portraits', 'cutout')
MAX_H = 640  # px; cards draw at <=230px CSS height, viewer at screen size

# Optional pre-crop for remote group photos: "faction/id": (left, top, right, bottom) as fractions.
CROPS = {}


def portrait_factions():
    js = ("global.window={};require(" + json.dumps(os.path.join(ROOT, 'model-portraits.js')) + ");"
          "console.log(JSON.stringify(window.SCTMG_MODEL_PORTRAITS.factions))")
    return json.loads(subprocess.check_output(['node', '-e', js], text=True))


def remote_units():
    out = []
    for faction, units in portrait_factions().items():
        for uid, entry in units.items():
            src = entry.get('src')
            if src and src.startswith('http'):
                out.append((faction, uid, src))
    return out


def portrait_sources():
    factions = portrait_factions()
    seen = {}
    for faction, units in factions.items():
        for uid, entry in units.items():
            for key in ('src', 'fallbackSrc'):
                src = entry.get(key)
                if src and src not in seen:
                    seen[src] = (faction, uid)
    return seen


def load(src):
    if src.startswith('http'):
        req = urllib.request.Request(src, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=60) as r:
            return Image.open(io.BytesIO(r.read())).convert('RGB')
    return Image.open(os.path.join(ROOT, src)).convert('RGB')


SRC_DIR = os.path.join(ROOT, 'portraits-src', 'remote')


def cut_one(remove, session, im):
    cut = remove(im, session=session)
    alpha = cut.getchannel('A').point(lambda a: 255 if a > 24 else 0)
    box = alpha.getbbox()
    if not box:
        return None
    cut = cut.crop(box)
    if cut.height > MAX_H:
        cut = cut.resize((round(cut.width * MAX_H / cut.height), MAX_H), Image.LANCZOS)
    return cut


def cut_remote(remove, session, mapping, force):
    """One cutout per unit from publisher-hosted photos, plus a review sheet."""
    os.makedirs(SRC_DIR, exist_ok=True)
    downloaded, rows = {}, []
    for faction, uid, src in remote_units():
        key = faction + '/' + uid
        rel = 'portraits/cutout/%s/%s.webp' % (faction, uid)
        dest = os.path.join(ROOT, rel)
        try:
            if src not in downloaded:
                downloaded[src] = load(src)
                downloaded[src].save(os.path.join(SRC_DIR, '%s-%s.jpg' % (faction, uid)), quality=90)
            im = downloaded[src]
        except Exception as e:
            print('skip', key, e, file=sys.stderr)
            continue
        crop = CROPS.get(key)
        if crop:
            w, h = im.size
            im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
        if os.path.exists(dest) and not force:
            mapping[key] = rel
            rows.append((key, im, Image.open(dest)))
            continue
        cut = cut_one(remove, session, im)
        if cut is None:
            print('empty cutout', key, file=sys.stderr)
            continue
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        cut.save(dest, 'WEBP', quality=86, method=6)
        mapping[key] = rel
        rows.append((key, im, cut))
        print('cut', key, cut.size)
    if rows:
        from PIL import ImageDraw
        W, H = 520, 300
        sheet = Image.new('RGB', (W * 2, (H + 24) * len(rows)), (24, 26, 34))
        d = ImageDraw.Draw(sheet)
        for i, (key, orig, cut) in enumerate(rows):
            y = i * (H + 24)
            a = orig.copy(); a.thumbnail((W, H)); sheet.paste(a, (0, y))
            b = Image.new('RGBA', cut.size, (24, 26, 34, 255)); b.alpha_composite(cut.convert('RGBA'))
            b = b.convert('RGB'); b.thumbnail((W, H)); sheet.paste(b, (W + (W - b.width) // 2, y))
            d.text((6, y + H + 4), key + ('  crop=' + str(CROPS[key]) if key in CROPS else ''), fill=(230, 230, 230))
        sheet.save(os.path.join(SRC_DIR, 'preview.png'))
        print('wrote', os.path.join(SRC_DIR, 'preview.png'))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--remote', action='store_true')
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args()
    from rembg import remove, new_session
    session = new_session('isnet-general-use')

    index_path = os.path.join(OUT, 'index.js')
    mapping = {}
    if os.path.exists(index_path):
        txt = open(index_path, encoding='utf8').read()
        mapping = json.loads(txt[txt.index('{'):txt.rindex('}') + 1])

    for src, (faction, uid) in portrait_sources().items():
        remote = src.startswith('http')
        if remote:
            continue
        name = uid if remote else os.path.splitext(os.path.basename(src))[0]
        rel = 'portraits/cutout/%s/%s.webp' % (faction, name)
        dest = os.path.join(ROOT, rel)
        if os.path.exists(dest) and not args.force:
            mapping[src] = rel
            continue
        try:
            im = load(src)
        except Exception as e:  # network or missing file: keep framed portrait
            print('skip', src, e, file=sys.stderr)
            continue
        crop = CROPS.get(faction + '/' + uid)
        if crop:
            w, h = im.size
            im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
        cut = remove(im, session=session)
        alpha = cut.getchannel('A').point(lambda a: 255 if a > 24 else 0)
        box = alpha.getbbox()
        if not box:
            print('empty cutout', src, file=sys.stderr)
            continue
        cut = cut.crop(box)
        if cut.height > MAX_H:
            cut = cut.resize((round(cut.width * MAX_H / cut.height), MAX_H), Image.LANCZOS)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        cut.save(dest, 'WEBP', quality=86, method=6)
        mapping[src] = rel
        print('cut', rel, cut.size)

    if args.remote:
        cut_remote(remove, session, mapping, args.force)

    with open(index_path, 'w', encoding='utf8') as f:
        f.write('// Generated by scripts/cutout-portraits.py. Maps portrait src -> transparent cutout.\n')
        f.write('window.SCTMG_PORTRAIT_CUTOUTS = ' + json.dumps(dict(sorted(mapping.items())), indent=2) + ';\n')
    print('wrote', index_path, len(mapping), 'cutouts')


if __name__ == '__main__':
    main()
