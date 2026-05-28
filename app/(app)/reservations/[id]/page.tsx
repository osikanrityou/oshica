import { notFound } from "next/navigation";

import { MobilePage } from "@/components/layout/MobilePage";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { ReservationRepository } from "@/server/repositories/reservation-repository";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `予約 ${id.slice(0, 8)}` };
}

export default async function ReservationDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const repo = new ReservationRepository(supabase);
  const item = await repo.getById(user.id, id).catch(() => null);

  if (!item) notFound();

  return (
    <MobilePage>
      <PageHeader
        title={item.title}
        action={<StatusBadge status={item.status} />}
      />
      {item.notes ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.notes}</p>
      ) : (
        <p className="text-sm text-zinc-500">メモはありません</p>
      )}
    </MobilePage>
  );
}
