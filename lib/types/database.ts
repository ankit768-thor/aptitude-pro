// Hand-written types matching supabase/migrations/0001_init.sql.
// (No Supabase project is linked yet, so these aren't generated via
// `supabase gen types` — regenerate/replace once the project is linked.)

export type Program = "mba" | "pgdm" | "other";
export type Specialization =
  | "finance"
  | "marketing"
  | "hr"
  | "operations"
  | "business_analytics"
  | "product"
  | "strategy"
  | "general_management";
export type TargetRole =
  | "business_analyst"
  | "financial_analyst"
  | "consultant"
  | "management_trainee"
  | "product_analyst"
  | "marketing"
  | "sales"
  | "operations"
  | "hr"
  | "other";
export type CompanyCategory = "consulting" | "bfsi" | "fmcg" | "tech_ecommerce";
export type Difficulty = "easy" | "medium" | "hard";
export type Subject =
  | "quant"
  | "logical"
  | "verbal"
  | "di"
  | "numerical"
  | "critical_reasoning";
export type SourceType = "verified_previous" | "company_style" | "practice";
export type TestMode = "quick" | "sectional" | "company_mock" | "full_assessment" | "topic_practice";
export type AttemptStatus = "in_progress" | "completed" | "abandoned";
export type BookmarkCategory = "wrong" | "important" | "difficult" | "interview";

export interface QuestionOption {
  key: string; // "A" | "B" | "C" | "D"
  text: string;
}

// Minimal shape @supabase/supabase-js's generic client requires per table.
interface Table<Row, Insert, Update> {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
}

type ProfilesRow = {
  id: string;
  full_name: string | null;
  program: Program | null;
  specialization: Specialization | null;
  target_role: TargetRole | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

type UserTargetCompaniesRow = { id: string; user_id: string; company_id: string; created_at: string };

type CompaniesRow = {
  id: string;
  name: string;
  slug: string;
  category: CompanyCategory;
  difficulty: Difficulty;
  assessment_type: string;
  num_sections: number;
  recommended_prep_hours: number;
  overview: string;
  is_seeded_estimate: boolean;
  created_at: string;
};

type CompanySectionsRow = {
  id: string;
  company_id: string;
  topic_subject: Subject;
  section_name: string;
  weight_pct: number;
  typical_question_count: number;
  typical_time_minutes: number;
  notes: string | null;
};

type TopicsRow = { id: string; name: string; subject: Subject; question_type: string; created_at: string };

type QuestionsRow = {
  id: string;
  topic_id: string;
  question_text: string;
  options: QuestionOption[];
  correct_option_key: string;
  difficulty: Difficulty;
  explanation: string;
  shortcut: string | null;
  concept: string | null;
  exam_tip: string | null;
  company_id: string | null;
  created_at: string;
};

type QuestionSourcesRow = {
  id: string;
  question_id: string;
  source_type: SourceType;
  source: string;
  verified: boolean;
};

type TestsRow = {
  id: string;
  user_id: string | null;
  mode: TestMode;
  company_id: string | null;
  title: string;
  question_count: number;
  time_limit_minutes: number | null;
  negative_marking: boolean;
  negative_marking_value: number | null;
  created_at: string;
};

type TestQuestionsRow = { id: string; test_id: string; question_id: string; position: number };

type AttemptsRow = {
  id: string;
  user_id: string;
  test_id: string;
  status: AttemptStatus;
  started_at: string;
  submitted_at: string | null;
  time_spent_seconds: number | null;
};

type AttemptAnswersRow = {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_key: string | null;
  is_correct: boolean | null;
  is_marked_for_review: boolean;
  time_spent_seconds: number;
  answered_at: string | null;
};

type UserTopicStatsRow = {
  id: string;
  user_id: string;
  topic_id: string;
  questions_attempted: number;
  questions_correct: number;
  avg_time_seconds: number;
  last_practiced_at: string | null;
  updated_at: string;
};

type BookmarksRow = {
  id: string;
  user_id: string;
  question_id: string;
  category: BookmarkCategory;
  created_at: string;
};

type Insertable<Row> = Partial<Row>;

export interface Database {
  public: {
    Tables: {
      profiles: Table<ProfilesRow, Insertable<ProfilesRow> & { id: string }, Insertable<ProfilesRow>>;
      user_target_companies: Table<
        UserTargetCompaniesRow,
        Insertable<UserTargetCompaniesRow> & { user_id: string; company_id: string },
        Insertable<UserTargetCompaniesRow>
      >;
      companies: Table<CompaniesRow, Insertable<CompaniesRow>, Insertable<CompaniesRow>>;
      company_sections: Table<CompanySectionsRow, Insertable<CompanySectionsRow>, Insertable<CompanySectionsRow>>;
      topics: Table<TopicsRow, Insertable<TopicsRow>, Insertable<TopicsRow>>;
      questions: Table<QuestionsRow, Insertable<QuestionsRow>, Insertable<QuestionsRow>>;
      question_sources: Table<QuestionSourcesRow, Insertable<QuestionSourcesRow>, Insertable<QuestionSourcesRow>>;
      tests: Table<TestsRow, Insertable<TestsRow>, Insertable<TestsRow>>;
      test_questions: Table<TestQuestionsRow, Insertable<TestQuestionsRow>, Insertable<TestQuestionsRow>>;
      attempts: Table<AttemptsRow, Insertable<AttemptsRow>, Insertable<AttemptsRow>>;
      attempt_answers: Table<AttemptAnswersRow, Insertable<AttemptAnswersRow>, Insertable<AttemptAnswersRow>>;
      user_topic_stats: Table<UserTopicStatsRow, Insertable<UserTopicStatsRow>, Insertable<UserTopicStatsRow>>;
      bookmarks: Table<BookmarksRow, Insertable<BookmarksRow>, Insertable<BookmarksRow>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
