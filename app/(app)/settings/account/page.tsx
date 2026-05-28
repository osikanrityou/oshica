import { MobilePage } from "@/components/layout/MobilePage";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { requireAuthUser } from "@/lib/supabase/session";

export const metadata = { title: "アカウント" };

export default async function AccountSettingsPage() {
  const user = await requireAuthUser();

  return (
    <MobilePage>
      <PageHeader title="アカウント" />
      <Card className="space-y-3">
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">メールアドレス</p>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {user.email}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">ユーザー ID</p>
          <p className="break-all font-mono text-xs text-zinc-600 dark:text-zinc-300">
            {user.id}
          </p>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          プロフィール編集・データエクスポートは Phase 2 で実装します。
        </p>
      </Card>
    </MobilePage>
  );
}
