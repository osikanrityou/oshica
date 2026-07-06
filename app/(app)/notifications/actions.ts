"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

function getDaysLeft(dateText: string) {
  const today = new Date();
  const target = new Date(dateText);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function getReminderType(days: number) {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === 3) return "three_days";
  return null;
}

function getReminderMessage(label: string, title: string, days: number) {
  if (days === 0) return `今日が${label}です：${title}`;
  if (days === 1) return `明日が${label}です：${title}`;
  if (days === 3) return `あと3日で${label}です：${title}`;
  return `${label}が近づいています：${title}`;
}

export async function syncReminders() {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const today = new Date().toISOString().slice(0, 10);

  const { data: schedules } = await supabase
    .from("upcoming_deadlines")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", today)
    .order("date", { ascending: true });

  const targets =
    schedules
      ?.map((item: any) => {
        const days = getDaysLeft(item.date);
        const remindType = getReminderType(days);

        if (!remindType) return null;

        return {
          user_id: user.id,
          schedule_id: item.id,
          title: item.title,
          label: item.label,
          date: item.date,
          remind_type: remindType,
          message: getReminderMessage(item.label, item.title, days),
        };
      })
      .filter(Boolean) ?? [];

  const validKeys = targets.map(
    (item: any) => `${item.schedule_id}-${item.remind_type}`,
  );

  const { data: currentReminders } = await supabase
    .from("reminders")
    .select("id, schedule_id, remind_type")
    .eq("user_id", user.id);

  const staleReminders =
    currentReminders?.filter((item: any) => {
      const key = `${item.schedule_id}-${item.remind_type}`;
      return !validKeys.includes(key);
    }) ?? [];

  if (staleReminders.length > 0) {
    await supabase
      .from("reminders")
      .delete()
      .in(
        "id",
        staleReminders.map((item: any) => item.id),
      );
  }

  for (const reminder of targets as any[]) {
    const { data: exists } = await supabase
      .from("reminders")
      .select("id")
      .eq("user_id", user.id)
      .eq("schedule_id", reminder.schedule_id)
      .eq("remind_type", reminder.remind_type)
      .maybeSingle();

    if (exists) {
      await supabase
        .from("reminders")
        .update({
          title: reminder.title,
          label: reminder.label,
          date: reminder.date,
          message: reminder.message,
        })
        .eq("id", exists.id)
        .eq("user_id", user.id);
    } else {
      await supabase.from("reminders").insert({
        ...reminder,
        is_read: false,
      });
    }
  }
}

export async function markAllRemindersRead() {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("reminders")
    .update({ is_read: true })
    .eq("user_id", user.id);

  revalidatePath("/notifications");
}