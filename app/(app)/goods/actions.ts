"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const FREE_PER_OSHI_LIMIT = 3;

export async function createGoods(formData: FormData) {
  const name = formData.get("name");
  const price = formData.get("price");
  const deadline = formData.get("deadline");
  const releaseDate = formData.get("releaseDate");
  const status = formData.get("status");
  const memo = formData.get("memo");
  const oshiId = formData.get("oshiId");

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    typeof oshiId !== "string" ||
    oshiId.length === 0
  ) {
    redirect("/goods/new");
  }

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { count, error: countError } = await supabase
    .from("goods")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("oshi_id", oshiId);

  if (countError) throw new Error(countError.message);

  if ((count ?? 0) >= FREE_PER_OSHI_LIMIT) {
    redirect("/goods/new");
  }

  const priceNumber =
    typeof price === "string" && price.trim().length > 0
      ? Number(price)
      : null;

  const { error } = await supabase.from("goods").insert({
    name: name.trim(),
    price: priceNumber !== null && Number.isFinite(priceNumber) ? priceNumber : null,
    deadline: typeof deadline === "string" && deadline.length > 0 ? deadline : null,
    release_date:
      typeof releaseDate === "string" && releaseDate.length > 0
        ? releaseDate
        : null,
    status: typeof status === "string" && status.length > 0 ? status : "未予約",
    memo: typeof memo === "string" && memo.trim().length > 0 ? memo.trim() : null,
    oshi_id: oshiId,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/goods");
  revalidatePath("/dashboard");
  redirect("/goods");
}

export async function deleteGoods(formData: FormData) {
  const goodsId = formData.get("goodsId");

  if (typeof goodsId !== "string") return;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase.from("goods").delete().eq("id", goodsId).eq("user_id", user.id);

  revalidatePath("/goods");
  revalidatePath("/dashboard");
  redirect("/goods");
}

export async function updateGoods(formData: FormData) {
  const goodsId = formData.get("goodsId");
  const name = formData.get("name");
  const price = formData.get("price");
  const deadline = formData.get("deadline");
  const releaseDate = formData.get("releaseDate");
  const status = formData.get("status");
  const memo = formData.get("memo");
  const oshiId = formData.get("oshiId");

  if (typeof goodsId !== "string" || typeof name !== "string") return;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase
    .from("goods")
    .update({
      name: name.trim(),
      price:
        typeof price === "string" && price.trim().length > 0
          ? Number(price)
          : null,
      deadline: typeof deadline === "string" && deadline.length > 0 ? deadline : null,
      release_date:
        typeof releaseDate === "string" && releaseDate.length > 0
          ? releaseDate
          : null,
      status: typeof status === "string" && status.length > 0 ? status : "未予約",
      memo: typeof memo === "string" && memo.trim().length > 0 ? memo.trim() : null,
      oshi_id:
        typeof oshiId === "string" && oshiId.length > 0 ? oshiId : null,
    })
    .eq("id", goodsId)
    .eq("user_id", user.id);

  revalidatePath("/goods");
  revalidatePath("/dashboard");
  redirect("/goods");
}