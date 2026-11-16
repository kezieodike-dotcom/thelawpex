# November 2026 Case Import

This batch adds `case-019` through `case-031` from the 13 supplied DOCX judgments.

## Editorial Standard

- The original DOCX files are preserved under `public/documents/cases/` and recorded by SHA-256 in `provenance.json`.
- The complete judicial opinions remain verbatim in `src/data/judgments/`.
- Public citations use the LAWPEX form `(YEAR) LDLR-NUMBER (S.C)`.
- The three source labels written as `LPELR` are normalised to `LDLR` for the LAWPEX catalogue; the source files remain unchanged.
- Ratios are retained as judicial quotations, not summaries.
- Ratio page and A-G paragraph references are generated from the current LAWPEX pagination and verified only against the judicial opinions.
- Principles are separate editorial propositions and do not repeat the ratio quotations.
- Every case is non-landmark unless an editor expressly changes its status later.

## Reproduction

1. Extract the supplied DOCX paragraphs and tables to `tmp/case-imports/source/`.
2. Run `node scripts/import-november-cases.mjs`.
3. Run `node --import tsx scripts/audit-november-cases.ts --write` until the generated pagination is stable.
4. Run `node --import tsx scripts/generate-case-catalog.ts`.
5. Run `node --import tsx --test tests/november-case-import.test.ts tests/imported-ratio-citations.test.ts`.

The completed source-link audit is in `ratio-audit.md`.

## Source Notes

- `Dagayya v. State`: ratio 1 is attributed to Ikechi Francis Ogbuagu J.S.C. after verification against the opinion.
- `Cotecna Int'l Ltd. v. Ivory Merchant Bank Ltd`: the truncated concluding authority in the competence passage is restored from the opinion.
- `Dada v. Dosunmu`: the final six supplied passages come from Mahmud Mohammed J.S.C.'s dissent and retain that attribution.
- `Ebhota & Ors v. Plateau Investment and Property Development Co. Ltd`: the source coram omits Dennis Onyejife Edozie J.S.C., although a supporting opinion appears in the judgment.
- Where the source contains an impossible or inconsistent date, the discrepancy is preserved in the opinion and identified in the case practice note.
