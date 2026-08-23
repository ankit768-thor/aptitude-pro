# AptitudePro

An aptitude-test prep platform for MBA students preparing for company recruitment and campus
placements — pick a target company, see its estimated assessment pattern, practice relevant
topics, and take timed tests (full-length or per-domain) with a per-test result breakdown.

This is NOT an MBA-entrance-exam (CAT/GMAT) prep tool.

Built with Next.js (App Router, TypeScript), Tailwind CSS, and Supabase (Postgres + Auth).
Live at [aptitude-pro-cyan.vercel.app](https://aptitude-pro-cyan.vercel.app).

## Setup

This Mac has no system Node.js, so a portable copy lives at `.node-runtime/` inside this project
(gitignored). Every command below assumes it's on your `PATH`:

```bash
export PATH="$PWD/.node-runtime/bin:$PATH"
```

### 1. Create your Supabase project (you do this — not scriptable)

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings → API**, copy the **Project URL**, **anon public key**, and
   **service_role key**.
3. In **Authentication → Providers**, confirm **Email** is enabled.
4. (Optional) Enable **Google** and set up an OAuth client in the
   [Google Cloud Console](https://console.cloud.google.com) if you want Google sign-in.

### 2. Configure this project

```bash
cp .env.local.example .env.local
```

Fill in the three values from step 1: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` (the last one is server-only — never exposed to the browser).

### 3. Run the database migration

Paste the contents of `supabase/migrations/0001_init.sql` into the Supabase SQL Editor and run it
(or use the Supabase CLI: `supabase login`, `supabase link`, `supabase db push`).

### 4. Seed content

```bash
npm run seed
```

Seeds the topic taxonomy, 8 companies (Deloitte, Accenture, EY, KPMG, Goldman Sachs, JPMorgan
Chase, Hindustan Unilever, Amazon) with their estimated section patterns, and 145 questions across
all 6 subjects (Quant, Verbal, Logical, DI, Numerical, Critical Reasoning). Safe to re-run —
each `scripts/seed/seed-<subject>.ts` deletes and replaces only its own subject's questions first,
so reseeding never duplicates rows.

### 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, complete onboarding, and start a test.

## Source verification

Every question and company pattern is labeled by how it was sourced (`verified_previous` /
`company_style` / `practice`). Nothing in this build is labeled `verified_previous` — there is no
sourced past-paper data yet. Company sections and company-tagged questions are editorial estimates
based on public information, clearly marked as "Company-style practice" in the UI.

## Files

| Path | Purpose |
| --- | --- |
| `app/` | Next.js App Router pages |
| `lib/supabase/` | Browser / server / service-role Supabase clients |
| `lib/actions/` | Server actions (onboarding, practice, timed tests, practice history) |
| `lib/algorithms/` | Pure functions: test assembly (mode config, difficulty mix, domain/company section sampling) and scoring |
| `lib/types/database.ts` | Hand-written types matching the SQL schema |
| `proxy.ts` | Session-refresh middleware (renamed from `middleware.ts` in Next.js 16) |
| `supabase/migrations/0001_init.sql` | Full schema + RLS policies |
| `scripts/seed/` | Content seed scripts (topics, companies, questions), run via `npm run seed` |
| `.node-runtime/` | Portable Node.js (gitignored) — this machine has no system Node |

## How it works

- **Companies** (`/companies`) — browse each company's estimated assessment pattern (sections,
  difficulty, weighting).
- **Practice** (`/practice`) — untimed, filter by topic/difficulty/company, instant explanations.
- **Test** (`/test/start`) — 4 modes: Quick (10q/10min), Sectional (20q/20min), Company Mock
  (50q/45min, negative marking), Full Assessment (a target company's exact section structure).
  Quick/Sectional/Company Mock can also be scoped to a single **domain** (e.g. "Quantitative
  Aptitude Test") instead of spanning all 6 subjects — pick a domain and no company. Each attempt
  reshuffles and resamples from the question pool, so a domain/mode combo can be retaken
  indefinitely without repeating the same set. The result page (`/test/[attemptId]/result`) shows
  score, accuracy, correct/incorrect/skipped, and a per-section breakdown.
- **History** (`/history`) — every completed session with score/accuracy/time.

## Status

Phase A (auth/onboarding/companies/practice), Phase B (145-question content bank across 6
subjects), and Phase C (timed test engine: 4 modes + domain scoping) are done and live. A
readiness-score/weak-area/recommendations/bookmarks/mistakes/analytics layer was built and then
deliberately removed in favor of this simpler, sql-mastery-style shape: a large reusable test bank
with a small per-test result, no coaching layer. AI Tutor, a study-plan/exam-countdown feature,
gamification, global search, and Google sign-in are out of scope / disabled for now.
