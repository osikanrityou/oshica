import Link from "next/link";

import { MobilePage } from "@/components/layout/MobilePage";
import { ROUTES } from "@/lib/constants/routes";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-100">
      <MobilePage className="flex min-h-screen flex-col justify-center pb-10 pt-10">
        <div className="mb-7 text-center">
          <Link href={ROUTES.home} className="inline-block">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white text-3xl shadow-sm">
              🐾
            </div>

            <p className="mt-4 text-2xl font-black tracking-wide text-oshica-secondary">
              Oshica
            </p>
          </Link>

          <p className="mt-2 text-sm font-bold text-oshica-primary">
            推し活の締切、もう忘れない。
          </p>
        </div>

        {children}
      </MobilePage>
    </div>
  );
}