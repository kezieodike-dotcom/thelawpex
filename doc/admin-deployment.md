# Admin subdomain and shared case publishing

The administration frontend lives in `admin/`. Its build is independent of the public website; shared report components and types remain under `src/`. Both sites use same-origin `/api` endpoints and the **same PostgreSQL database**. Browser storage is no longer used as the public source of newly uploaded cases.

## Publishing behavior

1. Sign in to administration and upload a PDF or DOCX judgment. The original file and editorial record are stored privately in the database.
2. Complete editorial fields and run report verification. The server independently checks the preserved document fingerprint and rebuilds the report before accepting approval or publication.
3. Complete all editorial signoffs, move to **Under Review**, then **Approved**, then **Published**.
4. The public homepage, case search, universal search, and direct case URL use the shared published collection. New visits fetch current records; open pages refresh when focused and every 30 seconds while visible.
5. Editing a published report returns it to review. It disappears from public API results until approved and published again. Concurrent editing conflicts are rejected instead of overwriting another session's work.

The bundled existing case collection remains available. Shared database publications are added to it. The shared API never returns drafts, source attachments, revision snapshots or editorial audit logs to anonymous visitors.

## One-time database and admin setup

Use a PostgreSQL database from your hosting provider. Store the database URL only in server environment variables. A database with persistent storage is required; local files and serverless temporary directories are not used for publication.

1. Copy `.env.example` to `.env` for local development or configure the corresponding variables in your hosting dashboard.
2. Set `DATABASE_URL` to your provider's pooled connection URL. Follow the provider's TLS/certificate instructions; certificate verification is not disabled by the application.
3. Run `npm run db:init` once against the target database. It creates the `lawpex` schema and its tables/index. Re-running it preserves existing records. The application role needs usage and read/write access to this private schema; the initialization role also needs schema/table creation permissions.
4. Run `npm run admin:credentials` in a private terminal. Save the generated password in a password manager. Set the resulting `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` on the server, and set `ADMIN_EMAIL`. Never put these values in variables beginning with `VITE_`.
5. Set `APP_URL=https://lawpex.com` and `ADMIN_URL=https://admin.lawpex.com` on both API deployments. Admin mutation requests require an allowed origin. Production sessions use secure, HttpOnly cookies, expire after eight hours, and are revoked on sign out. Changing the password hash or session secret also invalidates existing sessions. Sign-in attempts are throttled in shared storage.

Keep `lawpex` outside any provider's exposed Data API schemas. Do not grant direct anonymous access to its tables. Only the authenticated server connects to them. Back up both `lawpex.cases` and `lawpex.sources`, since sources and revision snapshots are part of the editorial record. The initial implementation stores source bytes in PostgreSQL; plan database capacity for uploaded documents.

## Run locally

Use Node.js 22+ and run `npm ci`. After database initialization and credential configuration:

```text
npm run dev          # public site: localhost:3000
npm run dev:admin    # admin app: localhost:3001, in a second terminal
```

For local development, use `APP_URL=http://localhost:3000`, `ADMIN_URL=http://localhost:3001`, `VITE_PUBLIC_SITE_URL=http://localhost:3000`, and `VITE_ADMIN_SITE_URL=http://localhost:3001`. Both servers load `.env` from the repository root. If `.env` contains `PORT`, it applies to both commands; omit it to use the separate defaults, or override it per process. No database or credentials means the public bundled collection still loads, while shared library APIs and administration return clear setup errors.

## Deploy two sites

The root directory for both deployments must be the **repository root**, because the admin app reuses shared code. Set the frontend variables before building:

| Setting | Public site | Admin site |
| --- | --- | --- |
| Build command | `npm run build` | `npm run build:admin` |
| Frontend output directory | `dist` | `dist-admin` |
| Domain | `lawpex.com` (and optional `www`) | `admin.lawpex.com` |
| `VITE_PUBLIC_SITE_URL` | `https://lawpex.com` | `https://lawpex.com` |
| `VITE_ADMIN_SITE_URL` | `https://admin.lawpex.com` | `https://admin.lawpex.com` |

