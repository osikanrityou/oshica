import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/card";
import type { Tables } from "@/lib/supabase/database.types";

type LotteryResultListProps = {
  items: Tables<"lottery_results">[];
};

export function LotteryResultList({ items }: LotteryResultListProps) {
  if (items.length === 0) {
    return <EmptyState title="当落記録がまだありません" />;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-600">{item.source_type}</p>
              <StatusBadge status={item.result} />
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
