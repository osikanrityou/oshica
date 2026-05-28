import { createClient } from "@/lib/supabase/server";
import { DashboardRepository } from "@/server/repositories/dashboard-repository";

export async function getDashboardSummary(yearMonth?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = new Date();
  const defaultYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const repo = new DashboardRepository(supabase);
  return repo.getSummary(user?.id, yearMonth ?? defaultYearMonth);
}
