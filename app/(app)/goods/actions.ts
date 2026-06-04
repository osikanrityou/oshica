"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const FREE_GOODS_LIMIT = 3;

export async function createGoods(formData: FormData) {
  const name = formData.get("name");
  const price = formData.get("price");
  const memo = formData.get("memo");

  if (typeof name !== "string" || name.trim().length === 0) {
    redirect("/goods/new");
  }

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count, error: countError } = await supabase
    .from("goods")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    throw new Error(countError.message);
  }

  if ((count ?? 0) >= FREE_GOODS_LIMIT) {
    redirect("/goods/new");
  }

  const normalizedPrice =
    typeof price === "string" && price.trim().length > 0
      ? Number(price)
      : null;
  const priceValue =
    normalizedPrice !== null && Number.isFinite(normalizedPrice)
      ? normalizedPrice
      : null;

  const { error } = await supabase.from("goods").insert({
    name: name.trim(),
    price: priceValue,
    memo: typeof memo === "string" && memo.trim().length > 0 ? memo.trim() : null,
    user_id: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/goods");
  redirect("/goods");
}
export async function deleteGoods(formData: FormData) {
  const goodsId = formData.get("goodsId");

  if (typeof goodsId !== "string") {
    return;
  }

  const supabase = (await createClient()) as any;

  await supabase
    .from("goods")
    .delete()
    .eq("id", goodsId);

  revalidatePath("/goods");
}
export async function updateGoods(formData: FormData) {
  const goodsId = formData.get("goodsId");
  const name = formData.get("name");
  const price = formData.get("price");
  const memo = formData.get("memo");

  if (typeof goodsId !== "string" || typeof name !== "string") {
    return;
  }

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("goods")
    .update({
      name: name.trim(),
      price:
        typeof price === "string" && price.trim().length > 0
          ? Number(price)
          : null,
      memo:
        typeof memo === "string" && memo.trim().length > 0
          ? memo.trim()
          : null,
    })
    .eq("id", goodsId)
    .eq("user_id", user.id);

  revalidatePath("/goods");
  redirect("/goods");
}