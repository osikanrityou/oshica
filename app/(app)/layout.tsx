
import { AppShell } from "@/components/layout/AppShell";
import { requireAuthUser } from "@/lib/supabase/session";

/**
 * アプリ本体レイアウト（保護ルート）
 *
 * middleware でガードしているが、Server Component 側でも
 * requireAuthUser() で二重にチェックし、未ログインの描画を防ぐ
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthUser();

  return <AppShell>{children}</AppShell>;
}
