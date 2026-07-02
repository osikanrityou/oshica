import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Clock,
} from "lucide-react";

import { SidebarMenuButton } from "@/components/layout/SidebarMenu";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaEmptyState } from "@/components/oshica/OshicaEmptyState";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { OshicaSectionHeader } from "@/components/oshica/OshicaSectionHeader";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { createClient } from "@/lib/supabase/server";
import { deleteEvent } from "./actions";

export const metadata = {
  title: "イベント一覧",
};

function getDaysLeft(dateText: string) {
  const today = new Date();
  const target = new Date(dateText);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function daysLabel(dateText: string) {
  const days = getDaysLeft(dateText);

  if (days === 0) return "今日";
  if (days > 0) return `あと${days}日`;
  return `${Math.abs(days)}日前`;
}

export default async function EventsPage() {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: events } = await supabase
    .from("events")
    .select("id, title, event_date, deadline, memo, oshi_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const upcomingCount =
    events?.filter((item: any) => {
      if (!item.event_date) return false;
      return item.event_date >= new Date().toISOString().slice(0, 10);
    }).length ?? 0;

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarMenuButton />

          <p className="text-base font-black tracking-wide text-oshica-secondary">
            Oshica
          </p>
        </div>

        <div className="h-10 w-10" />
      </div>

      <OshicaPageHeader
        label="Event"
        title="イベント一覧"
        description="応募・開催日・締切をまとめて確認できます"
        icon={<CalendarDays className="h-5 w-5" />}
      />

      <section className="mt-6 grid grid-cols-2 gap-3">
        <OshicaCard>
          <p className="text-xs font-bold text-oshica-primary">登録イベント</p>
          <p className="mt-2 text-2xl font-black text-oshica-text">
            {events?.length ?? 0}件
          </p>
        </OshicaCard>

        <OshicaCard>
          <p className="text-xs font-bold text-oshica-primary">これから</p>
          <p className="mt-2 text-2xl font-black text-oshica-text">
            {upcomingCount}件
          </p>
        </OshicaCard>
      </section>

      <section className="mt-8 pb-10">
        <OshicaSectionHeader
          title="登録したイベント"
          href="/events/new"
          actionLabel="追加する ›"
        />

        <div className="space-y-3">
          {events && events.length > 0 ? (
            events.map((item: any) => (
              <OshicaCard
                key={item.id}
                className="border-l-2 border-l-oshica-border transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/events/${item.id}/edit`}
                    className="min-w-0 flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-oshica-bg px-2 py-0.5 text-[10px] font-bold text-oshica-secondary">
                        <CalendarDays className="h-3 w-3" />
                        イベント
                      </span>

                      {item.deadline && (
                        <span className="rounded-full bg-oshica-bg px-2 py-0.5 text-[10px] font-bold text-oshica-secondary">
                          {daysLabel(item.deadline)}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 truncate font-black text-oshica-text">
                      {item.title}
                    </p>

                    <div className="mt-2 space-y-1">
                      {item.event_date && (
                        <p className="flex items-center gap-1 text-xs font-medium text-oshica-primary">
                          <CalendarDays className="h-3.5 w-3.5" />
                          開催日：{item.event_date}
                        </p>
                      )}

                      {item.deadline && (
                        <p className="flex items-center gap-1 text-xs font-medium text-oshica-primary">
                          <Clock className="h-3.5 w-3.5" />
                          締切：{item.deadline}
                        </p>
                      )}
                    </div>

                    {item.memo && (
                      <p className="mt-2 line-clamp-2 text-sm text-oshica-secondary">
                        {item.memo}
                      </p>
                    )}
                  </Link>

                  <Link
                    href={`/events/${item.id}/edit`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-oshica-primary">
                    詳細を確認できます
                  </span>

                  <form action={deleteEvent}>
                    <input type="hidden" name="eventId" value={item.id} />
                    <DeleteButton message={`${item.title}を削除しますか？`} />
                  </form>
                </div>
              </OshicaCard>
            ))
          ) : (
            <OshicaEmptyState
              icon={<CalendarDays className="h-6 w-6" />}
              title="まだイベントがありません"
              description="イベント予定を追加しましょう"
              href="/events/new"
              actionLabel="イベントを登録"
            />
          )}
        </div>
      </section>
    </main>
  );
}