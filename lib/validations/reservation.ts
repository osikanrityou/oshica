import { z } from "zod";

import {
  RESERVATION_STATUSES,
  RESERVATION_TYPES,
} from "@/lib/constants/enums";

export const reservationSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください").max(200),
  type: z.enum(RESERVATION_TYPES),
  status: z.enum(RESERVATION_STATUSES).default("planned"),
  oshiId: z.string().uuid().optional().nullable(),
  reservedAt: z.string().datetime().optional().nullable(),
  deadlineAt: z.string().datetime().optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  storeUrl: z.string().url().optional().nullable().or(z.literal("")),
  estimatedAmount: z.coerce.number().int().min(0).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;
