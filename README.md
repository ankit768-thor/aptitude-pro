# AptitudePro

An aptitude-test prep platform for MBA students preparing for company recruitment and campus
placements — pick a target company, see its estimated assessment pattern, practice relevant
topics, and take timed tests (full-length or per-domain) with a per-test result breakdown.

This is NOT an MBA-entrance-exam (CAT/GMAT) prep tool.

No accounts, no sign-in — same as this user's other local projects (sql-mastery, pm-mastery).
Open it and start practicing; progress/history is saved in your browser only.

Built with Next.js (App Router, TypeScript), Tailwind CSS, and Supabase (Postgres, public
read-only content — no auth in the app).

## Setup

This Mac has no system Node.js, so a portable copy lives at `.node-runtime/` inside this project
(gitignored). Every command below assumes it's on your `PATH`:

```bash
export PATH="$PWD/.node-runtime/bin:$PATH"
```

### 1. Create your Supabase project (you do this — not scriptable)

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings → API**, copy the **Project URL**, **anon public key**, and
   **service_role key** (the service role key is only used server-side by the seed scripts).

### 2. Configure this project

```bash
cp .env.local.example .env.local
```

Fill in the three values from step 1.

### 3. Run the database migration

Paste the contents of `supabase/migrations/0001_init.sql` into the Supabase SQL Editor and run it
(or use the Supabase CLI: `supabase login`, `supabase link`, `supabase db push`). Only the content
tables (`companies`, `company_sections`, `topics`, `questions`, `question_sources`) are actually
used by the app — the rest of the schema (profiles/attempts/bookmarks/etc.) is leftover from an
earlier accounts-based version and is unused.

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

Open [http://localhost:3000](http://localhost:3000) and start a test — no sign-up needed.

### 6. Share it (optional)

```bash
./share.command
```

Starts the server and opens a temporary public link via a Cloudflare tunnel, same as the other
local projects. Ctrl+C to stop; nothing stays hosted.

## Source verification

Every question and company pattern is labeled by how it was sourced (`verified_previous` /
`company_style` / `practice`). Nothing in this build is labeled `verified_previous` — there is no
sourced past-paper data yet. Company sections and company-tagged questions are editorial estimates
based on public information, clearly marked as "Company-style practice" in the UI.

## Files

| Path | Purpose |
| --- | --- |
| `app/` | Next.js App Router pages |
| `lib/supabase/client.ts` | Single anon-key Supabase client (no auth, no cookies) |
| `lib/testEngine.ts` | Client-side test assembly (mode/domain/company sampling) |
| `lib/practiceEngine.ts` | Client-side practice question fetching |
| `lib/history.ts` | localStorage-based test history (no backend) |
| `lib/algorithms/` | Pure functions: test assembly (mode config, difficulty mix, section sampling) and scoring |
| `lib/types/database.ts` | Hand-written types matching the SQL schema |
| `supabase/migrations/0001_init.sql` | Full schema + RLS policies (only the content tables are actually used) |
| `scripts/seed/` | Content seed scripts (topics, companies, questions), run via `npm run seed` |
| `.node-runtime/` | Portable Node.js (gitignored) — this machine has no system Node |
| `share.command` / `cloudflared` | Local sharing tunnel (gitignored) |

## How it works

- **Companies** (`/companies`) — browse each company's estimated assessment pattern (sections,
  difficulty, weighting).
- **Practice** (`/practice`) — untimed, filter by topic/difficulty/company, instant explanations.
- **Test** (`/test/start`) — 4 modes: Quick (10q/10min), Sectional (20q/20min), Company Mock
  (50q/45min, negative marking), Full Assessment (a target company's exact section structure).
  Quick/Sectional/Company Mock can also be scoped to a single **domain** (e.g. "Quantitative
  Aptitude Test") instead of spanning all 6 subjects — pick a domain and no company. Each attempt
  reshuffles and resamples from the question pool, so a domain/mode combo can be retaken
  indefinitely without repeating the same set. Runs entirely client-side (timer, palette,
  scoring) and shows score, accuracy, correct/incorrect/skipped, and a per-section breakdown.
- **History** (`/history`) — every completed test on this device, saved in localStorage.

## Status

Content bank (145 questions across 6 subjects, 8 companies) and the test engine (4 modes + domain
scoping) are done and live, running fully client-side with no accounts. An earlier
accounts+auth+readiness-score+weak-area+recommendations+bookmarks+mistakes+analytics layer was
built and then deliberately removed — too much for what was asked. AI Tutor, a study-plan/
exam-countdown feature, gamification, and global search are out of scope for now.
