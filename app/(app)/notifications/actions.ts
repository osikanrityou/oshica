"use server";

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

  /**
   * 削除済みのグッズ・イベントの通知が残らないように、
   * 通知画面を開くたびに一度ユーザーの通知を作り直す。
   */
  const { error: deleteError } = await supabase
    .from("reminders")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (!schedules || schedules.length === 0) return;

  const targets = schedules
    .map((item: any) => {
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
        is_read: false,
      };
    })
    .filter(Boolean);

  if (targets.length === 0) return;

  const { error: insertError } = await supabase
    .from("reminders")
    .insert(targets);

  if (insertError) {
    throw new Error(insertError.message);
  }
}