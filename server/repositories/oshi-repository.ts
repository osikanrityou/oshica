import type { Tables, TablesInsert } from "@/lib/supabase/database.types";

import {
  getUserIdOrThrow,
  type SupabaseServerClient,
} from "@/server/repositories/base";

export class OshiRepository {
  constructor(private readonly supabase: SupabaseServerClient) {}

  async listByUser(userId: string | undefined): Promise<Tables<"oshis">[]> {
    const uid = getUserIdOrThrow(userId);
    const { data, error } = await this.supabase
      .from("oshis")
      .select("*")
      .eq("user_id", uid)
      .eq("is_archived", false)
      .order("name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async create(
    userId: string | undefined,
    payload: Omit<TablesInsert<"oshis">, "user_id">,
  ): Promise<Tables<"oshis">> {
    const uid = getUserIdOrThrow(userId);
    const { data, error } = await this.supabase
      .from("oshis")
      .insert({ ...payload, user_id: uid })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
