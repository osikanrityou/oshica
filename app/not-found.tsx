import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-xl font-bold">ページが見つかりません</h1>
      <Link href={ROUTES.dashboard}>
        <Button type="button">ホームへ</Button>
      </Link>
    </div>
  );
}
