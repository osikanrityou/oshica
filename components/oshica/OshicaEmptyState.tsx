import Link from "next/link";
import type { ReactNode } from "react";

import { OshicaCard } from "@/components/oshica/OshicaCard";

type OshicaEmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
};

export function OshicaEmptyState({
  icon,
  title,
  description,
  href,
  actionLabel,
}: OshicaEmptyStateProps) {
  return (
    <OshicaCard className="text-center">
      <div className="py-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
          {icon}
        </div>

        <p className="mt-4 font-black text-oshica-text">{title}</p>

        <p className="mt-1 text-sm font-medium text-oshica-primary">
          {description}
        </p>

        {href && actionLabel && (
          <Link
            href={href}
            className="mt-5 inline-flex rounded-full bg-oshica-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </OshicaCard>
  );
}