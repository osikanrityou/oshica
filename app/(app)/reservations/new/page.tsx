import { MobilePage } from "@/components/layout/MobilePage";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = { title: "予約を追加" };

export default function NewReservationPage() {
  return (
    <MobilePage>
      <PageHeader title="予約を追加" />
      <p className="text-sm text-zinc-500">
        フォーム実装は Phase 1 で追加します。Zod スキーマは{" "}
        <code className="text-xs">lib/validations/reservation.ts</code> に定義済みです。
      </p>
    </MobilePage>
  );
}
