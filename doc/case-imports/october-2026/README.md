# October 2026 Case Import

Six supplied DOCX files are preserved unchanged in `public/documents/cases/case-013.docx` through `case-018.docx`. SHA-256 checksums and source filenames are recorded in `provenance.json`. `source-paragraphs.json` records the Word XML paragraphs in document order, including tables, without summarisation.

| ID | Source | Citation | Ratios |
| --- | --- | --- | --- |
| case-013 | AMAYO V1.docx | (2000) LDLR-219 (CA) | 1 |
| case-014 | AJIBOYE V.docx | (2006) LDLR-217 (SC) | 10 |
| case-015 | AKINLAGUN.docx | (2006) LDLR-212 (SC) | 16 |
| case-016 | AMADI V.docx | (2005) LDLR-213 (SC) | 2 |
| case-017 | AIGBOBAHI.docx | (2006) LDLR-216 (SC) | 13 |
| case-018 | AMAYO V.docx | (2006) LDLR-218 (SC) | 8 |

The two Amayo documents concern separate appellate decisions and are not duplicates. None of this batch is automatically tagged as a landmark case.

## Editorial Decisions

- Full judgments and ratio quotations retain their wording. Hard-wrapped lines are reflowed and judge headings separated from the opinions that follow them. The source-preservation regression compares all alphanumeric source content with the imported judgment.
- Aigbobahi lacks a summary heading. A `JUDGMENT SUMMARY` heading is supplied before its existing introduction so the reader retains the introduction and ratios before the leading judgment.
- The Amadi source summary identifies Rivers State, whereas the judgment identifies Imo State, Owerri. The digest follows the judgment. The source discrepancy is disclosed in the practice notes, with the original wording retained in Whole Case.
- The Amayo CA text has inconsistent trial-judgment dates. No replacement date has been invented.
- Akinlagun ratio 12 is attributed to Kalgo in the supplied headnote, but its complete quotation is located in Ogbuagu's opinion. Its displayed attribution follows that uniquely matched passage.
- Amayo SC reverses Mukhtar's given-name order between coram/headnotes and the supporting opinion. Source-linked attributions use the name printed above the matched opinion.
- Short source transcription discrepancies such as `estoppel`/`estopel` and `vested`/`rested` are not silently rewritten. Matching permits at most one edit across the entire bounded short passage when ordinary exact-window coverage falls short; both quotation boundaries remain required.
- Principles are distinct editorial legal propositions derived from the supplied judgments, not duplicated ratio headings or quotations. Selected authorities are listed separately; all cited material remains in the full text.

## Reproduce

Run from the repository root:

```powershell
node scripts/import-additional-cases.mjs
node --import tsx scripts/audit-additional-cases.ts --write-metadata
node --import tsx scripts/generate-case-catalog.ts
node --import tsx --test tests/additional-case-import.test.ts tests/imported-ratio-source-boundaries.test.ts
```

The importer recreates the report text and metadata from the archived extraction and editorial manifest. The audit must follow it to populate verified metadata references. Full-case headnotes and ratio details also resolve against the shared rendered paragraph index, so their references stay aligned. No reference is derived from the headnote itself. See `ratio-audit.md` for all 50 references.
