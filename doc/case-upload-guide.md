# LAWPEX Case Upload and Editorial Guide

Reviewed against the repository on **4 November 2026**.

Use this guide when uploading, preparing, reviewing, or publishing subsequent cases. It is based on all 18 bundled cases (`case-001` to `case-018`), their full judgment files, the existing citation audits, and the current administration and shared publishing code. It describes the repository's current behaviour; it does not establish the state of a live deployment or inspect cases held only in its database.

**Publication standard:** retain the original source, verify the complete judgment, prepare a source-supported digest, preserve exact judicial quotations, generate references from the LAWPEX reader, and obtain editorial signoff before publication.

## 1. Normal upload workflow

1. Sign in to the configured LAWPEX administration site and open **Case workspace** or **Upload judgment**. Locally, the separate admin app defaults to `http://localhost:3001`.
2. Search the published library and editorial queue by title, citation, court, year, and suit number before creating a new record. The same parties may have different appellate decisions.
3. Choose **one complete judgment** in PDF or DOCX format using **Choose source**. Enter the case title, LDLR citation, court, and decision year, then choose **Extract and create review draft**.
4. Open **Source document**. Compare the original preview/download against the extracted text from beginning to end. Confirm the leading judgment, every supporting or dissenting opinion, and the final orders are present. Extraction success alone does not prove completeness.
5. Complete **Case details**, **Principles & authorities**, and **Ratio decidendi** using the standards below. Check all AI suggestions against the source and add supported material the suggestions missed.
6. Under **Report verification**, enter the **Exact leading-judgment heading**, an exact supporting quotation for each principle, and any **Duplicate review decision** requested by the application.
7. Choose **Build and verify report**. This moves the report into **Under Review** and calculates LAWPEX page and paragraph references. Resolve every blocking error and run verification again after corrections.
8. Use **Preview LAWPEX report**, inspect **Verified source passages**, and open the linked report pages. Check both ends of every quotation and the judge to whom it belongs.
9. Enter the reviewer's name and complete all four editorial signoffs: source, metadata/digest, ratios/references, and principles. Approve the case, then publish it: **Draft → Under Review → Approved → Published**.
10. Wait for **All changes saved** and a successful publication message. In a separate private browser session, find the case through case search and universal search, open `/case-law/case/<record-id>`, and refresh it. Confirm the digest, full judgment, and ratio source links work.

New uploads and original files use shared database storage. Browser backups are recovery aids. The older browser-only workflow described in parts of [the ingestion audit](admin-case-ingestion-audit.md) has been superseded for shared publishing; use [the deployment guide](admin-deployment.md) for setup and legacy transfers. Do not assume that changing a local file or a browser record publishes a case to all visitors.

## 2. Source-document requirements

- Accept PDF or DOCX, with one decision per upload. A digest or a collection of headnotes alone cannot stand in for the full judgment.
- Preserve the original file unchanged. Retain the filename and original-file SHA-256, together with the independently extracted text and its separate SHA-256. Do not paste reconstructed or AI-generated text into the source fields.
- Check tables, columns, footnotes, page transitions, judge headings, and the final pages. Embedded scans in DOCX can escape text extraction; PDF text can appear in the wrong reading order.
- For a scanned or incomplete source, obtain a checked text-bearing copy or prepare and verify an OCR derivative. Retain the original separately and record what was changed. Upload the checked source for a fresh extraction; do not repair a failed match by silently rewriting the stored extraction.
- Read and resolve warnings. An extraction failure can still leave a draft in the queue; a draft's existence does not mean independent extraction succeeded. Use **Reprocess source** once the source/service issue is resolved.
- Missing or contradictory information must be disclosed in warnings or practice notes. Never invent dates, counsel, coram, suit numbers, quotations, citations, or outcomes.

Current extraction limits are 1,500 PDF pages and 4,000,000 extracted characters. Above 300,000 characters, the AI editorial pass is skipped and manual preparation is required; the source is retained without truncation. The API accepts source uploads up to 64 MB, but deployment limits can be lower. Follow the configured host's limits and the deployment guide.

AI is an editorial assistant. Independent source extraction and manual preparation work without an AI key. A successful AI response does not approve a case.

