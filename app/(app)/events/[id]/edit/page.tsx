import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, Crown } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { createClient } from "@/lib/supabase/server";
import { updateEvent } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditEventPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

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

  const { data: oshis } = await supabase
    .from("oshis")
    .select("id, name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/events"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-oshica-secondary" />
        </Link>

        <h1 className="text-lg font-black">イベントを編集</h1>

        <div className="w-10" />
      </div>

      {error ? (
        <OshicaCard className="mb-5 text-center">
          <div className="py-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
              <Crown className="h-6 w-6" />
            </div>

            <p className="mt-4 font-bold text-oshica-text">
              登録上限に達しました
            </p>

            <p className="mt-2 text-sm leading-7 text-oshica-muted">{error}</p>

            <Link
              href="/settings/billing"
              className="mt-5 inline-flex rounded-full bg-oshica-primary px-5 py-3 text-sm font-bold text-white"
            >
              プランを見る
            </Link>
          </div>
        </OshicaCard>
      ) : null}

      <OshicaCard className="py-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
          <CalendarDays className="h-7 w-7" />
        </div>

        <p className="mt-3 text-base font-black text-oshica-text">
          {event.title}
        </p>

        <p className="mt-1 text-[11px] font-medium text-oshica-primary">
          登録内容を編集
        </p>
      </OshicaCard>

      <form action={updateEvent} className="mt-5 space-y-5">
        <input type="hidden" name="eventId" value={event.id} />

        <OshicaCard className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-oshica-text">推し</span>

            <select
              name="oshiId"
              defaultValue={event.oshi_id ?? ""}
              className="mt-2 block h-12 w-full appearance-none rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            >
              <option value="">選択なし</option>

              {oshis?.map((oshi: any) => (
                <option key={oshi.id} value={oshi.id}>
                  {oshi.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">
              タイトル
            </span>

            <input
              name="title"
              defaultValue={event.title}
              required
              className="mt-2 block h-12 w-full rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>
        </OshicaCard>

        <OshicaCard className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-oshica-text">
              イベント日
            </span>

            <input
              type="date"
              name="eventDate"
              defaultValue={event.event_date ?? ""}
              className="mt-2 block h-12 w-full min-w-0 max-w-full appearance-none rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-oshica-text">締切日</span>

            <input
              type="date"
              name="deadline"
              defaultValue={event.deadline ?? ""}
              className="mt-2 block h-12 w-full min-w-0 max-w-full appearance-none rounded-2xl border border-oshica-border bg-white px-4 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>
        </OshicaCard>

        <OshicaCard>
          <label className="block">
            <span className="text-sm font-bold text-oshica-text">メモ</span>

            <textarea
              name="memo"
              defaultValue={event.memo ?? ""}
              rows={5}
              className="mt-2 block w-full resize-none rounded-2xl border border-oshica-border bg-white px-4 py-3 text-sm text-oshica-text outline-none focus:ring-2 focus:ring-oshica-border"
            />
          </label>
        </OshicaCard>

        <div className="flex items-center justify-between">
          <Link href="/events" className="font-bold text-oshica-primary">
            キャンセル
          </Link>

          <button
            type="submit"
            className="rounded-full bg-oshica-primary px-8 py-3 font-bold text-white"
          >
            保存する
          </button>
        </div>
      </form>
    </main>
  );
}