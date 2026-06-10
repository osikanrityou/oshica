import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { createEvent } from "../actions";

const FREE_EVENTS_LIMIT = 3;

export default async function NewEventPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count } = await supabase
    .from("event_applications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const limitReached = (count ?? 0) >= FREE_EVENTS_LIMIT;

  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <Link href="/events" className="text-sm text-sky-500">
        ← 応募一覧へ
      </Link>

      <h1 className="mt-4 text-2xl font-bold">応募登録</h1>
      <p className="mt-2 text-sm text-zinc-500">
        イベント応募を登録できます
      </p>

      {limitReached ? (
        <div className="mt-8 rounded-3xl border bg-white p-6 text-center shadow-sm">
          <p className="font-bold">
            無料プランでは応募登録は3件までです
          </p>

          <Link
            href="/events"
            className="mt-4 inline-block rounded-2xl bg-sky-400 px-5 py-3 font-bold text-white"
          >
            応募一覧へ戻る
          </Link>
        </div>
      ) : (
        <form
          action={createEvent}
          className="mt-6 rounded-3xl border bg-white p-5 shadow-sm"
        >
          <label className="block text-sm font-bold">
            タイトル
          </label>

          <input
            name="title"
            className="mt-2 w-full rounded-2xl border px-4 py-3"
            required
          />

          <label className="mt-4 block text-sm font-bold">
            イベント日
          </label>

          <input
            type="date"
            name="eventDate"
            className="mt-2 w-full rounded-2xl border px-4 py-3"
          />

          <label className="mt-4 block text-sm font-bold">
            締切日
          </label>

          <input
            type="date"
            name="deadline"
            className="mt-2 w-full rounded-2xl border px-4 py-3"
          />

          <label className="mt-4 block text-sm font-bold">
            メモ
          </label>

          <textarea
            name="memo"
            className="mt-2 min-h-28 w-full rounded-2xl border px-4 py-3"
          />

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-sky-400 py-3 font-bold text-white"
          >
            登録する
          </button>
        </form>
      )}
    </main>
  );
}