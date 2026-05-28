import Link from "next/link";

import { MobilePage } from "@/components/layout/MobilePage";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { DashboardSummaryCards } from "@/features/dashboard/components/DashboardSummaryCards";
import { ROUTES } from "@/lib/constants/routes";
import { getDashboardSummary } from "@/server/services/dashboard-service";

export const metadata = { title: "ホーム" };

export default async function DashboardPage() {
  let summary = {
    pendingLotteryCount: 0,
    upcomingDeadlineCount: 0,
    monthlyExpenseTotal: 0,
  };

  try {
    summary = await getDashboardSummary();
  } catch {
    // Supabase未設定時はゼロ表示
  }

  return (
    <MobilePage>
      <PageHeader
        title="ホーム"
        description="今日の推し活をチェック"
        action={
          <Link href={ROUTES.reservationNew}>
            <Button size="sm" type="button">
              追加
            </Button>
          </Link>
        }
      />
      <DashboardSummaryCards summary={summary} />
      <section className="mt-6 space-y-2">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          クイックリンク
        </h2>
        <ul className="grid gap-2 text-sm">
          <li>
            <Link className="text-rose-500" href={ROUTES.results}>
              当落一覧 →
            </Link>
          </li>
          <li>
            <Link className="text-rose-500" href={ROUTES.oshis}>
              推しマスタ →
            </Link>
          </li>
        </ul>
      </section>
    </MobilePage>
  );
}
