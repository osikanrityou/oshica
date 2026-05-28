import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

/**
 * ログイン・新規登録画面で共通利用するカードレイアウト
 */
export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="border-zinc-200/80 shadow-md dark:border-zinc-800">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {children}
    </Card>
  );
}
