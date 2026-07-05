"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function deleteOshiCascade(oshiId: string) {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ログイン情報が確認できません。");
  }

  const deleteByOshiId = async (table: string) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("user_id", user.id)
      .eq("oshi_id", oshiId);

    if (!error) return;

    const ignoredCodes = ["42P01", "42703", "PGRST204", "PGRST205"];

    if (ignoredCodes.includes(error.code)) {
      return;
    }

    throw new Error(`${table}: ${error.message}`);
  };

  await deleteByOshiId("expenses");
  await deleteByOshiId("goods");
  await deleteByOshiId("events");
  await deleteByOshiId("lottery_results");
  await deleteByOshiId("event_applications");

  const { data: deletedOshis, error: deleteOshiError } = await supabase
    .from("oshis")
    .delete()
    .eq("id", oshiId)
    .eq("user_id", user.id)
    .select("id");

  if (deleteOshiError) {
    throw new Error(`oshis: ${deleteOshiError.message}`);
  }

  if (!deletedOshis || deletedOshis.length === 0) {
    throw new Error(
      "推しを削除できませんでした。削除対象が見つからないか、権限がありません。",
    );
  }

  revalidatePath("/oshis");
  revalidatePath("/dashboard");
  revalidatePath("/expenses");
  revalidatePath("/goods");
  revalidatePath("/events");
  revalidatePath("/results");

  return { success: true };
}