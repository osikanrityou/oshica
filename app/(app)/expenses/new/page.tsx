import { MobilePage } from "@/components/layout/MobilePage";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = { title: "支出を追加" };

export default function NewExpensePage() {
  return (
    <MobilePage>
      <PageHeader title="支出を追加" />
      <p className="text-sm text-zinc-500">Phase 1 でフォームを実装します。</p>
    </MobilePage>
  );
}
