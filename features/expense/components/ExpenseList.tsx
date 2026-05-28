import Link from "next/link";

import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import { formatYen } from "@/lib/utils";
import type { Tables } from "@/lib/supabase/database.types";

type ExpenseListProps = {
  items: Tables<"expenses">[];
};

export function ExpenseList({ items }: ExpenseListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="支出がまだありません"
        actionLabel="支出を追加"
        actionHref={ROUTES.expenseNew}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link href={`${ROUTES.expenses}/${item.id}`}>
            <Card className="flex items-center justify-between hover:border-rose-200">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-zinc-500">{item.spent_at}</p>
              </div>
              <p className="font-semibold text-rose-500">{formatYen(item.amount)}</p>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
