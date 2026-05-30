"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteGoods(formData: FormData) {
  const goodsId = formData.get("goodsId");

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("goods")
    .delete()
    .eq("id", goodsId)
    .eq("user_id", user?.id);

  revalidatePath("/goods");
}