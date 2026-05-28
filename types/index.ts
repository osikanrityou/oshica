export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
} from "@/lib/supabase/database.types";

/** Server Actions の戻り値（成功時は message も返せる） */
export type ActionResult<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };
