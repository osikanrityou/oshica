"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createExpense(formData: FormData) {
  const title = formData.get("title");
  const amount = formData.get("amount");
  const spentAt = formData.get("spentAt");

  if (typeof title !== "string" || title.trim().length === 0) {
    redirect("/expenses/new");
  }

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("expenses").insert({
    title: title.trim(),
    amount: Number(amount),
    spent_at:
      typeof spentAt === "string" && spentAt.length > 0
        ? spentAt
        : new Date().toISOString().slice(0, 10),
    user_id: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  redirect("/expenses");
}

export async function deleteExpense(formData: FormData) {
  const expenseId = formData.get("expenseId");

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId)
    .eq("user_id", user.id);

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  redirect("/expenses");
}// ← deleteExpense の終わり

export async function updateExpense(formData: FormData) {
  const expenseId = formData.get("expenseId");
  const title = formData.get("title");
  const amount = formData.get("amount");
  const spentAt = formData.get("spentAt");

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("expenses")
    .update({
      title,
      amount: Number(amount),
      spent_at:
        typeof spentAt === "string" && spentAt.length > 0
          ? spentAt
          : new Date().toISOString().slice(0, 10),
    })
    .eq("id", expenseId)
    .eq("user_id", user.id);

  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  redirect("/expenses");
}