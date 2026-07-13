import Link from "next/link";
import { ChevronLeft, Trophy } from "lucide-react";

import { MobilePage } from "@/components/layout/MobilePage";
import { SidebarMenuButton } from "@/components/layout/SidebarMenu";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { LotteryResultList } from "@/features/lottery-result/components/LotteryResultList";
import { createClient } from "@/lib/supabase/server";
import { LotteryRepository } from "@/server/repositories/lottery-repository";

export const metadata = {
  title: "当落",
};

type Props = {
  searchParams?: Promise<{
    oshiId?: string;
  }>;
};

export default async function ResultsPage({ searchParams }: Props) {
  const params = await searchParams;
  const oshiId = params?.oshiId;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let items: Awaited<ReturnType<LotteryRepository["listByUser"]>> = [];
  let selectedOshi: { id: string; name: string } | null = null;

  if (user) {
    const repo = new LotteryRepository(supabase);

    const [selectedOshiResult, itemsResult] = await Promise.all([
      oshiId
        ? supabase
            .from("oshis")
            .select("id, name")
            .eq("id", oshiId)
            .eq("user_id", user.id)
            .single()
        : Promise.resolve({ data: null }),
      repo.listByUser(user.id).catch(() => []),
    ]);

    selectedOshi = selectedOshiResult.data;

    items = oshiId
      ? itemsResult.filter((item: any) => item.oshi_id === oshiId)
      : itemsResult;
  }

  return (
    <MobilePage className="bg-oshica-bg pb-32">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedOshi ? (
            <Link
              href={`/oshis/${selectedOshi.id}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-secondary shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : (
            <SidebarMenuButton />
          )}

          <p className="text-base font-black tracking-wide text-oshica-secondary">
            Oshica
          </p>
        </div>

        <div className="h-10 w-10" />
      </div>

      <OshicaPageHeader
        label="Lottery"
        title={selectedOshi ? `${selectedOshi.name}の当落` : "当落"}
        description={
          selectedOshi
            ? "この推しに登録した当落だけを表示しています"
            : "応募したイベントの結果を記録できます"
        }
        icon={<Trophy className="h-5 w-5" />}
        actionHref="/results/new"
        actionLabel="追加する ›"
      />

      {selectedOshi ? (
        <Link
          href={`/oshis/${selectedOshi.id}`}
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold text-oshica-primary shadow-sm"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          推し詳細へ戻る
        </Link>
      ) : null}

      <section className="mt-6">
        <LotteryResultList items={items} />
      </section>
    </MobilePage>
  );
}