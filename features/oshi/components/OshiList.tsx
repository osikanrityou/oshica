import Link from "next/link";

import { EmptyState } from "@/components/shared/EmptyState";
import { OshiChip } from "@/components/shared/OshiChip";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import type { Tables } from "@/lib/supabase/database.types";

type OshiListProps = {
  items: any[];
};

export function OshiList({ items }: OshiListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="推しを登録しましょう"
        description="アニメ・VTuber・ゲーム・アイドルなど"
      />
    );
  }

 return (
  <ul className="space-y-4">
    {items.map((item) => (
      <li key={item.id}>
        <Link href={`${ROUTES.oshis}/${item.id}`}>
          <Card className="rounded-3xl border-0 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-4">
              
              {/* アイコン */}
              <div className="h-16 w-16 overflow-hidden rounded-full bg-sky-100">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl text-sky-400">
                    ♡
                  </div>
                )}
              </div>

              {/* テキスト */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-800">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      {item.memo || "推しメモ未設定"}
                    </p>
                  </div>

                  <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-500">
                    {item.category}
                  </div>
                </div>

                {/* 下部 */}
                <div className="mt-4 flex items-center gap-4 text-sm text-zinc-400">
                  <span>🎁 0</span>
                  <span>🎫 0</span>
                  <span>💰 0</span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </li>
    ))}
  </ul>
);}