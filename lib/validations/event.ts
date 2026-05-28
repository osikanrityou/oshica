import { z } from "zod";

import { EVENT_STATUSES } from "@/lib/constants/enums";

export const eventApplicationSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください").max(200),
  status: z.enum(EVENT_STATUSES).default("draft"),
  oshiId: z.string().uuid().optional().nullable(),
  eventAt: z.string().datetime().optional().nullable(),
  applicationDeadlineAt: z.string().datetime().optional().nullable(),
  resultAnnounceAt: z.string().datetime().optional().nullable(),
  ticketCount: z.coerce.number().int().min(1).default(1),
  estimatedAmount: z.coerce.number().int().min(0).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export type EventApplicationFormValues = z.infer<typeof eventApplicationSchema>;
