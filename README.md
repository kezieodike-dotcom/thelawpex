# LAWPEX

**Nigeria's AI-Powered Litigation & Legal Research Platform**

LAWPEX is an AI-powered legal research, litigation, courtroom-practice and legal-education
platform built for Nigerian legal practitioners — lawyers, judges, magistrates, law firms,
legal researchers, paralegals and law students.

The app is a React 19 + Vite single-page frontend served by an Express server that also
exposes AI endpoints backed by Google Gemini (with a rich offline fallback when no API key
is configured).

## Modules

- AI Litigation Assistant (ask / draft / summarize)
- Areas of Law
- Court Rules Library
- Nigerian Laws (Statutes)
- Case Law Library
- Appeals Centre
- Legal Draft Library & Affidavits
- Courtroom Practicals (video learning)
- Legal Articles
- Compliance Hub
- Learning Centre
- Pricing / Subscriptions
- Dashboard, Universal Search & Admin Panel

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
