# Legal Source Layout

Laws and rules keep their existing canonical text and source page numbers. Layout
sidecars in `public/documents/layouts/` describe which canonical lines belong to
the main column and which belong to the original left or right margin.

The generator reads actual PDF coordinates with PyMuPDF. For scanned rulebooks,
RapidOCR locates margin labels and short paragraph prefixes. OCR output is used
only to bind positions; it never replaces, summarises or invents canonical text.
Uncertain matches stay in the body rather than being guessed into annotations.

On desktop, notes appear in their original-side rail beside the corresponding
provision. On smaller screens, clearly labelled marginal notes appear below the
associated paragraph. Numbered provisions, paragraph breaks, indents and section
anchors remain separate. Layout loading is lazy and cached per document; readers
do not download PDFs or run OCR to display the text.

## Regeneration

Use Python environments containing `pymupdf` and `rapidocr-onnxruntime`, respectively:

```text
python scripts/build-legal-source-layout.py --extract
python scripts/build-legal-source-layout.py --ocr
python scripts/build-legal-source-layout.py --assemble
```

The three commands may use different Python executables. Local extraction/OCR
caches live under `tmp/source-layout-cache/` and are not published. The OCR phase
uses at most four bounded CPU workers and resumes completed pages. Add new
source/text pairs to `DOCUMENTS` before regenerating.

If a source PDF changes, use a fresh cache. Extraction refuses to reuse coordinates
bound to a different PDF. The generated manifest `src/data/legalSourceLayouts.json`
registers only available sidecars. A UTF-8 text fingerprint and complete unique
line-index checks prevent stale/corrupt layouts from hiding or relocating words.
The fingerprint is a revision guard, not a legal authenticity certification.

Before publishing, run the source-layout unit and browser tests and inspect the
desktop/mobile screenshots against the original PDF. In particular, check the
CAMA sections 3-6 and Supreme Court Rules Order 2 examples. Original PDFs and
canonical text files must remain unchanged by layout-only work.
