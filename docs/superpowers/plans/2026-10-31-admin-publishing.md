# Admin Publishing Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. The user explicitly authorized proceeding; execute inline in the existing checkout.

**Goal:** Independently host admin and share published cases with every public visitor.

**Architecture:** Separate Vite entrypoint in `admin/`; shared Express APIs backed by PostgreSQL; authenticated admin writes and anonymous published projections. Browser caches support responsive editing, never act as the public source of truth.

**Tech Stack:** React 19, Vite 6, Express 4, PostgreSQL, node-postgres, Node crypto.

**Spec:** `docs/superpowers/specs/2026-10-31-admin-publishing-design.md`

## Global Constraints
- Preserve report verification, editorial signoff, and approval before publication.
- No credentials in browser bundles; no live deployment or DNS changes without configuration.
- Work in the current checkout on `codex/separate-admin-shared-publishing`.

## Review Focus
- Drafts, source files, and failed publication attempts never leak through public endpoints.
- Concurrent editing conflicts must preserve the database record and surface an error.
- Fresh public browser sessions must see newly published cases; withdrawals must disappear.
- Missing database/auth configuration must fail clearly and deny admin access.
- Browser-only legacy records must remain exportable/importable rather than being silently lost.

### Task 1: Shared storage and authenticated API
Files: `src/server/caseRepository.ts`, `src/server/adminAuth.ts`, `src/server/casePublishing.ts`, `scripts/init-database.ts`, `scripts/admin-password.ts`, `server.ts`, `api/index.ts`, `tests/shared-publishing.test.ts`.
Interfaces: repository CRUD with integer versions and source file storage; public GET `/api/cases`; protected `/api/admin/session`, `/api/admin/cases`, `/api/admin/sources`.
- [ ] Write failing tests for unauthenticated denial, draft isolation, publication, withdrawal, validation, version conflicts, logout, missing configuration, and persistence between repository instances.
- [ ] Run tests to verify the missing implementation fails.
- [ ] Implement SQL schema, repository, auth, routes, and server entrypoint separation.
- [ ] Run API tests and typecheck.

### Task 2: Admin folder and shared client storage
Files: `admin/`, `src/data/caseIngestion.ts`, `src/lib/adminApi.ts`, `src/components/modules/Admin*.tsx` (move to admin), `src/App.tsx`, `src/components/Footer.tsx`, `package.json`.
Interfaces: admin session bootstrap and serialized writes to Task 1 endpoints, same-origin API URLs, standalone build and dev server.
- [ ] Add integration checks for admin root/login and legacy route redirect before implementation.
- [ ] Move admin-only components/styles, implement login/session, shared sources/records, conflict/error display, logout, and legacy data transfer.
- [ ] Verify admin build excludes public app shell and public build excludes admin workspace.

### Task 3: Public integration and deployment instructions
Files: `src/lib/publishedCases.ts`, public home/search/readers/universal search, `vercel.json`, `.env.example`, `README.md`, `doc/admin-deployment.md`, tests.
Interfaces: reactive published case hook with loading/error state and periodic/focus refresh.
- [ ] Add failing tests for fetching new publications and withdrawing old ones, and public direct-link loading behavior.
- [ ] Implement public shared-library consumers, API deployment routing, both builds, setup instructions and database commands.
- [ ] Run typecheck, public/admin builds, relevant API/browser checks, and existing test suite; report any baseline failures separately.

## Execution ledger
- Plan authorized by the user's instruction to choose shared publishing and go ahead.
- Existing checkout reused per desktop instructions; feature branch created. No new worktree required.
- Task 1: complete. PostgreSQL API integration, source verification, conflict handling, durable storage and authentication checks pass.
- Task 2: complete. Admin components/styles moved to `admin/`; standalone build, shared autosaves/sources, login/logout and legacy transfer implemented.
- Task 3: implemented. Public consumers fetch the shared collection, Vercel API routing and deployment instructions added. Hosting/database credentials and live DNS remain external configuration.
- Verification: `npm run test:publishing` passed 11 tests (including seven existing report tests imported by the fixture). Full test run: 105 passed, eight failures identical to the baseline. Public/admin production builds and TypeScript checks passed before final review fixes; final checks are recorded in the task response.
- Review: a read-only reviewer found stale status-response state and a stale legacy-import collection. Both were corrected to use current shared records. PDF preview MIME and export-before-sign-out were also corrected.
- Regression: JSONB property reordering invalidated the original review fingerprint. A failing test reproduced it, and canonical JSON fingerprinting fixed it.
- Final validation: final admin build and server bundle succeeded; the Vercel API rewrite handler test passed. Browser launch timed out in both available browser tools and the local Playwright runner, so UI verification remains unconfirmed. No live hosting or database credentials were provided.
