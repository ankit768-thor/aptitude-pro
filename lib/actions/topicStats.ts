import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

// Shared by practice.ts and test.ts — both write into the same
// user_topic_stats table so weak-area/analytics logic (Phase D) has one
// consistent source of truth regardless of where an answer came from.
export async function upsertTopicStats(
  supabase: SupabaseClient<Database>,
  userId: string,
  topicId: string,
  isCorrect: boolean,
  timeSpentSeconds: number,
) {
  const { data: existing } = await supabase
    .from("user_topic_stats")
    .select("*")
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .maybeSingle();

  const prevAttempted = existing?.questions_attempted ?? 0;
  const prevCorrect = existing?.questions_correct ?? 0;
  const prevAvgTime = existing?.avg_time_seconds ?? 0;
  const newAttempted = prevAttempted + 1;
  const newAvgTime = (prevAvgTime * prevAttempted + timeSpentSeconds) / newAttempted;

  const { error } = await supabase.from("user_topic_stats").upsert(
    {
      user_id: userId,
      topic_id: topicId,
      questions_attempted: newAttempted,
      questions_correct: prevCorrect + (isCorrect ? 1 : 0),
      avg_time_seconds: newAvgTime,
      last_practiced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,topic_id" },
  );
  if (error) throw error;
}
