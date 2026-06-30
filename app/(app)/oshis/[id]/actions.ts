"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function deleteOshi(formData: FormData) {
  const oshiId = formData.get("oshiId")?.toString();

  if (!oshiId) {
    throw new Error("削除対象の推しIDがありません");
  }

  const supabase = (await createClient()) as any;

  const { error } = await supabase
    .from("oshis")
    .update({ is_archived: true })
    .eq("id", oshiId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/oshis");
  revalidatePath("/dashboard");
  redirect("/oshis");
}