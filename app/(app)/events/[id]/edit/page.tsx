import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { updateEvent } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!event) {
    redirect("/events");
  }

  return (
    <main className="mx-auto max-w-md px-5 py-8">
      <Link href="/events" className="text-sm text-sky-500">
        ← イベント一覧へ
      </Link>

      <h1 className="mt-4 text-2xl font-bold">イベント編集</h1>

      <form
        action={updateEvent}
        className="mt-6 rounded-3xl border bg-white p-5 shadow-sm"
      >
        <input
          type="hidden"
          name="eventId"
          value={event.id}
        />

        <label className="block text-sm font-bold">
          タイトル
        </label>

        <input
          name="title"
          defaultValue={event.title}
          className="mt-2 w-full rounded-2xl border px-4 py-3"
          required
        />

        <label className="mt-4 block text-sm font-bold">
          イベント日
        </label>

        <input
          type="date"
          name="eventDate"
          defaultValue={event.event_date ?? ""}
          className="mt-2 w-full rounded-2xl border px-4 py-3"
        />


        <label className="mt-4 block text-sm font-bold">
          メモ
        </label>

        <textarea
          name="memo"
          defaultValue={event.memo ?? ""}
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