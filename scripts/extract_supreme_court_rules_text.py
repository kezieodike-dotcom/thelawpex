import json
import re
from pathlib import Path

import fitz
from rapidocr import RapidOCR


ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = Path(r"C:/Users/USER/Downloads/Supreme-Court-Rules-2024.pdf")
OUT_PATH = ROOT / "src" / "data" / "supremeCourtRules2024Text.ts"
CACHE_DIR = ROOT / "tmp" / "ocr-text"


def normalise_line(line: str) -> str:
    line = line.replace("\ufeff", "").replace("\ufffd", "-")
    line = line.replace("�", "-")
    line = re.sub(r"\s+", " ", line).strip()
    return line


def page_text(ocr: RapidOCR, doc: fitz.Document, page_index: int) -> str:
    cache_path = CACHE_DIR / f"supreme-court-rules-2024-page-{page_index + 1:03}.txt"
    if cache_path.exists():
        return cache_path.read_text(encoding="utf-8")

    pix = doc[page_index].get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    image_path = ROOT / "tmp" / "ocr-pages" / f"supreme-court-rules-2024-page-{page_index + 1:03}.png"
    image_path.parent.mkdir(parents=True, exist_ok=True)
    pix.save(image_path)

    result = ocr(str(image_path))
    lines = []
    for text in result.txts or ():
        line = normalise_line(text)
        if not line or line == "iLovePDF":
            continue
        lines.append(line)

    text = "\n".join(lines)
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    cache_path.write_text(text, encoding="utf-8")
    return text


def main() -> None:
    doc = fitz.open(PDF_PATH)
    ocr = RapidOCR()
    pages = []

    for index in range(doc.page_count):
        text = page_text(ocr, doc, index)
        pages.append(f"## Page {index + 1}\n\n{text}" if text else f"## Page {index + 1}")
        print(f"OCR page {index + 1}/{doc.page_count}: {len(text)} characters", flush=True)

    body = "\n\n".join(pages)
    OUT_PATH.write_text(
        "export const supremeCourtRules2024Text = "
        + json.dumps(body, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
