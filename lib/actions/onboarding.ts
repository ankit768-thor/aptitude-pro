"use server";

import { createClient } from "@/lib/supabase/server";
import type { Program, Specialization, TargetRole } from "@/lib/types/database";

export interface OnboardingInput {
  fullName: string;
  program: Program;
  specialization: Specialization;
  targetRole: TargetRole;
  companyIds: string[];
}

export async function completeOnboarding(input: OnboardingInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName,
      program: input.program,
      specialization: input.specialization,
      target_role: input.targetRole,
      onboarding_completed: true,
    })
    .eq("id", user.id);
  if (profileError) throw profileError;

  if (input.companyIds.length > 0) {
    const { error: targetsError } = await supabase.from("user_target_companies").upsert(
      input.companyIds.map((company_id) => ({ user_id: user.id, company_id })),
      { onConflict: "user_id,company_id", ignoreDuplicates: true },
    );
    if (targetsError) throw targetsError;
  }

  return { ok: true };
}
