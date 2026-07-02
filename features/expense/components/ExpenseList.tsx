import Link from "next/link";
import { PawPrint, Wallet } from "lucide-react";

import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaEmptyState } from "@/components/oshica/OshicaEmptyState";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { deleteExpense } from "@/app/(app)/expenses/actions";
import { ROUTES } from "@/lib/constants/routes";
import { formatYen } from "@/lib/utils";
import type { ExpenseWithOshi } from "@/server/repositories/expense-repository";

type ExpenseListProps = {
  items: ExpenseWithOshi[];
};

export function ExpenseList({ items }: ExpenseListProps) {
  if (items.length === 0) {
    return (
      <OshicaEmptyState
        icon={<Wallet className="h-6 w-6" />}
        title="まだ支出がありません"
        description="推し活の支出を記録しましょう"
        href={ROUTES.expenseNew}
        actionLabel="支出を追加"
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <OshicaCard
          key={item.id}
          className="px-4 py-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`${ROUTES.expenses}/${item.id}`}
              className="min-w-0 flex-1"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
                  <Wallet className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <div className="mb-1 inline-flex max-w-full items-center gap-1 rounded-full bg-oshica-bg px-2 py-1 text-[10px] font-bold text-oshica-primary">
                    <PawPrint className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {item.oshi?.name ?? "推し未設定"}
                    </span>
                  </div>

                  <p className="truncate font-black text-oshica-text">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs font-medium text-oshica-primary">
                    {item.spent_at}
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <p className="text-lg font-black text-oshica-secondary">
                {formatYen(item.amount)}
              </p>

              <form action={deleteExpense}>
                <input type="hidden" name="expenseId" value={item.id} />
                <DeleteButton message="この支出を削除しますか？" />
              </form>
            </div>
          </div>
        </OshicaCard>
      ))}
    </div>
  );
}