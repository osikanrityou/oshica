export type CalendarScheduleType =
  | "event"
  | "event_deadline"
  | "goods_deadline"
  | "goods_release"
  | "lottery";

export type CalendarSchedule = {
  id: string;
  title: string;
  date: string;
  label: string;
  href: string;
  type: CalendarScheduleType;
};

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDaysLeft(dateText: string) {
  const today = new Date();
  const target = new Date(dateText);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function dateLabel(dateText: string) {
  const days = getDaysLeft(dateText);

  if (days === 0) return "今日";
  if (days > 0) return `あと${days}日`;
  return `${Math.abs(days)}日前`;
}

export function getScheduleDotClass(type: CalendarScheduleType) {
  if (type === "event") {
    return "bg-oshica-primary";
  }

  if (type === "event_deadline") {
    return "bg-oshica-secondary";
  }

  if (type === "goods_deadline") {
    return "bg-oshica-primary";
  }

  if (type === "goods_release") {
    return "bg-oshica-border";
  }

  return "bg-oshica-secondary";
}

export function getScheduleLabel(type: CalendarScheduleType) {
  if (type === "event") return "イベント";
  if (type === "event_deadline") return "イベント締切";
  if (type === "goods_deadline") return "グッズ締切";
  if (type === "goods_release") return "発売日";
  return "当落発表";
}
