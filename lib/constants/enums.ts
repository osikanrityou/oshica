export const OSHI_CATEGORIES = [
  "anime",
  "vtuber",
  "game",
  "idol",
  "other",
] as const;

export type OshiCategory = (typeof OSHI_CATEGORIES)[number];

export const RESERVATION_TYPES = [
  "goods",
  "cafe",
  "collab",
  "other",
] as const;

export type ReservationType = (typeof RESERVATION_TYPES)[number];

export const RESERVATION_STATUSES = [
  "planned",
  "reserved",
  "picked_up",
  "cancelled",
] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const EVENT_STATUSES = [
  "draft",
  "applied",
  "awaiting_result",
  "done",
  "cancelled",
] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

export const LOTTERY_RESULTS = [
  "won",
  "lost",
  "pending",
  "cancelled",
] as const;

export type LotteryResultValue = (typeof LOTTERY_RESULTS)[number];

export const LOTTERY_SOURCE_TYPES = [
  "reservation",
  "event_application",
  "standalone",
] as const;

export type LotterySourceType = (typeof LOTTERY_SOURCE_TYPES)[number];

export const EXPENSE_CATEGORIES = [
  "goods",
  "ticket",
  "cafe",
  "transport",
  "merch",
  "other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const PLAN_TYPES = ["free", "pro"] as const;

export type PlanType = (typeof PLAN_TYPES)[number];

export const REMINDER_TARGET_TYPES = [
  "reservation",
  "event_application",
  "lottery_result",
] as const;

export type ReminderTargetType = (typeof REMINDER_TARGET_TYPES)[number];

export const REMINDER_CHANNELS = ["in_app", "email"] as const;

export type ReminderChannel = (typeof REMINDER_CHANNELS)[number];
