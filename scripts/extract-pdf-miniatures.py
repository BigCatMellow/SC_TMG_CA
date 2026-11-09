#!/usr/bin/env python3
"""Extract 22 exact original painted miniature JPEGs from the official 2026 Core Rules PDF."""
import argparse
import hashlib
import json
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'portraits/pdf/source-manifest.json'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--pdf', type=Path, help='Use local PDF; otherwise download from publisher')
    parser.add_argument('--check', action='store_true', help='Verify tracked JPEGs without downloading')
    args = parser.parse_args()
    manifest = json.loads(MANIFEST.read_text())
    folder = ROOT / 'portraits/pdf'

    if args.check:
        for unit in manifest['units']:
            image_path = folder / unit['file']
            if not image_path.is_file() or hashlib.sha256(image_path.read_bytes()).hexdigest() != unit['sha256']:
                raise RuntimeError('Missing or damaged miniature: ' + str(image_path))
        print('Verified', len(manifest['units']), 'miniature JPEGs')
        return

    if args.pdf:
        raw = args.pdf.read_bytes()
    else:
        request = Request(manifest['source_url'], headers={'User-Agent': 'SC-TMG-Companion/1.0'})
        with urlopen(request, timeout=90) as response:
            raw = response.read()

    actual_pdf_hash = hashlib.sha256(raw).hexdigest()
    if actual_pdf_hash != manifest['pdf_sha256']:
        raise RuntimeError('Publisher PDF changed; expected ' + manifest['pdf_sha256'] +
                           ' but got ' + actual_pdf_hash + '. Verify pages/xrefs before importing.')

    import fitz
    pdf = fitz.open(stream=raw, filetype='pdf')
    if len(pdf) != manifest['pdf_pages']:
        raise RuntimeError('Unexpected source PDF page count')
    for unit in manifest['units']:
        page = pdf[unit['pdf_page'] - 1]
        xref = unit['xref']
        if xref not in {x[0] for x in page.get_images(full=True)}:
            raise RuntimeError('Image missing from source page: ' + unit['file'])
        img = pdf.extract_image(xref)
        if img['ext'].lower() not in ('jpg', 'jpeg'):
            raise RuntimeError('Unexpected image encoding: ' + unit['file'])
        if hashlib.sha256(img['image']).hexdigest() != unit['sha256']:
            raise RuntimeError('Image hash mismatch: ' + unit['file'])
        target = folder / unit['file']
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(img['image'])
    print('Extracted', len(manifest['units']), 'verified miniature photos')


if __name__ == '__main__':
    main()
