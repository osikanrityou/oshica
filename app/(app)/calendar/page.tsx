import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";

import { SidebarMenuButton } from "@/components/layout/SidebarMenu";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { createClient } from "@/lib/supabase/server";
import { CalendarView } from "@/features/calendar/CalendarView";
import type { CalendarSchedule } from "@/features/calendar/calendar-utils";

export const metadata = {
  title: "カレンダー",
};

function getDaysLeft(dateText: string) {
  const today = new Date();
  const target = new Date(dateText);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function dateLabel(dateText: string) {
  const days = getDaysLeft(dateText);

  if (days === 0) return "今日";
  if (days === 1) return "明日";
  if (days > 1) return `あと${days}日`;
  return `${Math.abs(days)}日前`;
}

export default async function CalendarPage() {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("upcoming_deadlines")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", today)
    .order("date", { ascending: true });

  const schedules: CalendarSchedule[] =
    data?.map((item: any) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      label: item.label,
      href: item.href,
      type: item.type,
    })) ?? [];

  const nearestSchedules = schedules.slice(0, 3);

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
        label="Calendar"
        title="カレンダー"
        description="イベント・グッズ・当落の予定を月表示で確認できます"
        icon={<CalendarDays className="h-5 w-5" />}
      />

      <section className="mt-6 grid grid-cols-2 gap-3">
        <OshicaCard>
          <p className="text-xs font-bold text-oshica-primary">予定</p>
          <p className="mt-2 text-2xl font-black text-oshica-text">
            {schedules.length}件
          </p>
        </OshicaCard>

        <OshicaCard>
          <p className="text-xs font-bold text-oshica-primary">次の予定</p>
          <p className="mt-2 text-2xl font-black text-oshica-text">
            {schedules[0] ? dateLabel(schedules[0].date) : "なし"}
          </p>
        </OshicaCard>
      </section>

      <section className="mt-6">
        <CalendarView schedules={schedules} />
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-oshica-text">近い予定</h2>
          <p className="text-xs font-bold text-oshica-primary">
            最大3件
          </p>
        </div>

        <div className="space-y-3">
          {nearestSchedules.length > 0 ? (
            nearestSchedules.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm transition active:scale-[0.98]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-oshica-bg px-2 py-0.5 text-[10px] font-bold text-oshica-secondary">
                      {dateLabel(item.date)}
                    </span>

                    <p className="text-xs font-bold text-oshica-primary">
                      {item.label}
                    </p>
                  </div>

                  <p className="mt-2 truncate font-black text-oshica-text">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs font-medium text-oshica-primary">
                    {item.date}
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-oshica-primary" />
              </Link>
            ))
          ) : (
            <div className="rounded-3xl bg-white p-5 text-center shadow-sm">
              <p className="font-bold text-oshica-text">
                近い予定はありません
              </p>
              <p className="mt-1 text-sm text-oshica-primary">
                予定を追加するとここに表示されます
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}