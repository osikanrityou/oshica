import Link from "next/link";

import { MobilePage } from "@/components/layout/MobilePage";
import { ROUTES } from "@/lib/constants/routes";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      <MobilePage className="flex flex-col justify-center pb-8 pt-10">
        <div className="mb-8 text-center">
          <Link
            href={ROUTES.home}
            className="text-xl font-bold tracking-tight text-rose-500"
          >
            Oshica
          </Link>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            推し活を、まとめて管理
          </p>
        </div>
        {children}
      </MobilePage>
    </div>
  );
}
