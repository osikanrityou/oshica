"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPlanLimit, isOverLimit } from "@/lib/plan-limit";
import { createClient } from "@/lib/supabase/server";

export async function createLotteryResult(formData: FormData) {
  const oshiId = formData.get("oshiId");
  const result = formData.get("result");
  const announcedAt = formData.get("announcedAt");
  const notes = formData.get("notes");

  if (typeof oshiId !== "string" || oshiId.length === 0) {
    redirect("/results/new");
  }

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const planLimit = await getPlanLimit("item");

  const { count, error: countError } = await supabase
    .from("lottery_results")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("oshi_id", oshiId);

  if (countError) throw new Error(countError.message);

  if (isOverLimit(count ?? 0, planLimit.limit)) {
    redirect(`/results/new?error=${encodeURIComponent(planLimit.limitLabel)}`);
  }

  const { error } = await supabase.from("lottery_results").insert({
    user_id: user.id,
    oshi_id: oshiId,
    title:
      typeof notes === "string" && notes.trim().length > 0
        ? notes.trim()
        : "当落記録",
    result: typeof result === "string" ? result : "pending",
    announced_at:
      typeof announcedAt === "string" && announcedAt.length > 0
        ? announcedAt
        : null,
    notes:
      typeof notes === "string" && notes.trim().length > 0
        ? notes.trim()
        : null,
    source_type: "当落記録",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/results");
  revalidatePath("/oshis");
  revalidatePath("/dashboard");

  redirect("/results");
}

export async function updateLotteryResult(formData: FormData) {
  const resultId = formData.get("resultId");
  const oshiId = formData.get("oshiId");
  const result = formData.get("result");
  const announcedAt = formData.get("announcedAt");
  const notes = formData.get("notes");

  if (typeof resultId !== "string") return;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const nextOshiId =
    typeof oshiId === "string" && oshiId.length > 0 ? oshiId : null;

  if (nextOshiId) {
    const { data: currentResult } = await supabase
      .from("lottery_results")
      .select("oshi_id")
      .eq("id", resultId)
      .eq("user_id", user.id)
      .single();

    if (currentResult?.oshi_id !== nextOshiId) {
      const planLimit = await getPlanLimit("item");

      const { count, error: countError } = await supabase
        .from("lottery_results")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("oshi_id", nextOshiId);

      if (countError) throw new Error(countError.message);

      if (isOverLimit(count ?? 0, planLimit.limit)) {
        redirect(
          `/results/${resultId}/edit?error=${encodeURIComponent(
            planLimit.limitLabel
          )}`
        );
      }
    }
  }

  const updateData: any = {
    result: typeof result === "string" ? result : "pending",
    announced_at:
      typeof announcedAt === "string" && announcedAt.length > 0
        ? announcedAt
        : null,
    notes:
      typeof notes === "string" && notes.trim().length > 0
        ? notes.trim()
        : null,
    title:
      typeof notes === "string" && notes.trim().length > 0
        ? notes.trim()
        : "当落記録",
  };

  if (nextOshiId) {
    updateData.oshi_id = nextOshiId;
  }

  const { error } = await supabase
    .from("lottery_results")
    .update(updateData)
    .eq("id", resultId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/results");
  revalidatePath(`/results/${resultId}`);
  revalidatePath("/oshis");
  revalidatePath("/dashboard");

  redirect("/results");
}

export async function deleteLotteryResult(formData: FormData) {
  const resultId = formData.get("resultId");

  if (typeof resultId !== "string") return;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase
    .from("lottery_results")
    .delete()
    .eq("id", resultId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/results");
  revalidatePath("/oshis");
  revalidatePath("/dashboard");

  redirect("/results");
}