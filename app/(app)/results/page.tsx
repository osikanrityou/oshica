import { MobilePage } from "@/components/layout/MobilePage";
import { PageHeader } from "@/components/layout/PageHeader";
import { LotteryResultList } from "@/features/lottery-result/components/LotteryResultList";
import { createClient } from "@/lib/supabase/server";
import { LotteryRepository } from "@/server/repositories/lottery-repository";

export const metadata = { title: "当落" };

export default async function ResultsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let items: Awaited<ReturnType<LotteryRepository["listByUser"]>> = [];

  if (user) {
    try {
      const repo = new LotteryRepository(supabase);
      items = await repo.listByUser(user.id);
    } catch {
      items = [];
    }
  }

  return (
    <MobilePage>
      <PageHeader title="当落" description="抽選結果の記録" />
      <LotteryResultList items={items} />
    </MobilePage>
  );
}
