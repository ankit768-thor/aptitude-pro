-- AptitudePro — initial schema + RLS
-- Run via `supabase db push` or paste into the Supabase SQL Editor.

-- ============================================================
-- Enums
-- ============================================================
create type program as enum ('mba', 'pgdm', 'other');
create type specialization as enum (
  'finance', 'marketing', 'hr', 'operations', 'business_analytics',
  'product', 'strategy', 'general_management'
);
create type target_role as enum (
  'business_analyst', 'financial_analyst', 'consultant', 'management_trainee',
  'product_analyst', 'marketing', 'sales', 'operations', 'hr', 'other'
);
create type company_category as enum ('consulting', 'bfsi', 'fmcg', 'tech_ecommerce');
create type difficulty as enum ('easy', 'medium', 'hard');
create type subject as enum ('quant', 'logical', 'verbal', 'di', 'numerical', 'critical_reasoning');
create type source_type as enum ('verified_previous', 'company_style', 'practice');
create type test_mode as enum ('quick', 'sectional', 'company_mock', 'full_assessment', 'topic_practice');
create type attempt_status as enum ('in_progress', 'completed', 'abandoned');
create type bookmark_category as enum ('wrong', 'important', 'difficult', 'interview');

-- ============================================================
-- Tables
-- ============================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  program program,
  specialization specialization,
  target_role target_role,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category company_category not null,
  difficulty difficulty not null,
  assessment_type text not null,
  num_sections int not null default 0,
  recommended_prep_hours int not null default 0,
  overview text not null default '',
  is_seeded_estimate boolean not null default true,
  created_at timestamptz not null default now()
);

create table user_target_companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, company_id)
);

create table company_sections (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  topic_subject subject not null,
  section_name text not null,
  weight_pct numeric(5, 2) not null,
  typical_question_count int not null,
  typical_time_minutes int not null,
  notes text
);

create table topics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject subject not null,
  question_type text not null,
  created_at timestamptz not null default now(),
  unique (subject, question_type, name)
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete restrict,
  question_text text not null,
  options jsonb not null, -- [{ key: "A", text: "..." }, ...]
  correct_option_key text not null,
  difficulty difficulty not null,
  explanation text not null,
  shortcut text,
  concept text,
  exam_tip text,
  company_id uuid references companies(id) on delete set null,
  created_at timestamptz not null default now()
);

create table question_sources (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null unique references questions(id) on delete cascade,
  source_type source_type not null,
  source text not null,
  verified boolean not null default false
);

create table tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  mode test_mode not null,
  company_id uuid references companies(id) on delete set null,
  title text not null,
  question_count int not null,
  time_limit_minutes int,
  negative_marking boolean not null default false,
  negative_marking_value numeric(4, 2),
  created_at timestamptz not null default now()
);

create table test_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references tests(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  "position" int not null,
  unique (test_id, question_id)
);

create table attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  test_id uuid not null references tests(id) on delete restrict,
  status attempt_status not null default 'in_progress',
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  time_spent_seconds int
);

create table attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references attempts(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  selected_option_key text,
  is_correct boolean,
  is_marked_for_review boolean not null default false,
  time_spent_seconds int not null default 0,
  answered_at timestamptz,
  unique (attempt_id, question_id)
);

create table user_topic_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  topic_id uuid not null references topics(id) on delete cascade,
  questions_attempted int not null default 0,
  questions_correct int not null default 0,
  avg_time_seconds numeric(6, 1) not null default 0,
  last_practiced_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, topic_id)
);

create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  category bookmark_category not null,
  created_at timestamptz not null default now(),
  unique (user_id, question_id, category)
);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_company_sections_company on company_sections(company_id);
create index idx_questions_topic on questions(topic_id);
create index idx_questions_company on questions(company_id);
create index idx_test_questions_test on test_questions(test_id);
create index idx_attempts_user on attempts(user_id);
create index idx_attempt_answers_attempt on attempt_answers(attempt_id);
create index idx_attempt_answers_question on attempt_answers(question_id);
create index idx_user_topic_stats_user on user_topic_stats(user_id);
create index idx_bookmarks_user on bookmarks(user_id);
create index idx_user_target_companies_user on user_target_companies(user_id);

-- ============================================================
-- profiles auto-create on signup
-- ============================================================
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table profiles enable row level security;
alter table user_target_companies enable row level security;
alter table companies enable row level security;
alter table company_sections enable row level security;
alter table topics enable row level security;
alter table questions enable row level security;
alter table question_sources enable row level security;
alter table tests enable row level security;
alter table test_questions enable row level security;
alter table attempts enable row level security;
alter table attempt_answers enable row level security;
alter table user_topic_stats enable row level security;
alter table bookmarks enable row level security;

-- Public read-only reference data (writes via service_role only, no policy needed for that)
create policy "companies are publicly readable" on companies for select using (true);
create policy "company_sections are publicly readable" on company_sections for select using (true);
create policy "topics are publicly readable" on topics for select using (true);
create policy "questions are publicly readable" on questions for select using (true);
create policy "question_sources are publicly readable" on question_sources for select using (true);

-- profiles: owner only
create policy "users read own profile" on profiles for select using (auth.uid() = id);
create policy "users update own profile" on profiles for update using (auth.uid() = id);

-- user_target_companies: owner only
create policy "users manage own target companies" on user_target_companies
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- tests: readable/writable by the owning user, or system templates (user_id is null)
create policy "users read own or system tests" on tests
  for select using (user_id is null or auth.uid() = user_id);
create policy "users create own tests" on tests
  for insert with check (auth.uid() = user_id);

-- test_questions: follow the parent test's visibility
create policy "users read test_questions of visible tests" on test_questions
  for select using (
    exists (
      select 1 from tests
      where tests.id = test_questions.test_id
        and (tests.user_id is null or tests.user_id = auth.uid())
    )
  );
create policy "users insert test_questions for own tests" on test_questions
  for insert with check (
    exists (select 1 from tests where tests.id = test_id and tests.user_id = auth.uid())
  );

-- attempts: owner only
create policy "users manage own attempts" on attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- attempt_answers: owner only, via parent attempt
create policy "users manage own attempt_answers" on attempt_answers
  for all using (
    exists (select 1 from attempts where attempts.id = attempt_answers.attempt_id and attempts.user_id = auth.uid())
  ) with check (
    exists (select 1 from attempts where attempts.id = attempt_answers.attempt_id and attempts.user_id = auth.uid())
  );

-- user_topic_stats: owner only
create policy "users manage own topic stats" on user_topic_stats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- bookmarks: owner only
create policy "users manage own bookmarks" on bookmarks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
