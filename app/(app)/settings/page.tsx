import Link from "next/link";

import { MobilePage } from "@/components/layout/MobilePage";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { ROUTES } from "@/lib/constants/routes";
import { getAuthUser } from "@/lib/supabase/session";

export const metadata = { title: "設定" };

export default async function SettingsPage() {
  const user = await getAuthUser();

  return (
    <MobilePage>
      <PageHeader title="設定" />
      <div className="space-y-3">
        <Card>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">ログイン中</p>
          <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {user?.email ?? "—"}
          </p>
        </Card>
        <Card>
          <Link
            className="text-sm font-medium text-rose-500 hover:text-rose-600"
            href={ROUTES.settingsAccount}
          >
            アカウント設定 →
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            プラン: Free（Stripe 連携は Phase 3）
          </p>
        </Card>
        <LogoutButton className="w-full" />
      </div>
    </MobilePage>
  );
}
