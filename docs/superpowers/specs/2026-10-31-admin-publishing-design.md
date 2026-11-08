# Separate admin and shared publishing

The user selected shared publishing and authorized implementation on 2026-10-31.

## Intent
Move administration into `admin/`, independently buildable for `admin.lawpex.com`. A case published there must be available to visitors on the main website, including in search and direct case links.

## Approaches
Folder separation with browser storage was considered but does not share publications across origins or visitors. The selected approach separates the admin frontend while both sites use the same PostgreSQL database through the existing Express API. PostgreSQL is provider independent; no database connection has been supplied in this checkout.

## Design
- Reuse existing report components, review rules, and public reader. Preserve the current editorial approval and verification gates.
- Store editorial records, original source files, and revision snapshots in shared storage. Public APIs return only published case projections, never drafts or editorial/private source metadata.
- Protect all admin API operations, including extraction, with an HttpOnly session cookie. Credentials and session secrets are server environment variables. Enforce same-origin mutations and login throttling.
- Use optimistic database versions to reject conflicting edits. Surface failed saves and do not report publication success before the server confirms it.
- Fetch shared published cases in public home, search, universal search, and direct case readers. Refresh on focus and periodically so an open public page sees newly published cases.
- Keep old browser records as a recoverable backup and offer explicit import from the old origin before redirecting users to the new admin app.
- Build public output in `dist/` and admin output in `dist-admin/`. Keep local Express development and document two deployments with a shared database. Do not provision a paid service or change live DNS without the actual account/project configuration.

## Constraints and builder decisions
Use the existing React/Vite/Express stack and existing checkout on a feature branch. No unrelated redesign. Production must not silently fall back to browser-only publication or ephemeral filesystem storage. Configuration and database initialization must be documented and verifiable. Deployment requires database credentials, admin credentials, and domain configuration outside this repository.
