"""Build PDF-coordinate sidecars without changing any canonical legal text.

Run --extract with PyMuPDF, --ocr with rapidocr-onnxruntime (scanned rules),
then --assemble. Extraction/OCR caches stay in tmp; only line coordinates ship.
"""
import collections
import difflib
import hashlib
import json
from pathlib import Path
import re
import statistics
import sys
import os
import time
from concurrent.futures import ProcessPoolExecutor, as_completed

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / 'tmp' / 'source-layout-cache'
DOCUMENTS = [
    ('laws/cama-note-book-full-version', 'camaNoteBookFullVersionText'),
    ('court-rules/supreme-court-rules-2024', 'supremeCourtRules2024Text'),
    ('court-rules/court-of-appeal-rules-2021', 'courtOfAppealRules2021Text'),
    ('laws/constitution-1999-as-amended', 'constitution1999Text'),
    ('laws/oaths-act', 'oathsActText'),
    ('laws/fundamental-rights-enforcement-procedure-rules-2009', 'fundamentalRightsEnforcementProcedureRules2009Text'),
    ('laws/efcc-act-2004', 'efccAct2004Text'),
    ('laws/police-act-2020', 'policeAct2020Text'),
    ('laws/fccpa-2018', 'fccpa2018Text'),
    ('laws/stamp-duties-act', 'stampDutiesActText'),
    ('laws/national-industrial-court-act', 'nationalIndustrialCourtActText'),
    ('laws/civil-aviation-act-2022', 'civilAviationAct2022Text'),
    ('laws/electoral-act-2026', 'electoralAct2026Text'),
]

def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')

def canonical_pages(name):
    path = ROOT / 'src' / 'data' / (name + '.txt')
    if path.exists():
        text = path.read_text(encoding='utf-8')
    else:
        if not path.with_suffix('.ts').exists():
            return {}
        source = path.with_suffix('.ts').read_text(encoding='utf-8')
        text = json.loads(re.search(r'export const \w+\s*=\s*(.*);\s*$', source, re.S)[1])
    pages = {}
    for chunk in re.split(r'(?=^## Page \d+\s*$)', text, flags=re.M):
        match = re.match(r'^## Page (\d+)\s*\n([\s\S]*)$', chunk)
        if match:
            pages[int(match[1])] = match[2]
    return pages

def extract():
    try:
        import pymupdf as fitz
    except ModuleNotFoundError:
        sys.path.insert(0, str(ROOT / 'tmp' / 'ocr-deps'))
        import pymupdf as fitz
    for document, name in DOCUMENTS:
        pdf_path = ROOT / 'public' / 'documents' / (document + '.pdf')
        if not pdf_path.exists():
            continue
        cache = CACHE / (Path(document).name + '.json')
        if cache.exists():
            cached = json.loads(cache.read_text(encoding='utf-8'))
            if cached['sourceSha256'] != hashlib.sha256(pdf_path.read_bytes()).hexdigest():
                raise RuntimeError(f'{document}: the PDF changed. Rebuild with a fresh source-layout cache before publishing.')
            continue
        pdf = fitz.open(pdf_path)
        pages = {}
        for index, page in enumerate(pdf):
            items = []
            for block in page.get_text('dict')['blocks']:
                for line in block.get('lines', []):
                    spans = line['spans']
                    text = ''.join(span['text'] for span in spans)
                    if not text.strip():
                        continue
                    x, y, x1, y1 = line['bbox']
                    size = max(span['size'] for span in spans)
                    items.append(dict(text=text, x=x, y=y, x1=x1, height=y1-y, size=size))
            # A scanned rulebook has only a watermark in its text layer.
            scanned = sum(len(item['text']) for item in items) < 100
            if scanned and document.startswith('court-rules/'):
                image = CACHE / Path(document).name / f'{index+1}.png'
                image.parent.mkdir(parents=True, exist_ok=True)
                if not image.exists():
                    image.write_bytes(page.get_pixmap(matrix=fitz.Matrix(1.8, 1.8)).tobytes('png'))
            pages[index+1] = dict(width=page.rect.width, height=page.rect.height, items=items, scanned=scanned)
        save(cache, dict(sourceSha256=hashlib.sha256(pdf_path.read_bytes()).hexdigest(), pages=pages))
        print(f'Extracted coordinates: {document}, {len(pages)} pages', flush=True)

OCR_ENGINE = None

def initialize_ocr():
    global OCR_ENGINE
    os.environ['OMP_NUM_THREADS'] = '1'
    os.environ['OPENBLAS_NUM_THREADS'] = '1'
    if sys.version_info[:2] == (3, 12) and (ROOT / 'tmp' / 'ocr-layout-deps').exists():
        sys.path.insert(0, str(ROOT / 'tmp' / 'ocr-layout-deps'))
    from rapidocr_onnxruntime import RapidOCR
    import cv2
    cv2.setNumThreads(1)
    OCR_ENGINE = RapidOCR(intra_op_num_threads=2, inter_op_num_threads=1)