Both deployments need the same server database/auth environment variables. The provided Vercel configuration routes `/api/*` to `api/index.ts` before the SPA fallback, so API calls do not receive `index.html`. Select Vite as the framework and set each project's output directory/build command explicitly. This repository configuration has been exercised locally; attaching live projects and domains still requires access to the intended hosting account and database.

Vercel Functions have a request/response body size limit (currently 4.5 MB), which is lower than the app's 64 MB self-hosted upload limit. Use small judgment files when deploying the API there. For larger sources, host the existing Express API on a Node service and reverse-proxy `/api` from both domains to it, or add direct object-storage uploads. Do not increase a frontend limit expecting it to override the hosting provider's limit. See [Vercel Functions limits](https://vercel.com/docs/functions/limitations).

For a Node host or VPS, build with `npm run build:all`, then run `npm start` for public and `npm run start:admin` for admin, with `NODE_ENV=production`. A reverse proxy must route each domain to its server port. Both processes use the same database. Configure the host's request body limit to support the source files you accept. No CORS setup or cross-subdomain browser cookies are needed because each frontend calls its own origin's API.

In the hosting dashboard, attach `admin.lawpex.com` to the admin project/service, then create the **exact DNS record the host provides** at the domain's DNS provider. Wait for verification and HTTPS issuance. DNS values are provider-specific and are not guessed by this code change. `admin/` is an application folder, not a DNS destination.

## Transfer old browser-only cases

Open `/admin` on the **old public origin in the same browser/profile** used for uploads. If records exist, choose **Download old workspace**. The backup includes records and all available originals/revision snapshots. Sign in to the new admin site and choose **Import old workspace**. Existing IDs are skipped; imports start as drafts and must pass verification and approval before shared publication. The old browser data is retained. There is no way for a different origin to silently read the old origin's localStorage or IndexedDB.

The admin also offers an editorial JSON export for recovering unsaved field changes after a conflict or connection failure. This export is a record backup, not the complete legacy source-document transfer format. If saving fails, export before reloading the workspace.

## Verify after deployment

- Sign in, upload a real judgment, verify it, approve it, and publish it.
- Open the public site in a separate private browser session. Find the case through case search and universal search, then open and refresh its direct case URL.
- Change the report in admin and confirm it disappears from the public shared library when returned to review.
- Sign out and verify admin record/source/extraction requests return `401`.
- Run `npm run lint`, `npm run test:publishing`, and `npm run build:all` before release.

## Local validation notes

Shared publishing integration tests exercise a real embedded PostgreSQL engine (PGlite), actual HTTP requests, authenticated source storage, database restart persistence, approval/publication gates, conflict rejection, withdrawal and session revocation. The public client test checks a fresh visitor and refresh after withdrawal.

The full existing test suite had these eight failures before this change, and the post-change run retained the same failures:

- `draft wizard exposes the approved four-stage drafting workflow`
- `wizard step controls allow direct navigation through all four stages`
- `the 1999 Constitution is the first Law of the Federation with official PDF and text`
- `federal-law cards can render official law text before falling back to PDF-only display`
- `Court of Appeal Rules 2021 is registered with its official PDF and text`
- `dev server binds the port without waiting for Vite middleware startup`
- `official text reader keeps raw text while using a more readable legal-document layout`
- `Supreme Court Rules page exposes the official rules as selectable text`

The local browser fixture server (`npm run preview:publishing`) uses disposable test data and test credentials and binds only to loopback ports 18080/18081. Never deploy it. Run `npm run test:browser:publishing` with `PLAYWRIGHT_MODULE` pointing to an installed Playwright package to exercise the production builds, cross-session publication/search, withdrawal, concurrent status saves, legacy import and sign-out. It requires `npm run build:all` first. The older browser scripts that seed localStorage describe the previous browser-only workspace; use the shared-publishing browser suite for this architecture.

Browser verification was attempted with both interactive browser tooling and a local Playwright runner. Chrome failed to start within the timeout on this machine, which had about 220 MB of free memory. No successful visual/UI verification is claimed. Re-run the browser suite on a machine with a working browser before releasing. Production builds, TypeScript checking, publishing HTTP/database tests and the Vercel API rewrite handler test passed locally.
