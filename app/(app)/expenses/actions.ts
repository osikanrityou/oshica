"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const FREE_PER_OSHI_LIMIT = 3;

export async function createExpense(formData: FormData) {
  const title = formData.get("title");
  const amount = formData.get("amount");
  const spentAt = formData.get("spentAt");
  const memo = formData.get("memo");
  const oshiId = formData.get("oshiId");

  if (
    typeof title !== "string" ||
    title.trim().length === 0 ||
    typeof oshiId !== "string" ||
    oshiId.length === 0
  ) {
    redirect("/expenses/new");
  }

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { count, error: countError } = await supabase
    .from("expenses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("oshi_id", oshiId);

  if (countError) throw new Error(countError.message);

  if ((count ?? 0) >= FREE_PER_OSHI_LIMIT) {
    redirect("/expenses/new");
  }

  const { error } = await supabase.from("expenses").insert({
    title: title.trim(),
    amount: Number(amount),
    spent_at:
      typeof spentAt === "string" && spentAt.length > 0
        ? spentAt
        : new Date().toISOString().slice(0, 10),
    notes:
      typeof memo === "string" && memo.trim().length > 0 ? memo.trim() : null,
    category: "other",
    oshi_id: oshiId,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/oshis");
  revalidatePath(`/oshis/${oshiId}`);

  redirect("/expenses");
}

export async function deleteExpense(formData: FormData) {
  const expenseId = formData.get("expenseId");

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: expense } = await supabase
    .from("expenses")
    .select("oshi_id")
    .eq("id", expenseId)
    .eq("user_id", user.id)
    .single();

  await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId)
    .eq("user_id", user.id);

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/oshis");

  if (expense?.oshi_id) {
    revalidatePath(`/oshis/${expense.oshi_id}`);
  }

  redirect("/expenses");
}

export async function updateExpense(formData: FormData) {
  const expenseId = formData.get("expenseId");
  const title = formData.get("title");
  const amount = formData.get("amount");
  const spentAt = formData.get("spentAt");
  const oshiId = formData.get("oshiId");

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase
    .from("expenses")
    .update({
      title,
      amount: Number(amount),
      spent_at:
        typeof spentAt === "string" && spentAt.length > 0
          ? spentAt
          : new Date().toISOString().slice(0, 10),
      oshi_id:
        typeof oshiId === "string" && oshiId.length > 0 ? oshiId : null,
    })
    .eq("id", expenseId)
    .eq("user_id", user.id);

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  revalidatePath("/oshis");

  if (typeof oshiId === "string" && oshiId.length > 0) {
    revalidatePath(`/oshis/${oshiId}`);
  }

  redirect("/expenses");
}