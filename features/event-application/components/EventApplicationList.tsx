import Link from "next/link";

import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import type { Tables } from "@/lib/supabase/database.types";

type EventApplicationListProps = {
  items: Tables<"event_applications">[];
};

export function EventApplicationList({ items }: EventApplicationListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="応募がまだありません"
        actionLabel="応募を追加"
        actionHref={ROUTES.eventNew}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link href={`${ROUTES.events}/${item.id}`}>
            <Card className="hover:border-rose-200">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{item.title}</p>
                <StatusBadge status={item.status} />
              </div>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
