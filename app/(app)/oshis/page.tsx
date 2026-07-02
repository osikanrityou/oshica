import {
  CalendarDays,
  ChevronRight,
  Droplet,
  Package,
  PawPrint,
  Plus,
} from "lucide-react";
import { SidebarMenuButton } from "@/components/layout/SidebarMenu";
import Image from "next/image";
import Link from "next/link";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaEmptyState } from "@/components/oshica/OshicaEmptyState";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "推し一覧",
};

const FREE_PER_OSHI_LIMIT = 3;

export default async function OshiPage() {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: oshis } = await supabase
    .from("oshis")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: events } = await supabase
    .from("events")
    .select("id, oshi_id")
    .eq("user_id", user.id);

  const { data: goods } = await supabase
    .from("goods")
    .select("id, oshi_id")
    .eq("user_id", user.id);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);

  const { data: expenses } = await supabase
    .from("expenses")
    .select("amount, oshi_id")
    .eq("user_id", user.id)
    .gte("spent_at", monthStart)
    .lte("spent_at", monthEnd);

  return (
    <main className="mx-auto max-w-md bg-oshica-bg px-5 pb-36 pt-8 text-oshica-text">
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
        label="Oshi"
        title="推し一覧"
        description="Freeプランでは推し3人まで登録できます"
        icon={<PawPrint className="h-5 w-5" />}
      />

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-black text-oshica-text">登録中の推し</h2>

        <Link
          href="/oshis/new"
          className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-oshica-primary shadow-sm"
        >
          <Plus className="h-4 w-4" />
          追加
        </Link>
      </div>

      <div className="mt-3 space-y-3">
        {oshis && oshis.length > 0 ? (
          oshis.map((oshi: any) => {
            const eventCount =
              events?.filter((item: any) => item.oshi_id === oshi.id).length ??
              0;

            const goodsCount =
              goods?.filter((item: any) => item.oshi_id === oshi.id).length ??
              0;

            const expenseTotal =
              expenses
                ?.filter((item: any) => item.oshi_id === oshi.id)
                .reduce((sum: number, item: any) => sum + item.amount, 0) ?? 0;

            return (
              <Link key={oshi.id} href={`/oshis/${oshi.id}`} className="block">
                <OshicaCard className="p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-oshica-bg ring-2 ring-white shadow-sm">
                      {oshi.image_url ? (
                        <Image
                          src={oshi.image_url}
                          alt={oshi.name ?? "推し"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <PawPrint className="h-7 w-7 text-oshica-primary" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-oshica-text">
                        {oshi.name ?? "推し"}
                      </p>

                      {oshi.memo && (
                        <p className="mt-1 truncate text-xs font-medium text-oshica-primary">
                          {oshi.memo}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold text-oshica-primary">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          予定 {eventCount}/{FREE_PER_OSHI_LIMIT}
                        </span>

                        <span className="flex items-center gap-1">
                          <Package className="h-3.5 w-3.5" />
                          グッズ {goodsCount}/{FREE_PER_OSHI_LIMIT}
                        </span>

                        <span className="flex items-center gap-1">
                          <Droplet className="h-3.5 w-3.5" />¥
                          {expenseTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-oshica-bg">
                      <ChevronRight className="h-4 w-4 text-oshica-primary" />
                    </div>
                  </div>
                </OshicaCard>
              </Link>
            );
          })
        ) : (
          <OshicaEmptyState
            icon={<PawPrint className="h-6 w-6" />}
            title="まだ推しが登録されていません"
            description="まずは推しを登録しましょう"
            href="/oshis/new"
            actionLabel="推しを登録"
          />
        )}
      </div>
    </main>
  );
}