# LAWPEX

**Nigeria's AI-Powered Litigation & Legal Research Platform**

LAWPEX is an AI-powered legal research, litigation, courtroom-practice and legal-education
platform built for Nigerian legal practitioners — lawyers, judges, magistrates, law firms,
legal researchers, paralegals and law students.

The app is a React 19 + Vite single-page frontend served by an Express server that also
exposes AI endpoints backed by Google Gemini (with a rich offline fallback when no API key
is configured).

## Pages

Every module is a real page with its own URL, so pages can be linked, bookmarked,
refreshed and navigated with the browser back/forward buttons.

| Path                     | Page                                             |
| ------------------------ | ------------------------------------------------ |
| `/`                      | Home                                             |
| `/ai-assistant`          | AI Litigation Assistant (ask / draft / summarize) |
| `/dashboard`             | My Workspace                                     |
| `/areas-of-law`          | Areas of Law                                     |
| `/areas-of-law/:areaId`  | A single practice area (e.g. `/civil-litigation`) |
| `/case-law`              | Case Law Library                                 |
| `/court-rules`           | Court Rules Library                              |
| `/nigerian-laws`         | Nigerian Laws (Statutes)                         |
| `/appeals`               | Appeals Centre                                   |
| `/drafts`                | Legal Draft Library                              |
| `/affidavits`            | Affidavits Library                               |
| `/courtroom-practicals`  | Courtroom Practicals (video learning)            |
| `/articles`              | Legal Articles                                   |
| `/compliance`            | Compliance Hub                                   |
| `/learning`              | Learning Centre                                  |
| `/pricing`               | Pricing / Subscriptions                          |
| `/admin`                 | Admin Panel                                      |
| anything else            | 404 page                                         |

## Branding

The LAWPEX mark lives in [`src/components/LogoMark.tsx`](src/components/LogoMark.tsx) and is
used for the header, footer, sign-in dialog, 404 page, browser tab icon and link previews.

The logo is used exactly as supplied (`public/logo.png`) on a white frame, so the artwork's
own white background blends into the frame and the mark reads at full contrast. Note the
file is actually a JPEG despite its `.png` name, so it has no transparency — that is why the
frame is white rather than yellow. Replace `public/logo.png` if the artwork changes.


## Notes

Routing is defined in [`src/routes.ts`](src/routes.ts), which is also the source of the
per-page `<title>` and meta description. Universal Search and the document viewer are
overlays available on every page. The Express server serves `index.html` for any
non-`/api` path so deep links work on a hard refresh.

## Run locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```
   npm install
   ```
2. (Optional) Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to enable live AI.
   Without a key the AI endpoints return curated offline fallbacks.
3. Start the dev server:
   ```
   npm run dev
   ```
   Runs on http://localhost:3000 (override with `PORT`, e.g. `PORT=4300 npm run dev`).

## Build for production

```
npm run build   # builds the Vite frontend and bundles the server to dist/server.cjs
npm start        # serves the production build
```

## Environment variables

| Variable         | Required | Default            | Purpose                           |
| ---------------- | -------- | ------------------ | --------------------------------- |
| `GEMINI_API_KEY` | No       | —                  | Enables live Gemini AI responses  |
| `GEMINI_MODEL`   | No       | `gemini-2.5-flash` | Gemini model for all AI endpoints |
| `PORT`           | No       | `3000`             | Server listen port                |
| `APP_URL`        | No       | —                  | Public hosting URL for self-links |

## AI endpoints

- `GET  /api/health` — service health check
- `POST /api/ai/ask` — general legal research query
- `POST /api/ai/draft` — generate a Nigerian court document
- `POST /api/ai/summarize` — summarize a judgment
