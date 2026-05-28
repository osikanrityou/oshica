import { z } from "zod";

import {
  LOTTERY_RESULTS,
  LOTTERY_SOURCE_TYPES,
} from "@/lib/constants/enums";

export const lotteryResultSchema = z.object({
  sourceType: z.enum(LOTTERY_SOURCE_TYPES),
  sourceId: z.string().uuid().optional().nullable(),
  result: z.enum(LOTTERY_RESULTS).default("pending"),
  announcedAt: z.string().datetime().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export type LotteryResultFormValues = z.infer<typeof lotteryResultSchema>;
