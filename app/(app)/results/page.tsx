import { Trophy } from "lucide-react";

import { MobilePage } from "@/components/layout/MobilePage";
import { SidebarMenuButton } from "@/components/layout/SidebarMenu";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { LotteryResultList } from "@/features/lottery-result/components/LotteryResultList";
import { createClient } from "@/lib/supabase/server";
import { LotteryRepository } from "@/server/repositories/lottery-repository";

export const metadata = {
  title: "当落",
};

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
    <MobilePage className="bg-oshica-bg pb-32">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SidebarMenuButton />

          <p className="text-base font-black tracking-wide text-oshica-secondary">
            Oshica
          </p>
        </div>

        <div className="h-10 w-10" />
      </div>

      <OshicaPageHeader
        label="Lottery"
        title="当落"
        description="応募したイベントの結果を記録できます"
        icon={<Trophy className="h-5 w-5" />}
        actionHref="/results/new"
        actionLabel="追加する ›"
      />

      <section className="mt-6">
        <LotteryResultList items={items} />
      </section>
    </MobilePage>
  );
}