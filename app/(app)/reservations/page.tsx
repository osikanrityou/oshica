import Link from "next/link";

import { MobilePage } from "@/components/layout/MobilePage";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ReservationList } from "@/features/reservation/components/ReservationList";
import { ROUTES } from "@/lib/constants/routes";
import { createClient } from "@/lib/supabase/server";
import { ReservationRepository } from "@/server/repositories/reservation-repository";

export const metadata = { title: "予約" };

export default async function ReservationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let items: Awaited<ReturnType<ReservationRepository["listByUser"]>> = [];

  if (user) {
    try {
      const repo = new ReservationRepository(supabase);
      items = await repo.listByUser(user.id);
    } catch {
      items = [];
    }
  }

  return (
    <MobilePage>
      <PageHeader
        title="予約"
        description="グッズ・カフェなど"
        action={
          <Link href={ROUTES.reservationNew}>
            <Button size="sm" type="button">
              新規
            </Button>
          </Link>
        }
      />
      <ReservationList items={items} />
    </MobilePage>
  );
}
