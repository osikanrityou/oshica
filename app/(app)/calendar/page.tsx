import { CalendarDays } from "lucide-react";

import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { createClient } from "@/lib/supabase/server";
import { CalendarView } from "@/features/calendar/CalendarView";
import type { CalendarSchedule } from "@/features/calendar/calendar-utils";

export const metadata = {
  title: "カレンダー",
};

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

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-32 pt-8 text-oshica-text">
      <OshicaPageHeader
        label="Calendar"
        title="カレンダー"
        description="イベント・グッズ・当落の予定を月表示で確認できます"
        icon={<CalendarDays className="h-5 w-5" />}
      />

      <section className="mt-6">
        <CalendarView schedules={schedules} />
      </section>
    </main>
  );
}