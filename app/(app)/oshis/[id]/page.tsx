import Link from "next/link";
import { notFound } from "next/navigation";
import { Package, CalendarDays, Wallet } from "lucide-react";

import { MobilePage } from "@/components/layout/MobilePage";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function OshiDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: item } = await supabase
    .from("oshis")
    .select("*")
    .eq("user_id", user.id)
    .eq("id", id)
    .maybeSingle();

  if (!item) notFound();

  const oshi = item as any;

  return (
    <MobilePage>
      <main className="mx-auto max-w-md px-5 py-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-28 w-28 overflow-hidden rounded-full bg-sky-50">
              {oshi.image_url ? (
                <img
                  src={oshi.image_url}
                  alt={oshi.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl text-sky-400">
                  ♡
                </div>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-bold text-zinc-900">
              {oshi.name}
            </h1>
           <div className="mt-4">
  <Link
    href={`/oshis/${oshi.id}/edit`}
    className="inline-flex rounded-2xl border border-sky-200 px-4 py-2 text-sm font-medium text-sky-500"
  >
    編集する
  </Link>
</div>

            <p className="mt-2 rounded-full bg-sky-50 px-4 py-1 text-sm font-medium text-sky-500">
              {oshi.category || "未設定"}
            </p>

            <p className="mt-4 text-sm leading-6 text-zinc-500">
              {oshi.memo || "推しメモ未設定"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
            <p className="text-xl"><Package className="mx-auto h-6 w-6 text-sky-500" /></p>
            <p className="mt-1 text-lg font-bold">0</p>
            <p className="text-xs text-zinc-400">グッズ</p>
          </div>

          <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
            <p className="text-xl"><CalendarDays className="mx-auto h-6 w-6 text-sky-500" /></p>
            <p className="mt-1 text-lg font-bold">0</p>
            <p className="text-xs text-zinc-400">イベント</p>
          </div>

          <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
            <p className="text-xl"><Wallet className="mx-auto h-6 w-6 text-sky-500" /></p>
            <p className="mt-1 text-lg font-bold">0</p>
            <p className="text-xs text-zinc-400">支出</p>
          </div>
        </div>
      </main>
    </MobilePage>
  );
}