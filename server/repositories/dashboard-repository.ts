import {
  getUserIdOrThrow,
  type SupabaseServerClient,
} from "@/server/repositories/base";

export type DashboardSummary = {
  pendingLotteryCount: number;
  upcomingDeadlineCount: number;
  monthlyExpenseTotal: number;
};

export class DashboardRepository {
  constructor(private readonly supabase: SupabaseServerClient) {}

  async getSummary(
    userId: string | undefined,
    yearMonth: string,
  ): Promise<DashboardSummary> {
    const uid = getUserIdOrThrow(userId);

    const [lotteryRes, deadlinesRes, expensesRes] = await Promise.all([
      this.supabase
        .from("lottery_results")
        .select("id", { count: "exact", head: true })
        .eq("user_id", uid)
        .eq("result", "pending"),
      this.supabase
        .from("upcoming_deadlines")
        .select("source_id", { count: "exact", head: true })
        .eq("user_id", uid),
      this.getMonthlyTotal(uid, yearMonth),
    ]);

    if (lotteryRes.error) throw lotteryRes.error;
    if (deadlinesRes.error) throw deadlinesRes.error;

    return {
      pendingLotteryCount: lotteryRes.count ?? 0,
      upcomingDeadlineCount: deadlinesRes.count ?? 0,
      monthlyExpenseTotal: expensesRes,
    };
  }

  private async getMonthlyTotal(
    userId: string,
    yearMonth: string,
  ): Promise<number> {
    const [year, month] = yearMonth.split("-").map(Number);
    const start = new Date(year, month - 1, 1).toISOString().slice(0, 10);
    const end = new Date(year, month, 0).toISOString().slice(0, 10);

    const { data, error } = await this.supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", userId)
      .gte("spent_at", start)
      .lte("spent_at", end);

    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + row.amount, 0);
  }
}