## 3. Case identity and metadata

| Field | How to prepare it |
| --- | --- |
| Case title | Use the parties and spelling supported by the judgment. Follow the library's readable form, such as `Amayo v. Erinmwingbovo`; retain meaningful `& Ors` or `& Anor`. Preserve the source's original title in the source document. |
| Citation | Use exactly `(YEAR) LDLR-NUMBER (S.C)` for the Supreme Court or `(YEAR) LDLR-NUMBER (C.A)` for the Court of Appeal. Example: `(2006) LDLR-217 (S.C)`. Keep the suit number separate. |
| LDLR number | Use the supplied or editorially confirmed identifier. Do not derive it from the upload order, case ID, or the highest existing number. Preserve meaningful leading zeroes, as in `LDLR-01`. Resolve an unassigned number before publication. |
| Court and year | Verify the court delivering this decision and its decision year. Both must agree with the citation. Do not use the lower court's year or the upload year. |
| Suit number | Copy the appeal/suit number for this decision, preserving its source-supported components. |
| Date delivered | Enter the decision date supported by the judgment, preferably in the library's readable day-month-year style. Do not infer a replacement where source dates conflict. |
| Judicial division | Copy the division when stated. Leave it empty if it is not supplied. |
| Coram | Include every judge on the panel, one judge per line, with the source-supported name and judicial designation. Identify the leading and supporting judges from the actual opinion headings. |
| Counsel | Enter appearances for the correct side as supplied. Do not infer counsel from unrelated proceedings or treat a party's name as counsel. |
| Area of law | Use relevant existing labels, such as `Evidence`, `Civil Procedure`, or `Land & Property Law`; combine relevant areas where supported. |
| Subject | Give a short, specific description of the dispute or research topic. |
| Landmark status | Uploading a case does not make it a landmark. New admin publications and the six October imports default to ordinary cases. Any landmark designation needs an editorial decision through a supported implementation path. |

The current validator blocks a missing title, citation, facts, procedural history, decision, date delivered, or suit number; it also requires a coram, issues, ratios, and principles. Complete other source-supported fields even where the code does not enforce them. If a required fact cannot be established, keep the case unpublished pending editorial resolution.

**Current court limitation:** although the upload dropdown lists other courts, publication validation currently accepts only the Supreme Court and Court of Appeal citation mappings. Keep Federal High Court, National Industrial Court, and State High Court material as drafts until their citation and validation support is implemented. Do not label a decision as an appellate court decision to pass verification.

Original documents and historical audit prose may show `(SC)` or `(CA)`. Preserve those original bytes; the editable publication citation must use `(S.C)` or `(C.A)`.

## 4. Digest and report structure

Prepare the following editorial material separately from the unchanged judicial text:

| Section | Required editorial treatment |
| --- | --- |
| Procedural history | State where the matter began, the relevant lower-court decisions, and how it reached the present court. Keep the different appeals and cross-appeals distinct. |
| Facts | Give the material facts needed to understand the issues. Distinguish allegations and submissions from findings. Retain the reliefs and relevant evidence without inventing detail. |
| Issues for determination | Put one issue per line in the admin editor. Reflect the issues actually considered, explaining any material reframing by the court. |
| Decision / held | State the result, consequential orders, and treatment of any cross-appeal. Check whether the lower judgment was affirmed, reversed, varied, or remitted. |
| Principles of law | Write distinct, source-supported legal propositions, each with an exact supporting judicial passage in Report verification. |
| Authorities | List source-supported cases and citations; preserve their reported identity rather than replacing them with this case's LDLR citation. Do not imply a selected list is exhaustive. |
| Statutes | List the enactments and provisions actually considered, using the version referred to in the judgment. Do not silently substitute a later enactment. |
| Practice notes | Record source discrepancies, editorial attribution corrections, and useful qualifications supported by the judgment. |
| Ratio decidendi | Include every supported ratio selected on full editorial review, with a heading, exact quotation, source judge, and generated LAWPEX reference. |

The current admin compiler assembles these sections in this order:

