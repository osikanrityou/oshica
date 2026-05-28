import Link from "next/link";

import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import { formatDate } from "@/lib/utils";
import type { Tables } from "@/lib/supabase/database.types";

type ReservationListProps = {
  items: Tables<"reservations">[];
};

export function ReservationList({ items }: ReservationListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="予約がまだありません"
        description="グッズ予約やカフェ予約を登録しましょう"
        actionLabel="予約を追加"
        actionHref={ROUTES.reservationNew}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link href={`${ROUTES.reservations}/${item.id}`}>
            <Card className="transition-colors hover:border-rose-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{item.title}</p>
                  {item.deadline_at ? (
                    <p className="mt-1 text-xs text-zinc-500">
                      締切: {formatDate(item.deadline_at)}
                    </p>
                  ) : null}
                </div>
                <StatusBadge status={item.status} />
              </div>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
