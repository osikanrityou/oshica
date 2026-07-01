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
    source_type: "standalone",
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