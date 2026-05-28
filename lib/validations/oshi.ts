import { z } from "zod";

import { OSHI_CATEGORIES } from "@/lib/constants/enums";

export const oshiSchema = z.object({
  name: z.string().min(1, "名前を入力してください").max(100),
  category: z.enum(OSHI_CATEGORIES),
  color: z.string().max(20).optional().nullable(),
  memo: z.string().max(500).optional().nullable(),
});

export type OshiFormValues = z.infer<typeof oshiSchema>;
