import { notFound } from "next/navigation";

import { MobilePage } from "@/components/layout/MobilePage";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: item } = await supabase
    .from("event_applications")
    .select("*")
    .eq("user_id", user.id)
    .eq("id", id)
    .maybeSingle();

  if (!item) notFound();

  return (
    <MobilePage>
      <PageHeader
        title={item.title}
        action={<StatusBadge status={item.status} />}
      />
    </MobilePage>
  );
}