```text
SUMMARY OF JUDGMENT
PROCEDURAL HISTORY
FACTS
ISSUES FOR DETERMINATION
DECISION / HELD
PRINCIPLES OF LAW
AUTHORITIES
STATUTES
PRACTICE NOTES
RATIO DECIDENDI
[exact leading-judgment heading]
[leading judgment and all remaining source text]
```

The generated report uses the editorial headnote followed by the source from the selected leading-judgment heading to the end. The complete independently extracted source, including its original introductory material, remains preserved separately. The compiler may add a terminal colon to the heading for reader recognition. It must not rewrite the judicial reasoning or omit supporting opinions.

Bundled historical documents may use `JUDGMENT SUMMARY`, contain supplied introductory ratios, or have different front matter. Preserve those sources; use the current compiler for new admin reports instead of manually imitating a historical layout.

## 5. Ratio decidendi rules

Every ratio has three editorial inputs and two generated reference fields:

| Field | Rule |
| --- | --- |
| Heading | Use `AREA - TOPIC - Specific proposition/question`, for example `EVIDENCE - ESTOPPEL PER REM JUDICATAM/RES JUDICATA - Conditions for a successful plea of estoppel per rem judicatam`. |
| Exact judicial wording | Copy a substantive, contiguous passage from the judicial opinion. Preserve the words and sufficient context to express the proposition accurately. A summary, bare attribution, or isolated phrase is insufficient. |
| Judge / attribution | Use the judge heading above the matched opinion. Include the correct designation. A supporting judge can supply a ratio; do not automatically attribute every ratio to the leading judge. |
| LAWPEX page or pages | Generated during successful report verification; read-only in the editor. |
| LAWPEX paragraph or paragraphs | Generated from the same reader index; read-only in the editor. |

For new admin uploads:

- Copy from the judicial opinion, not from the introductory headnote. A quotation appearing in its own headnote is not source evidence.
- The verifier matches one unique complete word sequence within one identified judge's labelled paragraphs. It normalizes case, Unicode, punctuation, and whitespace; it does not accept changed words, fuzzy approximations, or unmarked omissions.
- The implementation requires at least six normalized words, a heading, and an attribution. That minimum does not establish editorial adequacy: include all qualifications necessary for the proposition.
- If a passage occurs repeatedly, use a longer unique contiguous passage. Never select an arbitrary first occurrence.
- If a quotation crosses from one judge's opinion into another, split it into properly attributed entries or select a complete passage within one opinion.
- Do not add ellipses to stitch separated passages together for a new upload. Where separate passages are needed, enter separately supported quotations. Historical bundled audits have bounded matching and explicit-ellipsis handling; those legacy allowances do not apply to the new-upload verifier.
- Do not silently fix spelling/OCR differences to make a quotation match. Compare the original, choose the correct extracted passage, or re-extract a checked corrected source with the discrepancy documented.
- Avoid duplicate quotation entries and do not impose a fixed ratio count. Existing reports range from one ratio to 73. Review all opinions for completeness.

The application formats the display as the heading, quoted passage, and a `Per` attribution. Enter the quotation and judge in their separate fields; do not insert a complete `Per ... (P. ...)` block into the quotation.

## 6. Principles of law are separate editorial propositions

Write each principle as a clear legal proposition in editorial language. It must express the meaning supported by the judgment without merely repeating a ratio heading or reproducing its quotation.

For each principle, paste an **exact supporting judicial quotation** into its corresponding field under Report verification. Principle 1 must have source quotation 1, and so on. The passage must also resolve uniquely within the labelled judicial text.

An existing example is Ajiboye's principle that res judicata requires a final determination by a competent court and identity of parties or privies, issues, and subject matter. Its ratio remains the judge's verbatim passage; the principle is the editorial proposition. Confirm the source and qualifications each time rather than reusing wording mechanically.

Editing the principles list currently clears its supporting quotations. Finish the list, then supply/check every supporting passage before building again. Literal repetition is machine-checked; correctness, scope, and completeness still require the editor.

## 7. LAWPEX citations and pagination

All ratio references refer to **LAWPEX report pages and visible A-G labels**, rather than the original PDF/DOCX pages or printed source paragraph numbers.

