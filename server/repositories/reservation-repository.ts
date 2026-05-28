import type { Tables, TablesInsert } from "@/lib/supabase/database.types";

import {
  getUserIdOrThrow,
  type SupabaseServerClient,
} from "@/server/repositories/base";

export class ReservationRepository {
  constructor(private readonly supabase: SupabaseServerClient) {}

  async listByUser(
    userId: string | undefined,
  ): Promise<Tables<"reservations">[]> {
    const uid = getUserIdOrThrow(userId);
    const { data, error } = await this.supabase
      .from("reservations")
      .select("*")
      .eq("user_id", uid)
      .order("deadline_at", { ascending: true, nullsFirst: false });

    if (error) throw error;
    return data ?? [];
  }

  async getById(
    userId: string | undefined,
    id: string,
  ): Promise<Tables<"reservations"> | null> {
    const uid = getUserIdOrThrow(userId);
    const { data, error } = await this.supabase
      .from("reservations")
      .select("*")
      .eq("user_id", uid)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async create(
    userId: string | undefined,
    payload: Omit<TablesInsert<"reservations">, "user_id">,
  ): Promise<Tables<"reservations">> {
    const uid = getUserIdOrThrow(userId);
    const { data, error } = await this.supabase
      .from("reservations")
      .insert({ ...payload, user_id: uid })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
