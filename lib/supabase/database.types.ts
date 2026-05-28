/**
 * Run `npm run db:types` after applying Supabase migrations locally.
 * This placeholder keeps the app type-checkable before codegen.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          timezone: string;
          currency: string;
          plan: "free" | "pro";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          timezone?: string;
          currency?: string;
          plan?: "free" | "pro";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          timezone?: string;
          currency?: string;
          plan?: "free" | "pro";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      oshis: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: "anime" | "vtuber" | "game" | "idol" | "other";
          color: string | null;
          memo: string | null;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: "anime" | "vtuber" | "game" | "idol" | "other";
          color?: string | null;
          memo?: string | null;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: "anime" | "vtuber" | "game" | "idol" | "other";
          color?: string | null;
          memo?: string | null;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reservations: {
        Row: {
          id: string;
          user_id: string;
          oshi_id: string | null;
          type: "goods" | "cafe" | "collab" | "other";
          title: string;
          status: "planned" | "reserved" | "picked_up" | "cancelled";
          reserved_at: string | null;
          deadline_at: string | null;
          location: string | null;
          store_url: string | null;
          estimated_amount: number | null;
          notes: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          oshi_id?: string | null;
          type: "goods" | "cafe" | "collab" | "other";
          title: string;
          status?: "planned" | "reserved" | "picked_up" | "cancelled";
          reserved_at?: string | null;
          deadline_at?: string | null;
          location?: string | null;
          store_url?: string | null;
          estimated_amount?: number | null;
          notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          oshi_id?: string | null;
          type?: "goods" | "cafe" | "collab" | "other";
          title?: string;
          status?: "planned" | "reserved" | "picked_up" | "cancelled";
          reserved_at?: string | null;
          deadline_at?: string | null;
          location?: string | null;
          store_url?: string | null;
          estimated_amount?: number | null;
          notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      event_applications: {
        Row: {
          id: string;
          user_id: string;
          oshi_id: string | null;
          title: string;
          event_at: string | null;
          application_deadline_at: string | null;
          result_announce_at: string | null;
          status:
            | "draft"
            | "applied"
            | "awaiting_result"
            | "done"
            | "cancelled";
          ticket_count: number;
          estimated_amount: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          oshi_id?: string | null;
          title: string;
          event_at?: string | null;
          application_deadline_at?: string | null;
          result_announce_at?: string | null;
          status?:
            | "draft"
            | "applied"
            | "awaiting_result"
            | "done"
            | "cancelled";
          ticket_count?: number;
          estimated_amount?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          oshi_id?: string | null;
          title?: string;
          event_at?: string | null;
          application_deadline_at?: string | null;
          result_announce_at?: string | null;
          status?:
            | "draft"
            | "applied"
            | "awaiting_result"
            | "done"
            | "cancelled";
          ticket_count?: number;
          estimated_amount?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lottery_results: {
        Row: {
          id: string;
          user_id: string;
          source_type: "reservation" | "event_application" | "standalone";
          source_id: string | null;
          result: "won" | "lost" | "pending" | "cancelled";
          announced_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_type: "reservation" | "event_application" | "standalone";
          source_id?: string | null;
          result?: "won" | "lost" | "pending" | "cancelled";
          announced_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_type?: "reservation" | "event_application" | "standalone";
          source_id?: string | null;
          result?: "won" | "lost" | "pending" | "cancelled";
          announced_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          oshi_id: string | null;
          category:
            | "goods"
            | "ticket"
            | "cafe"
            | "transport"
            | "merch"
            | "other";
          amount: number;
          spent_at: string;
          title: string;
          linked_lottery_result_id: string | null;
          payment_method: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          oshi_id?: string | null;
          category:
            | "goods"
            | "ticket"
            | "cafe"
            | "transport"
            | "merch"
            | "other";
          amount: number;
          spent_at: string;
          title: string;
          linked_lottery_result_id?: string | null;
          payment_method?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          oshi_id?: string | null;
          category?:
            | "goods"
            | "ticket"
            | "cafe"
            | "transport"
            | "merch"
            | "other";
          amount?: number;
          spent_at?: string;
          title?: string;
          linked_lottery_result_id?: string | null;
          payment_method?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          target_type: "reservation" | "event_application" | "lottery_result";
          target_id: string;
          remind_at: string;
          channel: "in_app" | "email";
          sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_type: "reservation" | "event_application" | "lottery_result";
          target_id: string;
          remind_at: string;
          channel?: "in_app" | "email";
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          target_type?: "reservation" | "event_application" | "lottery_result";
          target_id?: string;
          remind_at?: string;
          channel?: "in_app" | "email";
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      upcoming_deadlines: {
        Row: {
          user_id: string;
          source_type: string;
          source_id: string;
          title: string;
          deadline_at: string;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