- The report's cover/formal opening is page 1. Paragraph lettering belongs to the judicial section, not the editorial headnote.
- Letters start at A on each page and run in order without repeating on that page. A labelled paragraph ends immediately before the next labelled paragraph.
- Cite the actual first and last paragraphs containing the quotation, including both page boundaries when it crosses pages.
- Examples of generated reference forms are `(P. 8, para. E)`, `(P. 8, paras. F-G)`, and `(Pp. 7-8, paras. B-B)`. The last form starts at paragraph B on page 7 and ends at paragraph B on page 8.
- The ratio detail, Whole Case headnote, source navigation, and Word export must agree. Check the currently rendered report, not a historical manually supplied reference.
- Headnote edits can shift the judicial pages. Rebuild and review after edits; never hand-adjust references to match an old audit.

The compiler repeats pagination until the generated references stabilize. An unmatched, ambiguous, cross-judge, wrongly attributed, or unstable quotation blocks publication. The presence of a page number by itself proves nothing.

## 8. Lessons from the existing cases

| Existing case | Guideline for subsequent uploads |
| --- | --- |
| Amayo, `case-013` and `case-018` | These are different Court of Appeal and Supreme Court decisions, with different years and citations. A matching title alone does not establish a duplicate. Record why the new decision is distinct. |
| Adekunle/Adava decisions, `case-004` to `case-007` | Similar titles must be distinguished by full party identity, court, year, citation, and suit number. Do not merge appellate stages. |
| Akinlagun, `case-015`, ratio 12 | The supplied headnote names Kalgo, but the quotation belongs to Ogbuagu's opinion. Verify attribution against the actual passage and document a correction. |
| Fawehinmi, `case-011` | A split leading-judgment heading must not cause the reader to skip the leading opinion and begin at a later supporting judgment. |
| Amadi, `case-016` | The source summary says Rivers State while the judgment identifies Imo State, Owerri. Follow the judgment in the digest, disclose the discrepancy, and retain the source wording. |
| Amayo CA, `case-013` | Conflicting trial-decision dates are preserved and disclosed; no replacement date is invented. |
| Aigbobahi, `case-017` | Its archived import supplies a missing summary heading while preserving source content. Formatting assistance must not turn into rewriting judicial text. |
| Amaechi, `case-009` | A long report has 73 ratios and exceeds the current AI editorial character limit. Full manual review is necessary; truncating it or limiting the number of ratios would lose material. |
| Idundun, `case-001` | Source name variants such as Fatai-Williams/Fatayi-Williams need editorial reconciliation. New uploads must use the matched opinion's heading for attribution. |

Duplicate alerts currently compare normalized titles/citations and available uploaded-source hashes against bundled metadata and the loaded queue. They are prompts for review, not an exhaustive duplicate search. A written **Duplicate review decision** is required when candidates are flagged. Check the actual decision identity; a new record ID does not resolve a duplicated judgment or reused citation.

## 9. Publication blockers and recovery

| Problem | Required action |
| --- | --- |
| Source missing, hash mismatch, or extracted text changed | Recover/reprocess the preserved source; if the source itself needs correction, upload a checked replacement with its provenance retained. Rebuild before signoff. |
| Incomplete extraction or OCR warning | Compare every affected page, obtain a checked text-bearing source, and extract again. Do not mark incomplete text as complete merely to unblock approval. |
| Missing metadata or unsupported citation | Establish the information from the source/editorial record. Use the accepted citation form and matching court/year; leave the case unpublished if unresolved. |
| Leading heading rejected | Copy the unique exact heading from the extracted source, including the leading-judgment designation where supplied. Do not use a `Per` headnote line or a supporting opinion's heading. |
| Quote missing, repeated, or attributed to the wrong judge | Check actual wording, extend to a unique contiguous passage if appropriate, and use the matched source judge. Never guess a reference. |
| Principle repeats a ratio or lacks evidence | Write a distinct supported proposition and provide its exact supporting passage. |
| Possible duplicate | Compare the decisions and record a reasoned resolution before verification. |
| Changed content after verification | Rebuild, inspect the updated references, and obtain fresh signoffs. Editing an approved/published report returns it to review and withdraws it from shared public API results until republished. |
| Save failure, conflict, or connection failure | Export the current editorial backup before reloading. Reload the latest shared record, reconcile the edits, then verify again. Do not treat an unsaved local status as publication. |

