import type { ReminderChannel, ReminderTargetType } from "@/lib/constants/enums";

export type ReminderPayload = {
  targetType: ReminderTargetType;
  targetId: string;
  remindAt: string;
  channel: ReminderChannel;
};
