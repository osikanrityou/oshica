import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import { MobilePage } from "@/components/layout/MobilePage";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";

export const metadata = {
  title: "ライセンス",
};

const libraries = [
  "Next.js",
  "React",
  "Supabase",
  "Tailwind CSS",
  "lucide-react",
  "sonner",
  "shadcn/ui",
];

export default function LicensesPage() {
  return (
    <MobilePage className="bg-oshica-bg pb-36">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-oshica-secondary shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <p className="text-sm font-black text-oshica-secondary">ライセンス</p>

        <div className="h-10 w-10" />
      </div>

      <OshicaPageHeader
        label="License"
        title="ライセンス"
        description="利用している主なライブラリ"
        icon={<FileText className="h-5 w-5" />}
      />

      <OshicaCard className="mt-5">
        <p className="text-sm font-bold leading-7 text-oshica-primary">
          Oshicaでは、以下のオープンソースソフトウェアを利用しています。
          各ライブラリのライセンス条件に従い利用しています。
        </p>

        <div className="mt-5 space-y-2">
          {libraries.map((library) => (
            <div
              key={library}
              className="rounded-2xl bg-oshica-bg px-4 py-3 text-sm font-bold text-oshica-text"
            >
              {library}
            </div>
          ))}
        </div>
      </OshicaCard>
    </MobilePage>
  );
}