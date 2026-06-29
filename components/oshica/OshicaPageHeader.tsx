import Link from "next/link";
import { ReactNode } from "react";

type OshicaPageHeaderProps = {
  label: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  actionHref?: string;
  actionLabel?: string;
};

export function OshicaPageHeader({
  label,
  title,
  description,
  icon,
  actionHref,
  actionLabel = "追加する ›",
}: OshicaPageHeaderProps) {
  return (
    <header className="rounded-[2rem] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary">
              {icon}
            </div>
          )}

          <div>
            <p className="text-sm font-bold text-oshica-primary">
              {label}
            </p>

            <h1 className="mt-1 text-2xl font-black text-oshica-text">
              {title}
            </h1>
          </div>
        </div>

        {actionHref && (
          <Link
            href={actionHref}
            className="text-xs font-bold text-oshica-primary"
          >
            {actionLabel}
          </Link>
        )}
      </div>

      {description && (
        <p className="mt-3 text-sm leading-relaxed text-oshica-primary">
          {description}
        </p>
      )}
    </header>
  );
}