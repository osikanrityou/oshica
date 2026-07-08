import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

/**
 * ログイン・新規登録画面で共通利用するカードレイアウト
 *
 * iPhoneなどのダークモード設定でも黒くならないように、
 * 認証画面では色をライトテーマに固定します。
 */
export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="border-oshica-border bg-white p-5 text-oshica-text shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-black text-oshica-text">
          {title}
        </CardTitle>
        <CardDescription className="text-sm font-bold text-oshica-primary">
          {description}
        </CardDescription>
      </CardHeader>

      {children}
    </Card>
  );
}