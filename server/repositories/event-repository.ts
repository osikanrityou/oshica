import type { Tables, TablesInsert } from "@/lib/supabase/database.types";

import {
  getUserIdOrThrow,
  type SupabaseServerClient,
} from "@/server/repositories/base";

export class EventRepository {
  constructor(private readonly supabase: SupabaseServerClient) {}

  async listByUser(
    userId: string | undefined,
  ): Promise<Tables<"event_applications">[]> {
    const uid = getUserIdOrThrow(userId);
    const { data, error } = await this.supabase
      .from("event_applications")
      .select("*")
      .eq("user_id", uid)
      .order("application_deadline_at", {
        ascending: true,
        nullsFirst: false,
      });

    if (error) throw error;
    return data ?? [];
  }

  async create(
    userId: string | undefined,
    payload: Omit<TablesInsert<"event_applications">, "user_id">,
  ): Promise<Tables<"event_applications">> {
    const uid = getUserIdOrThrow(userId);
    const { data, error } = await this.supabase
      .from("event_applications")
      .insert({ ...payload, user_id: uid })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
