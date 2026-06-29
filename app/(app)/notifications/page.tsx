import { Bell, CalendarDays } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { createClient } from "@/lib/supabase/server";
import { syncReminders } from "./actions";
import { OshicaEmptyState } from "@/components/oshica/OshicaEmptyState";

export const metadata = {
  title: "通知",
};

export default async function NotificationsPage() {
  await syncReminders();

  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: reminders } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true })
    .order("created_at", { ascending: false });

  const unreadCount =
    reminders?.filter((item: any) => !item.is_read).length ?? 0;

  const todayCount =
    reminders?.filter((item: any) => item.remind_type === "today").length ?? 0;

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
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
          <p className="text-xs font-bold text-oshica-primary">未読</p>
          <p className="mt-2 text-2xl font-black text-oshica-text">
            {unreadCount}件
          </p>
        </OshicaCard>
      </section>

      <section className="mt-8 pb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-oshica-text">
            リマインダー
          </h2>
          <p className="text-xs font-bold text-oshica-primary">
            今日 {todayCount}件
          </p>
        </div>

        <div className="space-y-3">
          {reminders && reminders.length > 0 ? (
            reminders.map((item: any) => (
              <OshicaCard
                key={item.id}
                className="border-l-2 border-l-oshica-border"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-oshica-primary">
                        {item.label}
                      </p>

                      {!item.is_read && (
                        <span className="rounded-full bg-oshica-bg px-2 py-0.5 text-[10px] font-bold text-oshica-secondary">
                          未読
                        </span>
                      )}
                    </div>

                    <p className="mt-1 font-black text-oshica-text">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs font-medium text-oshica-primary">
                      {item.date}
                    </p>

                    <p className="mt-2 text-sm font-bold text-oshica-secondary">
                      {item.message}
                    </p>
                  </div>
                </div>
              </OshicaCard>
            ))
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