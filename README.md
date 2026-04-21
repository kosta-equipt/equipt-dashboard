# Equipt Dashboard

Live daily analytics + weekly planner for Equipt, powered by Google Sheets.

- **Live:** https://equipt-dashboard.vercel.app/
- **Data source:** [Equipt Social Media Tracker](https://docs.google.com/spreadsheets/d/1CY3LNWcjwbqignXrGKZ0m-gVWh9wU0PEuQO_ZBO91Vw/edit)
- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind · Recharts · Google Sheets API via service account
- **Deploy:** Vercel (Hobby — free tier)

## Quick start

See [SETUP.md](SETUP.md) for the full one-time setup walkthrough (Google Cloud + Vercel env vars).

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

## Architecture

- `app/page.tsx` — Analytics home (KPIs + trend charts)
- `app/planner/page.tsx` — Weekly content planner
- `app/actions.ts` — Server action used by the Refresh button
- `app/api/refresh/route.ts` — Alternate POST endpoint for programmatic cache bust
- `app/api/sheets/[tab]/route.ts` — JSON API per tab (useful for debugging)
- `lib/sheets/client.ts` — googleapis wrapper, service-account auth
- `lib/sheets/cache.ts` — 5-minute `unstable_cache` with tag-based revalidation
- `lib/sheets/adapters.ts` — Tab-specific parsers → typed data
- `components/analytics/` — KpiCard, TrendChart, SectionHeader
- `components/planner/` — WeekTable
- `components/shell/` — Header, NavTabs, RefreshButton, Footer, SetupNotice

## Extending — add a new widget

1. Add a new parser to `lib/sheets/adapters.ts` that reads a new range and returns typed rows.
2. Add a new component under `components/analytics/` or a new folder.
3. Drop it onto `app/page.tsx` or a new route.
4. If it reads a new tab, add a corresponding `SHEET_TAB_…` env var with a default.
