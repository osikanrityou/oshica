import { z } from "zod";

import { EXPENSE_CATEGORIES } from "@/lib/constants/enums";

export const expenseSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください").max(200),
  category: z.enum(EXPENSE_CATEGORIES),
  amount: z.coerce.number().int().min(1, "金額を入力してください"),
  spentAt: z.string().date(),
  oshiId: z.string().uuid().optional().nullable(),
  linkedLotteryResultId: z.string().uuid().optional().nullable(),
  paymentMethod: z.string().max(50).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