def ocr_page(job):
    document, number, image, output = job
    start = time.monotonic()
    import cv2
    import numpy as np
    bitmap = cv2.imread(str(image))
    detected, _ = OCR_ENGINE(bitmap, use_cls=False, use_rec=False)
    boxes = [np.asarray(box, dtype=np.float32) for box in detected or []]
    wide = [box for box in boxes if max(box[:,0])-min(box[:,0]) > bitmap.shape[1]*.4]
    left = statistics.median(min(box[:,0]) for box in wide) if wide else 0
    right = statistics.median(max(box[:,0]) for box in wide) if wide else bitmap.shape[1]
    selected = []
    previous_bottom = None
    previous_x = None
    for box in sorted(boxes, key=lambda value: (min(value[:,1]), min(value[:,0]))):
        x, y, x1, y1 = min(box[:,0]), min(box[:,1]), max(box[:,0]), max(box[:,1])
        marginal = x1 < left-6 or x > right+6
        starter = previous_bottom is None or y-previous_bottom > 6 or (previous_x is not None and x-previous_x > 12)
        if marginal or starter or not wide:
            selected.append((box, not marginal, left/1.8, right/1.8))
        if not marginal:
            previous_bottom, previous_x = y1, x
    crops = OCR_ENGINE.get_crop_img_list(bitmap, [value[0] for value in selected]) if selected else []
    # The existing canonical text supplies the wording. Read complete margin
    # labels and only short paragraph prefixes to bind them to source positions.
    crops = [crop[:, :210] if selected[index][1] else crop for index, crop in enumerate(crops)]
    recognized, _ = OCR_ENGINE.text_rec(crops) if crops else ([], 0)
    items = []
    for (box, partial, body_left, body_right), (text, confidence) in zip(selected, recognized):
        if confidence < 0.5 or text.strip() == 'iLovePDF':
            continue
        xs, ys = zip(*box)
        items.append(dict(text=text, x=float(min(xs)/1.8), y=float(min(ys)/1.8), x1=float(max(xs)/1.8), height=float((max(ys)-min(ys))/1.8), size=float((max(ys)-min(ys))/1.8), partial=partial, bodyLeft=float(body_left), bodyRight=float(body_right)))
    save(output, items)
    return f'OCR source coordinates: {document}, page {number} ({time.monotonic()-start:.1f}s)'

