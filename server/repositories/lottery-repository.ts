import type { Tables, TablesInsert } from "@/lib/supabase/database.types";

import {
  getUserIdOrThrow,
  type SupabaseServerClient,
} from "@/server/repositories/base";

export class LotteryRepository {
  constructor(private readonly supabase: SupabaseServerClient) {}

  async listByUser(
    userId: string | undefined,
  ): Promise<Tables<"lottery_results">[]> {
    const uid = getUserIdOrThrow(userId);
    const { data, error } = await this.supabase
      .from("lottery_results")
      .select("*")
      .eq("user_id", uid)
      .order("announced_at", { ascending: false, nullsFirst: true });

    if (error) throw error;
    return data ?? [];
  }

  async create(
    userId: string | undefined,
    payload: Omit<TablesInsert<"lottery_results">, "user_id">,
  ): Promise<Tables<"lottery_results">> {
    const uid = getUserIdOrThrow(userId);
    const { data, error } = await this.supabase
      .from("lottery_results")
      .insert({ ...payload, user_id: uid })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