Approval and publication are checked on the server against the preserved source, rebuilt report, current validation, required signoffs, and status sequence. A reviewer name or browser backup alone is insufficient.

Use **Export editorial backup** for editorial records, **Download saved revision** in Audit history for retained approval/publication snapshots, and the source download for the original. An editorial JSON export alone is not a complete source-document backup. Legacy browser-workspace transfers have a separate import/export format described in the deployment guide.

## 10. Final publication checklist

- [ ] One complete decision is attached, with unchanged original bytes and valid source/text fingerprints.
- [ ] The complete extraction has been compared with the original, including every judicial opinion and the ending.
- [ ] Title, LDLR identifier, court, year, suit number, date, coram, division, and available counsel have been checked.
- [ ] Related appellate decisions and possible duplicates have been distinguished and any alert resolved in writing.
- [ ] Facts, procedural history, issues, result, and orders accurately reflect this decision.
- [ ] All ratio quotations are substantive, exact, complete in context, uniquely matched, and attributed to the correct source judge.
- [ ] Each principle is distinct and has its own checked supporting passage.
- [ ] Authorities, statutory provisions, and source discrepancies are recorded accurately.
- [ ] **Build and verify report** has succeeded for the latest content, with no blocking errors.
- [ ] The report preview and every first/last page and paragraph reference have been inspected.
- [ ] The named reviewer has completed all four signoffs, followed by approval and publication.
- [ ] Shared saving has completed and the case works in a separate public browser session.
- [ ] The original and editorial/revision backups are retained appropriately.

## 11. Reusable editorial worksheet

This is a preparation worksheet, **not** an importable JSON record. Generated IDs, hashes, verification results, references, and approvals must come from the application.

```text
Source filename / provenance:
Case title:
Citation: (YEAR) LDLR-NUMBER (S.C or C.A)
Court / year:
Suit number / date delivered / judicial division:
Coram (one judge per line):
Counsel for each side:
Area(s) of law / subject:
Procedural history:
Material facts:
Issues for determination (one per line):
Decision / held and orders:

For EACH ratio:
  Heading: AREA - TOPIC - Proposition/question
  Exact contiguous judicial passage:
  Judge heading / attribution:
  LAWPEX pages / paragraphs: [generated after verification]

For EACH principle:
  Distinct editorial proposition:
  Exact supporting judicial passage:

Authorities / statutes and sections:
Practice notes / source discrepancies:
Leading-judgment heading (exact):
Duplicate review decision, if flagged:
Outstanding uncertainties:
Reviewer / verification and signoff record:
Public verification URL after publication:
```

## 12. Repository maintenance and verification

Routine uploads should use administration. A deliberately bundled repository import is a separate developer workflow:

1. Preserve originals and an ordered source extraction with filenames and SHA-256 provenance, following [the October import archive](case-imports/october-2026/README.md).
2. Use a stable unused ID, add metadata to the appropriate case collection, and add the full judgment at `src/data/judgments/<id>.json`. Keep registration in `src/data/legalData.ts` and public reader loading consistent. The loader discovers judgment JSON assets, but `CaseLawView.tsx` also has explicit `SOURCE_LINKED_CASE_IDS` and `STRUCTURED_IMPORT_CASE_IDS` sets: review the applicable reader path and format flags when adding a bundled case. Adding a JSON file alone does not complete integration. Do not reuse an existing case ID or report citation.
3. Keep editorial inputs in the import manifest/source of truth, preserve all source wording, and audit every ratio against actual judicial paragraphs. Treat derived files as generated output.
4. Regenerate the lightweight catalog with `node --import tsx scripts/generate-case-catalog.ts`; do not put full judgments or full ratios into `src/data/caseCatalog.json`. Regenerate the catalog again after changing metadata.
5. Run the focused source, ratio, and publication checks appropriate to the import. Before releasing application changes, also run TypeScript checks and both builds.

`scripts/import-additional-cases.mjs` and `scripts/audit-additional-cases.ts` are hard-coded to the October six-case manifest and output files. They are reproduction tools for that batch, not a generic new-upload command. The imported-ratio audit script also writes its Markdown audit files. Adapt a new batch deliberately rather than rerunning these expecting a new case to be appended.

