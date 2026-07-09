import { Bell, CheckCircle2 } from "lucide-react";

import { SidebarMenuButton } from "@/components/layout/SidebarMenu";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaEmptyState } from "@/components/oshica/OshicaEmptyState";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { createClient } from "@/lib/supabase/server";
import { markAllRemindersRead, syncReminders } from "./actions";

export const metadata = {
  title: "通知",
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

function reminderLabel(dateText: string) {
  const days = getDaysLeft(dateText);

  if (days === 0) return "今日";
  if (days === 1) return "明日";
  if (days > 1) return `あと${days}日`;
  return `${Math.abs(days)}日前`;
}

export default async function NotificationsPage() {
  await syncReminders();

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: reminders } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true })
    .order("created_at", { ascending: false });

  const unreadCount =
    reminders?.filter((item: any) => !item.is_read).length ?? 0;

  const todayCount =
    reminders?.filter((item: any) => getDaysLeft(item.date) === 0).length ?? 0;

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
        label="Notification"
        title="通知"
        description="締切が近い予定をまとめて確認できます"
        icon={<Bell className="h-5 w-5" />}
      />

      <section className="mt-6 grid grid-cols-2 gap-3">
        <OshicaCard>
          <p className="text-xs font-bold text-oshica-primary">通知</p>
          <p className="mt-2 text-2xl font-black text-oshica-text">
            {reminders?.length ?? 0}件
          </p>
        </OshicaCard>

        <OshicaCard>
          <p className="text-xs font-bold text-oshica-primary">今日</p>
          <p className="mt-2 text-2xl font-black text-oshica-text">
            {todayCount}件
          </p>
        </OshicaCard>
      </section>

      <section className="mt-8 pb-10">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-oshica-text">
              リマインダー
            </h2>
            <p className="mt-1 text-xs font-bold text-oshica-primary">
              未読 {unreadCount}件
            </p>
          </div>

          {unreadCount > 0 && (
            <form action={markAllRemindersRead}>
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-oshica-primary shadow-sm transition active:scale-95"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                すべて既読
              </button>
            </form>
          )}
        </div>

        <div className="space-y-3">
          {reminders && reminders.length > 0 ? (
            reminders.map((item: any) => {
              const isUnread = !item.is_read;

              return (
                <OshicaCard
                  key={item.id}
                  className={
                    isUnread
                      ? "border-l-4 border-l-oshica-primary transition-all duration-200 active:scale-[0.98]"
                      : "border-l-2 border-l-oshica-border transition-all duration-200 active:scale-[0.98]"
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
                      <Bell className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-oshica-bg px-2 py-0.5 text-[10px] font-bold text-oshica-secondary">
                          {reminderLabel(item.date)}
                        </span>

                        <p className="text-xs font-bold text-oshica-primary">
                          {item.label}
                        </p>

                        {isUnread && (
                          <span className="rounded-full bg-oshica-primary px-2 py-0.5 text-[10px] font-bold text-white">
                            未読
                          </span>
                        )}
                      </div>

                      <p className="mt-2 font-black text-oshica-text">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs font-medium text-oshica-primary">
                        {item.date}
                      </p>

                      <p className="mt-2 text-sm font-bold leading-6 text-oshica-secondary">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </OshicaCard>
              );
            })
          ) : (
            <OshicaEmptyState
              icon={<Bell className="h-6 w-6" />}
              title="まだ通知はありません"
              description="締切が近づくとここに表示されます"
            />
          )}
        </div>
      </section>
    </main>
  );
}