def ocr():
    jobs = []
    for document, _ in DOCUMENTS:
        if not document.startswith('court-rules/'):
            continue
        cache = CACHE / (Path(document).name + '.json')
        if not cache.exists():
            continue
        data = json.loads(cache.read_text(encoding='utf-8'))
        for number, page in data['pages'].items():
            image = CACHE / Path(document).name / f'{number}.png'
            output = image.with_suffix('.json')
            if not page['scanned'] or output.exists():
                continue
            jobs.append((document, number, image, output))
    workers = min(4, max(1, (os.cpu_count() or 2)//2))
    print(f'Processing {len(jobs)} remaining scanned pages with {workers} bounded OCR workers.', flush=True)
    with ProcessPoolExecutor(max_workers=workers, initializer=initialize_ocr) as pool:
        for result in as_completed([pool.submit(ocr_page, job) for job in jobs]):
            print(result.result(), flush=True)

def words(text):
    return re.findall(r'\w+', text.casefold(), flags=re.U)

def fingerprint(text):
    value = 2166136261
    for byte in text.encode('utf-8'):
        value = ((value ^ byte) * 16777619) & 0xffffffff
    return format(value, '08x')

def locate(text, page):
    items = page['items']
    long_lines = [item for item in items if (len(words(item['text'])) >= 7 or (item.get('partial') and len(words(item['text'])) >= 2)) and item['x1']-item['x'] > page['width']*0.4]
    if not long_lines:
        return None
    # Long text lines define the main column; small notes outside it cannot
    # become statutory text just because their extraction order is later.
    left = statistics.median(item.get('bodyLeft', item['x']) for item in long_lines)
    right = statistics.median(item.get('bodyRight', item['x1']) for item in long_lines)
    dominant_size = statistics.median(item['size'] for item in long_lines)
    body_top = min(item['y'] for item in long_lines)-8
    for item in items:
        item['side'] = 'body'
        if item['x1'] < left-3 and item['x1']-item['x'] < page['width']*.22:
            item['side'] = 'left'
        elif item['x'] > right+3 and item['x1']-item['x'] < page['width']*.22:
            item['side'] = 'right'
        # Short centred headings, running headers and footer page numbers
        # are not marginal annotations.
        if (not page['scanned'] and item['size'] >= dominant_size*.97) or item['y'] < body_top or item['y'] > page['height']*.94:
            item['side'] = 'body'
    source_words, source_item = [], []
    for index, item in enumerate(items):
        tokens = words(item['text'])
        source_words.extend(tokens)
        source_item.extend([index]*len(tokens))
    canonical_words, canonical_line = [], []
    lines = text.split('\n')
    for index, line in enumerate(lines):
        tokens = words(line)
        canonical_words.extend(tokens)
        canonical_line.extend([index]*len(tokens))
    votes = collections.defaultdict(list)
    matcher = difflib.SequenceMatcher(None, canonical_words, source_words, autojunk=False)
    for match in matcher.get_matching_blocks():
        for offset in range(match.size):
            votes[canonical_line[match.a+offset]].append(source_item[match.b+offset])
    unique = collections.defaultdict(list)
    compact = collections.defaultdict(list)
    for index, item in enumerate(items):
        unique[' '.join(words(item['text']))].append(index)
        compact[''.join(words(item['text']))].append(index)
    located = []
    matched = 0
    previous_item = None
    for index, line in enumerate(lines):
        if not line.strip():
            continue
        candidates = unique.get(' '.join(words(line)), []) or compact.get(''.join(words(line)), [])
        item_index = candidates[0] if len(candidates) == 1 else None
        if item_index is None and candidates and previous_item is not None:
            item_index = min(candidates, key=lambda candidate: abs(items[candidate]['y']-previous_item['y']))
        if item_index is None:
            line_key = ''.join(words(line))
            prefixes = [(candidate, ''.join(words(item['text'])[:-1])) for candidate, item in enumerate(items) if item.get('partial')]
            prefix_candidates = [candidate for candidate, prefix in prefixes if len(prefix) >= 8 and line_key.startswith(prefix)]
            if prefix_candidates:
                item_index = min(prefix_candidates, key=lambda candidate: abs(items[candidate]['y']-previous_item['y'])) if previous_item else prefix_candidates[0]
        if item_index is None and previous_item is not None and len(words(line)) >= 2 and len(line.strip()) <= 42:
            # Match a source annotation even when OCR merged two words or
            # confused one glyph. This only binds existing canonical words
            # to a nearby outside-column box; it never replaces their text.
            key = ''.join(words(line))
            nearby = [(candidate, difflib.SequenceMatcher(None, key, ''.join(words(item['text']))).ratio())
                      for candidate, item in enumerate(items)
                      if item['side'] != 'body' and abs(item['y']-previous_item['y']) <= 45]
            if nearby:
                candidate, score = max(nearby, key=lambda value: value[1])
                if score >= .86:
                    item_index = candidate
        if item_index is None and votes[index]:
            item_index = collections.Counter(votes[index]).most_common(1)[0][0]
        item = items[item_index] if item_index is not None else None
        if item and item['side'] != 'body':
            key, source_key = ''.join(words(line)), ''.join(words(item['text']))
            supported_note = (len(key) >= 4 and key in source_key) or difflib.SequenceMatcher(None, key, source_key).ratio() >= .8
            if not supported_note:
                item = None
        if item:
            matched += 1
            previous_item = item
        located.append(dict(index=index, x=round(item['x'],2) if item else left, y=round(item['y'],2) if item else -1, height=round(item['height'],2) if item else dominant_size, side=item['side'] if item else 'body'))
    # Keep every original character; only coordinates and line references ship.
    # Unmatched text remains in the body rather than being guessed into notes.
    return dict(textHash=fingerprint(text), lines=located, coverage=round(matched/max(1,len(located)),3))

def assemble():
    for document, name in DOCUMENTS:
        cache = CACHE / (Path(document).name + '.json')
        if not cache.exists():
            continue
        data = json.loads(cache.read_text(encoding='utf-8'))
        pages = {}
        for number, text in canonical_pages(name).items():
            page = data['pages'].get(str(number))
            if not page:
                continue
            if page['scanned']:
                ocr_path = CACHE / Path(document).name / f'{number}.json'
                if not ocr_path.exists():
                    continue
                page['items'] = json.loads(ocr_path.read_text(encoding='utf-8'))
            result = locate(text, page)
            if result:
                pages[number] = result
        if pages:
            save(ROOT / 'public' / 'documents' / 'layouts' / (Path(document).name + '.json'), dict(version=1, sourceSha256=data['sourceSha256'], pages=pages))
            print(f'Built source layout: {document}, {len(pages)} pages', flush=True)
    save(ROOT / 'src' / 'data' / 'legalSourceLayouts.json', sorted(path.stem for path in (ROOT / 'public' / 'documents' / 'layouts').glob('*.json')))

if __name__ == '__main__':
    CACHE.mkdir(parents=True, exist_ok=True)
    {'--extract': extract, '--ocr': ocr, '--assemble': assemble}[sys.argv[1]]()
