# AptitudePro

An aptitude-test prep platform for MBA students preparing for company recruitment and campus
placements — pick a target company, see its estimated assessment pattern, practice relevant
topics, take timed mock tests, and track a Placement Readiness Score with weak-area recommendations.

This is NOT an MBA-entrance-exam (CAT/GMAT) prep tool.

Built with Next.js (App Router, TypeScript), Tailwind CSS, and Supabase (Postgres + Auth).
Currently a local-dev-only build — no production deployment yet.

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
3. In **Authentication → Providers**, confirm **Email** is enabled and turn on **Google**.
4. In the [Google Cloud Console](https://console.cloud.google.com), create an OAuth 2.0 Web
   application client. Add the redirect URI Supabase shows on its Google provider settings screen
   (`https://<project-ref>.supabase.co/auth/v1/callback`) and `http://localhost:3000` as an
   authorized JavaScript origin. Paste the resulting Client ID/Secret into Supabase's Google
   provider settings (not into this app's code).

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
so reseeding never duplicates rows. More companies can be added the same way later.

### 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, complete onboarding, and try Practice.

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
| `lib/actions/` | Server actions (onboarding, practice, timed tests, readiness, bookmarks, mistakes, history, analytics) |
| `lib/algorithms/` | Pure functions: test assembly, scoring, and the readiness/weak-area/recommendation engine |
| `components/charts/` | Recharts components for the Analytics page (accuracy/speed over time, topic/company/difficulty performance) |
| `lib/types/database.ts` | Hand-written types matching the SQL schema |
| `proxy.ts` | Session-refresh middleware (renamed from `middleware.ts` in Next.js 16) |
| `supabase/migrations/0001_init.sql` | Full schema + RLS policies |
| `scripts/seed/` | Content seed scripts (topics, companies, questions), run via `npm run seed` |
| `.node-runtime/` | Portable Node.js (gitignored) — this machine has no system Node |

## Status

Phase A (walking skeleton), Phase B (full question bank), Phase C (timed mock-test engine), and
Phase D (readiness & recommendations) are done. Auth, onboarding, dashboard, company pages, untimed
practice with instant explanations, and all 4 timed test modes (Quick, Sectional, Company Mock,
Full Assessment) work end to end once Supabase is configured, across a 145-question bank spanning
all 6 subjects. The test runner has a live countdown timer, a question palette
(answered/marked/unanswered/current), autosave per answer, and resumes correctly (timer and
answers included) after a page refresh mid-test. Results show score, accuracy,
correct/incorrect/skipped, and a per-section breakdown — all verified against hand-checked
arithmetic.

The dashboard now shows a weighted **Placement Readiness Score** (0-100, with a 🟢/🟡/🔴 status
badge), a **Weak Area** list ranked by severity (never-attempted topics rank above attempted-but-
weak ones), rule-based **Recommendations** that deep-link into pre-filtered Practice/Test sessions,
and per-target-company **Company Readiness** (a weighted rollup of section accuracy against that
company's own section weights, plus a "recommended before test" checklist) — also surfaced on each
company's own detail page. All of it is built on `user_topic_stats`, which both Practice and the
test engine already populate.

Phase E (retention loop) is also done: **Bookmarks** (tag any practice question as Wrong/
Important/Difficult/Interview from the explanation panel, browse by category at `/bookmarks`);
**My Mistakes** (`/mistakes` — every incorrectly-answered question, deduped to its most recent
miss, filterable by topic/difficulty/company, with a "Practice My Mistakes" button that launches a
practice session built entirely from that filtered set); **Practice History** (`/history` — every
completed session with score/accuracy/time, correctly accounting for unanswered questions as
skipped); and a full **Analytics** dashboard (`/analytics`) with 5 charts — accuracy and speed over
the last 30 days, topic performance, company readiness, and accuracy by difficulty. Reachable from
the nav's "More" menu. AI Tutor, a study-plan/exam-countdown feature, gamification, global search,
and production deployment are out of scope for now.

**Note:** "Confirm email" is currently disabled in the Supabase Auth settings for local testing
convenience. Re-enable it before this is ever exposed beyond your own machine.
