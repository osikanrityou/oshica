import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatYen } from "@/lib/utils";
import type { DashboardSummary } from "@/server/repositories/dashboard-repository";

type DashboardSummaryCardsProps = {
  summary: DashboardSummary;
};

export function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  const items = [
    {
      label: "締切・発表（7日以内）",
      value: String(summary.upcomingDeadlineCount),
    },
    { label: "当落未確定", value: String(summary.pendingLotteryCount) },
    { label: "今月の支出", value: formatYen(summary.monthlyExpenseTotal) },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardDescription>{item.label}</CardDescription>
          <CardTitle className="text-2xl">{item.value}</CardTitle>
        </Card>
      ))}
    </div>
  );
}
