# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

ShopSmallSteals (LocalSteals) is a Next.js 16 PWA that aggregates deals from RSS feeds, classifies them, and surfaces small/local business deals over big-box retailers. Dark-themed deal hunter dashboard with push notifications via Firebase Cloud Messaging.

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (port 3000) |
| Build | `npm run build --webpack` |
| Lint | `npm run lint` |
| Tests (once) | `npm run test` |
| Tests (watch) | `npm run test:watch` |
| Generate migrations | `npm run db:generate` |
| Apply migrations | `npm run db:migrate` |
| Seed database | `npm run db:seed` |
| Drizzle Studio | `npm run db:studio` (port 3001) |

Build requires the `--webpack` flag because Next.js 16 defaults to Turbopack, which errors on the webpack config from Serwist.

## Architecture

### Data Flow

```
Cron (instrumentation.ts) → deal-fetcher.ts → rss-parser.ts → deal-classifier.ts → SQLite
                                                                                      ↓
Frontend (page.tsx) → useDeals hook → /api/deals route → Drizzle ORM → SQLite
```

1. **Cron** (`src/instrumentation.ts`) triggers `fetchAllDeals()` hourly
2. **Fetcher** iterates active RSS feed sources, parses items, classifies each deal
3. **Classifier** assigns category (`retail`/`auto-service`), detects big-box stores, checks Chicagoland relevance
4. **API routes** serve deals with filtering (big-box toggle, category, demo mode, search)
5. **Frontend** is entirely client-side React components with infinite scroll

### Server vs Client Boundary

- `src/services/` and `src/db/` are server-only (better-sqlite3 is native)
- All components in `src/components/` use `"use client"`
- `src/lib/firebase-admin.ts` is server-only; `src/lib/firebase-client.ts` is client-side

### Database

SQLite via `better-sqlite3` + Drizzle ORM. All DB queries are **synchronous** (`.all()`, `.get()`, `.run()`).

- File: `./data/localsteals.db` (configurable via `DATABASE_PATH` env)
- Schema: 4 tables — `deals`, `keywords`, `fcm_tokens`, `feed_sources` (defined in `src/db/schema.ts`)
- WAL mode enabled for concurrent reads

### Demo Mode

A static `DEMO_DEALS` array in `src/lib/demo-deals.ts` provides 25 pre-built deals. When `?demo=true` is passed to API routes, they filter this array instead of querying SQLite. Demo mode is ON by default in the UI.

## Key Conventions

- **Always use `@/` path aliases** for imports (maps to `src/`), never relative paths
- **Tailwind CSS v4** with custom CSS variables for the dark theme palette defined in `globals.css` `:root`
- **Components use inline styles** for theme colors (not Tailwind color classes) to match the custom dark palette
- **Fail-graceful error handling**: services log errors but continue processing; one broken RSS feed doesn't crash the run
- **Drizzle schema workflow**: edit `src/db/schema.ts` → `npm run db:generate` → `npm run db:migrate`

## Environment Variables

Required in `.env.local` (see `.env.local.example`):
- `DATABASE_PATH` — SQLite file location
- `NEXT_PUBLIC_FIREBASE_*` — Client-side Firebase config (6 keys)
- `FIREBASE_SERVICE_ACCOUNT_KEY` — Server-side Firebase Admin JSON
- `CRON_SCHEDULE` — Cron expression for feed fetching (default: `0 * * * *`)
- `CHICAGOLAND_KEYWORDS` — Comma-separated terms for local deal detection

## Testing

Vitest with `@testing-library/react`. Tests live in `__tests__/` directories colocated with their source. Current coverage: deal classifier, big-box list, RSS parser.

Run a single test file: `npx vitest run src/services/__tests__/deal-classifier.test.ts`
