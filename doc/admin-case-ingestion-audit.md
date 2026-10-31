# Admin Case Ingestion: Audit and Verification Workflow

## Findings addressed

- DOCX extraction previously truncated input at 180,000 characters and asked AI to reproduce the full judgment. Source text is now extracted independently with Mammoth or PDF.js. AI cannot overwrite it.
- PDF text previously depended entirely on the model. Textless/low-text PDF pages now flag an incomplete extraction and block approval. PDF reading order still needs visual review.
- AI JSON was spread into the record without runtime validation. Zod now limits accepted suggestion fields; interrupted, malformed or failed AI output is rejected while retaining the independently extracted source.
- Page/paragraph fields were merely checked for non-empty values. The new compiler uses the public reader's own pagination and A-G targets, matching complete quotation word sequences and both boundaries. Missing, ambiguous, cross-judge and wrongly attributed matches block publication.
- Principles could repeat ratios. Each principle now needs a distinct proposition, a supporting judicial passage and editorial signoff. Literal repetition is blocked; substantive legal correctness requires the editor.
- Approved edits could remain approved. Content edits invalidate validation and signoffs and return approved/published records to review.
- Imported records were outside the public source-linked report path and could trigger a failed judgment fetch. Reviewed reports now use the same canonical layout and inline full-text reader, with links to their source paragraphs.

## Workflow

1. Upload one PDF or DOCX judgment. The original file remains in IndexedDB. The independently extracted text and original/text SHA-256 fingerprints accompany the draft.
2. Review all metadata, the digest, ratios, distinct principles and their supporting quotations. Missing AI configuration does not prevent source extraction or manual editorial work.
3. Copy/confirm the exact leading-judgment judge heading from the source. Do not select a Per attribution or a supporting judge's heading. Compare the source preview/download and extracted text from beginning to end.
4. Select **Build and verify report**. The compiler assembles the editorial headnote and preserves the source from the chosen leading judgment to the end. Only a missing terminal colon in the judge heading is normalised for the reader. Original source bytes and extracted text remain unchanged.
5. References are recalculated until headnote pagination stabilises. Both the separate ratio and the full-report ratio use the same generated reference. They are not subsequently rewritten by the legacy fuzzy citation resolver.
6. Inspect the full report and source passages. Enter the reviewer's name and confirm source completeness, metadata/digest, ratios/references, and principles. Machine checks alone cannot approve a case.
7. Approve, then publish locally. Approval/publication snapshots are retained in IndexedDB and downloadable from audit history. Export an editorial backup and original file before clearing browser data.

References denote LAWPEX report pages and labelled paragraphs, not the original PDF's page numbers. The cover is page 1. Paragraph lettering starts in the judicial section, not the headnote. The existing reader's pagination remains authoritative across viewports.

## Deliberate fail-closed behaviour

- No guessed reference for an unmatched quote, no fuzzy acceptance, no arbitrary first-match selection.
- Exact matching ignores punctuation/case/whitespace but preserves word boundaries and word order. Elliptical or OCR-corrupted quotations must be corrected/reviewed; they are not reconstructed automatically.
- Original-source and extracted-text fingerprints must match before browser verification.
- Possible duplicates require an explicit editorial resolution. Validation rechecks titles, citations and uploaded-source hashes against the current local queue and bundled catalogue.
- AI editorial input above 300,000 characters falls back to manual work, without truncating source text. Extraction above 4 million characters or 1,500 PDF pages is rejected rather than partially accepted.
- Legacy browser-published records without current verification are not exposed by the local published-record adapter. Reprocess and review them. Bundled cases are unaffected.
- `REPORT_LAYOUT_VERSION` and `CaseLaw.reportFormatVersion` must be updated together when canonical pagination rules change, followed by revalidation of ingested reports. The fingerprint detects stale local content; it is not a security signature.

## Remaining production requirements

This is a local editorial accuracy upgrade, not a production multi-user case repository. Original files, drafts, local publication and audit revisions remain browser-local. The current Vercel configuration is a static SPA rewrite; the Express extraction endpoint is available when the application server runs, not through that static rewrite alone.

Before shared production use, implement authenticated administrator/editor roles, server-enforced approval transitions, durable shared database/object storage, private source access, server-side verification/signing, background extraction/OCR jobs, resource isolation and rate limits, durable audit history, backup/restore, and public indexing of approved revisions. Do not treat a reviewer name, localStorage or a browser checksum as authentication or tamper-proof audit evidence.

DOCX extraction does not guarantee fidelity for embedded scanned pages; PDF extraction does not guarantee column or footnote reading order. Visual source review is mandatory. AI can miss a ratio or misunderstand a proposition, so the editor must verify completeness and meaning even when every quotation match succeeds. No zero-error guarantee is made.

## Verification

- `node --import tsx --test tests/case-ingestion-review.test.ts tests/case-source-extraction.test.ts`
- `node --import tsx --test tests/additional-case-import.test.ts tests/imported-ratio-source-boundaries.test.ts`
- `node tests/admin-report-verification.browser.mjs` against the running app; set `PLAYWRIGHT_MODULE` to the installed Playwright module if it is not in project dependencies.
- `node tests/admin-workspace.browser.mjs` for existing queue/layout regression coverage.
- `npm run lint` and `npm run build`.

Browser tests use an isolated browser context and synthetic cases; they do not publish test material to the user's workspace. Live AI semantic quality is not covered by deterministic tests.

### Verification outcome for this change

- 41 focused extraction, report-verification and existing-case regression checks passed, including all 18 bundled cases.
- Both admin browser suites passed, including 320px/390px layouts, blocked approval, saved approval/publication revisions, exact source navigation and invalidation after edits.
- A real DOCX multipart request retained 26,082 extracted characters with correct source/text SHA-256 hashes while AI was disabled. PDF.js also extracted a 27-page text-bearing PDF successfully.
- Production build and TypeScript checks passed.
- The complete suite reported 88 passing and 8 failing tests. The failures concern unchanged AI-wizard, Constitution/rules registration, reader typography and pre-existing development-startup expectations. They were not hidden or changed to force a passing suite.
- No Gemini key is configured in the current local environment. AI suggestions therefore remain unavailable until configured; independent extraction and manual editorial verification work without it.
