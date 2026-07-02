import Link from "next/link";
import { CircleCheck, CircleDashed, CircleX, Trophy } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import type { Tables } from "@/lib/supabase/database.types";

type LotteryResultListProps = {
  items: Tables<"lottery_results">[];
};

export function LotteryResultList({ items }: LotteryResultListProps) {
  if (items.length === 0) {
    return (
      <OshicaCard className="text-center">
        <p className="font-bold text-oshica-text">当落記録はまだありません</p>
        <p className="mt-1 text-sm text-oshica-primary">
          追加するから登録できます
        </p>

        <Link
          href="/results/new"
          className="mt-4 inline-flex rounded-full bg-oshica-primary px-5 py-3 text-sm font-bold text-white"
        >
          当落を追加
        </Link>
      </OshicaCard>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const isWin = item.result === "won";
        const isLose = item.result === "lost";

        return (
          <li key={item.id}>
            <Link href={`/results/${item.id}`} className="block">
              <OshicaCard className="transition-all duration-200 active:scale-[0.98]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oshica-bg">
                      <Trophy className="h-5 w-5 text-oshica-primary" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-black text-oshica-text">
                        {item.source_type ?? "当落記録"}
                      </p>

                      {item.announced_at && (
                        <p className="mt-1 text-xs text-oshica-primary">
                          発表日：{item.announced_at}
                        </p>
                      )}

                      {item.notes && (
                        <p className="mt-1 line-clamp-1 text-xs text-oshica-primary">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                      isWin
                        ? "bg-green-100 text-green-700"
                        : isLose
                        ? "bg-red-100 text-red-700"
                        : "bg-oshica-bg text-oshica-secondary"
                    }`}
                  >
                    {isWin ? (
                      <span className="flex items-center gap-1">
                        <CircleCheck className="h-3.5 w-3.5" />
                        当選
                      </span>
                    ) : isLose ? (
                      <span className="flex items-center gap-1">
                        <CircleX className="h-3.5 w-3.5" />
                        落選
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <CircleDashed className="h-3.5 w-3.5" />
                        未発表
                      </span>
                    )}
                  </span>
                </div>
              </OshicaCard>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}