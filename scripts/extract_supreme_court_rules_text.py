import json
import re
import sys
from pathlib import Path

try:
    import pymupdf as fitz
except ImportError:
    import fitz


ROOT = Path(__file__).resolve().parents[1]
CACHE_DIR = ROOT / "tmp" / "ocr-text"

DOCUMENTS = {
    "supreme-court": {
        "pdf_path": Path(r"C:/Users/USER/Downloads/Supreme-Court-Rules-2024.pdf"),
        "out_path": ROOT / "src" / "data" / "supremeCourtRules2024Text.ts",
        "export_name": "supremeCourtRules2024Text",
        "cache_prefix": "supreme-court-rules-2024",
    },
    "court-of-appeal": {
        "pdf_path": Path(r"C:/Users/USER/Downloads/Court-of-Appeal-Rules-CARs-2021-TheNigerialawyer.pdf"),
        "out_path": ROOT / "src" / "data" / "courtOfAppealRules2021Text.ts",
        "export_name": "courtOfAppealRules2021Text",
        "cache_prefix": "court-of-appeal-rules-2021",
    },
    "constitution": {
        "pdf_path": Path(r"C:/Users/USER/Downloads/UPDATED-1999-CONSTITUTION-INCLUDING-1ST-TO-5TH-ALTERATIONS-1 (1).pdf"),
        "out_path": ROOT / "src" / "data" / "constitution1999Text.ts",
        "text_out_path": ROOT / "src" / "data" / "constitution1999Text.txt",
        "export_name": "constitution1999Text",
        "cache_prefix": "constitution-1999-as-amended",
        "prefer_text_layer": True,
    },
}


def normalise_line(line: str) -> str:
    line = line.replace("\ufeff", "").replace("\ufffd", "-")
    line = line.replace("�", "-")
    line = re.sub(r"\s+", " ", line).strip()
    return line


def text_layer_page_text(doc: fitz.Document, page_index: int) -> str:
    text = doc[page_index].get_text("text").replace("\r\n", "\n").replace("\r", "\n")
    return "\n".join(line.rstrip() for line in text.split("\n")).strip()


def page_text(ocr, doc: fitz.Document, page_index: int, cache_prefix: str) -> str:
    cache_path = CACHE_DIR / f"{cache_prefix}-page-{page_index + 1:03}.txt"
    if cache_path.exists():
        return cache_path.read_text(encoding="utf-8")

    pix = doc[page_index].get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    image_path = ROOT / "tmp" / "ocr-pages" / f"{cache_prefix}-page-{page_index + 1:03}.png"
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
    document_key = sys.argv[1] if len(sys.argv) > 1 else "supreme-court"
    if document_key not in DOCUMENTS:
        valid = ", ".join(sorted(DOCUMENTS))
        raise SystemExit(f"Unknown document {document_key!r}. Expected one of: {valid}")

    config = DOCUMENTS[document_key]
    doc = fitz.open(config["pdf_path"])
    ocr = None
    pages = []

    for index in range(doc.page_count):
        text = ""
        if config.get("prefer_text_layer"):
            text = text_layer_page_text(doc, index)
        if not text and not config.get("prefer_text_layer"):
            if ocr is None:
                from rapidocr import RapidOCR

                ocr = RapidOCR()
            text = page_text(ocr, doc, index, config["cache_prefix"])
        pages.append(f"## Page {index + 1}\n\n{text}" if text else f"## Page {index + 1}")
        print(f"Extracted page {index + 1}/{doc.page_count}: {len(text)} characters", flush=True)

    body = "\n\n".join(pages)
    if "text_out_path" in config:
        config["text_out_path"].write_text(body, encoding="utf-8")
        config["out_path"].write_text(
            f"import {config['export_name']} from './{config['text_out_path'].name}?raw';\n"
            f"\nexport {{ {config['export_name']} }};\n",
            encoding="utf-8",
        )
    else:
        config["out_path"].write_text(
            f"export const {config['export_name']} = "
            + json.dumps(body, ensure_ascii=False, indent=2)
            + ";\n",
            encoding="utf-8",
        )
    print(f"Wrote {config['out_path']}")


if __name__ == "__main__":
    main()
