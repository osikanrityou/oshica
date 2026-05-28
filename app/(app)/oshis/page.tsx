import { MobilePage } from "@/components/layout/MobilePage";
import { PageHeader } from "@/components/layout/PageHeader";
import { OshiList } from "@/features/oshi/components/OshiList";
import { createClient } from "@/lib/supabase/server";
import { OshiRepository } from "@/server/repositories/oshi-repository";

export const metadata = { title: "推し" };

export default async function OshisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let items: Awaited<ReturnType<OshiRepository["listByUser"]>> = [];

  if (user) {
    try {
      const repo = new OshiRepository(supabase);
      items = await repo.listByUser(user.id);
    } catch {
      items = [];
    }
  }

  return (
    <MobilePage>
      <PageHeader title="推し" description="推し・作品マスタ" />
      <OshiList items={items} />
    </MobilePage>
  );
}
