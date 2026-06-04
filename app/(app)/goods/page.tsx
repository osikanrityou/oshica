import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteGoods } from "./actions";

export default async function GoodsPage() {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: goods } = await supabase
    .from("goods")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <h1 className="text-2xl font-bold">グッズ一覧</h1>

      <p className="mt-2 text-sm text-zinc-500">
        登録したグッズを管理できます
      </p>

      <div className="mt-6 space-y-3">
        {goods && goods.length > 0 ? (
          goods.map((item: any) => (
            <div
              key={item.id}
              className="rounded-3xl border bg-white p-4 shadow-sm"
            >
              <p className="font-bold">{item.name}</p>

              <p className="mt-1 text-sm text-zinc-500">
                {item.price
                  ? "¥" + Number(item.price).toLocaleString("ja-JP")
                  : "金額未設定"}
              </p>

              {item.memo && (
                <p className="mt-2 text-sm">{item.memo}</p>
              )}

              <div className="mt-3 flex gap-2">
                <Link
                  href={`/goods/${item.id}/edit`}
                  className="rounded-full bg-sky-400 px-4 py-2 text-sm font-bold text-white"
                >
                  編集
                </Link>

                <form action={deleteGoods}>
                  <input
                    type="hidden"
                    name="goodsId"
                    value={item.id}
                  />

                  <button
                    type="submit"
                    className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white"
                  >
                    削除
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-500">
            グッズを登録しましょう
          </p>
        )}
      </div>

      <Link
        href="/goods/new"
        className="fixed bottom-28 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-3xl text-white shadow-lg"
      >
        +
      </Link>
    </main>
  );
}