Run relevant existing checks from the repository root:

```powershell
node --import tsx --test tests/case-ingestion-review.test.ts tests/case-source-extraction.test.ts tests/additional-case-import.test.ts tests/imported-ratio-source-boundaries.test.ts
npm run test:publishing
```

For application changes before release:

```powershell
npm run lint
npm run build:all
```

Do not change canonical pagination or `lawpex-reviewed-v1` casually. Update `REPORT_LAYOUT_VERSION` and `CaseLaw.reportFormatVersion` together when changing the layout contract, then revalidate affected ingested reports.

### Case collection reviewed

These counts come from each full source report through the current reader's ratio audit, rather than only the lightweight catalog or fallback metadata. They are a snapshot, not target counts for future cases.

| ID | Case | Citation | Source-linked ratios |
| --- | --- | --- | ---: |
| case-001 | Idundun & Ors v. Okumagba & Ors | (1976) LDLR-1012 (S.C) | 2 |
| case-002 | Mrs Theresa Udo v. Dr Peter Idundun & Anor | (2022) LDLR-1043 (C.A) | 1 |
| case-003 | Adewuyi v. Odukwe | (2005) LDLR-590 (S.C) | 5 |
| case-004 | Adekunle v. State | (2006) LDLR-67 (S.C) | 14 |
| case-005 | Adava & Anor v. State | (2006) LDLR-257 (S.C) | 4 |
| case-006 | Adeoye Adekunle v. The State | (2018) LDLR-1200 (C.A) | 11 |
| case-007 | Tunde Adava & Anor v. The State | (2002) LDLR-357 (C.A) | 2 |
| case-008 | Mojekwu v. Mojekwu | (1997) LDLR-01 (C.A) | 11 |
| case-009 | Amaechi v. INEC & Ors | (2008) LDLR-02 (S.C) | 73 |
| case-010 | Madukolu & Ors v. Nkemdilim | (1962) LDLR-03 (S.C) | 6 |
| case-011 | Fawehinmi v. NBA & Ors | (1989) LDLR-04 (S.C) | 11 |
| case-012 | Ojukwu v. Military Gov. of Lagos State & Ors | (1985) LDLR-05 (C.A) | 6 |
| case-013 | Amayo v. Erinmwingbovo | (2000) LDLR-219 (C.A) | 1 |
| case-014 | Ajiboye v. Ishola | (2006) LDLR-217 (S.C) | 10 |
| case-015 | Akinlagun & Ors v. Oshoboja & Anor | (2006) LDLR-212 (S.C) | 16 |
| case-016 | Amadi v. Orisakwe & Ors | (2005) LDLR-213 (S.C) | 2 |
| case-017 | Aigbobahi & Ors v. Aifuwa & Ors | (2006) LDLR-216 (S.C) | 13 |
| case-018 | Amayo v. Erinmwingbovo | (2006) LDLR-218 (S.C) | 8 |
| **Total** | **18 cases** | | **196** |

### Implementation references

- [Admin upload and editorial editor](../admin/src/AdminCaseIngestionView.tsx)
- [Report verification, evidence, and signoff interface](../admin/src/ReportVerificationPanel.tsx)
- [Source extraction and AI suggestion constraints](../src/server/caseReportExtraction.ts)
- [Editorial validation and publication gaps](../src/lib/caseReportReview.ts)
- [Canonical report assembly and exact quotation verification](../src/lib/compileCaseReport.ts)
- [Admin record schema and public-case conversion](../src/data/caseIngestion.ts)
- [Server publication checks](../src/server/casePublishing.ts)
- [Case reader, pagination, and bundled citation auditing](../src/components/modules/CaseLawView.tsx)
- [First-seven ratio audit](first-seven-case-ratio-audit.md), [landmark import ratio audit](imported-case-ratio-audit.md), and [October ratio audit](case-imports/october-2026/ratio-audit.md)

When implementation and an older audit differ, check the current code, fresh validation, and rendered source before updating this guide. Historical references and counts must never override the actual source passage.
