import type { Tables, TablesInsert } from "@/lib/supabase/database.types";

import {
  getUserIdOrThrow,
  type SupabaseServerClient,
} from "@/server/repositories/base";

export class ExpenseRepository {
  constructor(private readonly supabase: SupabaseServerClient) {}

  async listByUser(userId: string | undefined): Promise<Tables<"expenses">[]> {
    const uid = getUserIdOrThrow(userId);
    const { data, error } = await this.supabase
      .from("expenses")
      .select("*")
      .eq("user_id", uid)
      .order("spent_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async monthlyTotal(
    userId: string | undefined,
    yearMonth: string,
  ): Promise<number> {
    const uid = getUserIdOrThrow(userId);
    const [year, month] = yearMonth.split("-").map(Number);
    const start = new Date(year, month - 1, 1).toISOString().slice(0, 10);
    const end = new Date(year, month, 0).toISOString().slice(0, 10);

    const { data, error } = await this.supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", uid)
      .gte("spent_at", start)
      .lte("spent_at", end);

    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + row.amount, 0);
  }

  async create(
    userId: string | undefined,
    payload: Omit<TablesInsert<"expenses">, "user_id">,
  ): Promise<Tables<"expenses">> {
    const uid = getUserIdOrThrow(userId);
    const { data, error } = await this.supabase
      .from("expenses")
      .insert({ ...payload, user_id: uid })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
