import { MobilePage } from "@/components/layout/MobilePage";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = { title: "応募を追加" };

export default function NewEventPage() {
  return (
    <MobilePage>
      <PageHeader title="応募を追加" />
      <p className="text-sm text-zinc-500">Phase 1 でフォームを実装します。</p>
    </MobilePage>
  );
}
