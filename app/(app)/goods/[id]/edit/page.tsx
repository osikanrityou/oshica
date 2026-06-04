
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateGoods } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditGoodsPage({ params }: Props) {
  const { id } = await params;
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: goods } = await supabase
    .from("goods")
    .select("id, name, price, memo")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!goods) {
    redirect("/goods");
  }

  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <Link href="/goods" className="text-sm text-sky-500">
        ← グッズ一覧へ
      </Link>

      <h1 className="mt-4 text-2xl font-bold">グッズ編集</h1>
      <p className="mt-2 text-sm text-zinc-500">登録したグッズを編集できます</p>

      <form action={updateGoods} className="mt-6 rounded-3xl border bg-white p-5 shadow-sm">
        <input type="hidden" name="goodsId" value={goods.id} />

        <label className="block text-sm font-bold">グッズ名</label>
        <input
          name="name"
          defaultValue={goods.name}
          className="mt-2 w-full rounded-2xl border px-4 py-3"
          required
        />

        <label className="mt-4 block text-sm font-bold">値段</label>
        <input
          name="price"
          type="number"
          defaultValue={goods.price ?? ""}
          className="mt-2 w-full rounded-2xl border px-4 py-3"
        />

        <label className="mt-4 block text-sm font-bold">メモ</label>
        <textarea
          name="memo"
          defaultValue={goods.memo ?? ""}
          className="mt-2 min-h-28 w-full rounded-2xl border px-4 py-3"
        />

        <button
  type="submit"
  className="mt-6 w-full rounded-2xl bg-sky-400 py-3 font-bold text-white"
>
  保存する
</button>

</form>
</main>
);
}