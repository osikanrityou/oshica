import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createGoods } from "../actions";

const FREE_GOODS_LIMIT = 3;

export default async function NewGoodsPage() {
  const supabase = (await createClient()) as any;


  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count, error } = await supabase
    .from("goods")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  const isLimitReached = (count ?? 0) >= FREE_GOODS_LIMIT;

  return (
    <main className="min-h-screen bg-sky-50/50 px-5 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <p className="text-sm font-medium text-sky-500">OSHICA</p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900">
            グッズ登録
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            お気に入りのグッズを記録できます
          </p>
        </div>

        {isLimitReached ? (
          <section className="rounded-3xl border border-sky-100 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-zinc-700">
              無料プランではグッズ登録は3件までです
            </p>
            <Link
              href="/goods"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
            >
              グッズ一覧へ戻る
            </Link>
          </section>
        ) : (
          <form
            action={createGoods}
            className="space-y-5 rounded-3xl border border-sky-100 bg-white p-5 shadow-sm"
          >
            <label className="block">
              <span className="text-sm font-semibold text-zinc-700">名前</span>
              <input
                name="name"
                type="text"
                required
                className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-zinc-900 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-zinc-700">金額</span>
              <input
                name="price"
                type="number"
                inputMode="numeric"
                min="0"
                className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-zinc-900 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-zinc-700">メモ</span>
              <textarea
                name="memo"
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl border border-sky-100 px-4 py-3 text-zinc-900 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <div className="flex items-center justify-between gap-3 pt-2">
              <Link
                href="/goods"
                className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-500 transition hover:bg-sky-50 hover:text-zinc-700"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                className="rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
              >
                登録
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}