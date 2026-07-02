"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function createLotteryResult(formData: FormData) {
  const result = formData.get("result");
  const announcedAt = formData.get("announcedAt");
  const notes = formData.get("notes");

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase.from("lottery_results").insert({
    user_id: user.id,
    source_type: "当落記録",
    result: typeof result === "string" ? result : "pending",
    announced_at:
      typeof announcedAt === "string" && announcedAt.length > 0
        ? announcedAt
        : null,
    notes:
      typeof notes === "string" && notes.trim().length > 0
        ? notes.trim()
        : null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/results");
  revalidatePath("/dashboard");
  redirect("/results");
}

export async function updateLotteryResult(formData: FormData) {
  const resultId = formData.get("resultId");
  const result = formData.get("result");
  const announcedAt = formData.get("announcedAt");
  const notes = formData.get("notes");

  if (typeof resultId !== "string") return;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase
    .from("lottery_results")
    .update({
      result: typeof result === "string" ? result : "pending",
      announced_at:
        typeof announcedAt === "string" && announcedAt.length > 0
          ? announcedAt
          : null,
      notes:
        typeof notes === "string" && notes.trim().length > 0
          ? notes.trim()
          : null,
    })
    .eq("id", resultId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/results");
  revalidatePath(`/results/${resultId}`);
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
  revalidatePath("/dashboard");
  redirect("/results");
}