"""Pull the text off the official card sheets, including the sideways and upside-down cards.

The card sheets are print-and-fold PDFs: the back half of each card is printed upside down
and the tactical cards are printed sideways. Plain text extraction drops both. This reads
every page at 0, 90, 180 and 270 degrees and keeps only the upright text from each pass.

    pip install pdfminer.six pypdf
    python3 scripts/card-audit/extract_card_text.py <folder with *Card-Sheets*.pdf> <out folder>

Writes <out>/card-text.txt (one block per sheet, page and rotation; boxes on one row are
joined with " ¦ ", line breaks inside a box with " ⏎ ") and <out>/card-boxes.json.
The PDFs are publisher files: download them from https://starcraft-tmg.com/downloads,
keep them out of the repo.
"""
import glob, json, os, sys, tempfile
from pdfminer.high_level import extract_pages
from pdfminer.layout import LAParams, LTTextBox, LTTextLine, LTChar
from pypdf import PdfReader, PdfWriter


def upright_boxes(path):
    pages = []
    params = LAParams(line_margin=0.35, char_margin=1.2, word_margin=0.1, boxes_flow=0.5)
    for page in extract_pages(path, laparams=params):
        found = []
        for el in page:
            if not isinstance(el, LTTextBox):
                continue
            text = ''
            for line in el:
                if not isinstance(line, LTTextLine):
                    continue
                chars = [c for c in line if isinstance(c, LTChar)]
                # Keep a line only when most of its characters read left to right at this rotation.
                if not chars or sum(1 for c in chars if c.matrix[0] > 0 and abs(c.matrix[1]) < 0.01) < len(chars) / 2:
                    continue
                text += line.get_text()
            if text.strip():
                found.append({'x': round(el.x0), 'y': round(el.y1), 't': text})
        found.sort(key=lambda b: (-b['y'], b['x']))
        pages.append(found)
    return pages


def main(src, out):
    os.makedirs(out, exist_ok=True)
    result = {}
    with tempfile.TemporaryDirectory() as tmp:
        for pdf in sorted(glob.glob(os.path.join(src, '*Card-Sheets*.pdf'))):
            name = os.path.basename(pdf).replace('-Card-Sheets-A4_EN.pdf', '')
            per_rot = {}
            for rot in (0, 90, 180, 270):
                path = pdf
                if rot:
                    reader, writer = PdfReader(pdf), PdfWriter()
                    for p in reader.pages:
                        p.rotate(rot)
                        writer.add_page(p)
                    path = os.path.join(tmp, f'{name}-{rot}.pdf')
                    writer.write(path)
                per_rot[rot] = upright_boxes(path)
            result[name] = [{str(r): per_rot[r][i] for r in per_rot} for i in range(len(per_rot[0]))]
    with open(os.path.join(out, 'card-boxes.json'), 'w') as f:
        json.dump(result, f)
    with open(os.path.join(out, 'card-text.txt'), 'w') as f:
        for name, pages in result.items():
            for i, page in enumerate(pages):
                for rot, boxes in page.items():
                    if sum(len(b['t']) for b in boxes) < 80:
                        continue
                    f.write(f'\n######## {name} p{i + 1} rot{rot}\n')
                    rows = []
                    for b in boxes:
                        if rows and abs(rows[-1][0] - b['y']) <= 4:
                            rows[-1][1].append(b)
                        else:
                            rows.append([b['y'], [b]])
                    for _, row in rows:
                        row.sort(key=lambda b: b['x'])
                        f.write(' ¦ '.join(b['t'].strip().replace('\n', ' ⏎ ') for b in row) + '\n')
    print({k: len(v) for k, v in result.items()}, '->', out)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
