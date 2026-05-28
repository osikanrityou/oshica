import Link from "next/link";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">{title}</p>
      {description ? (
        <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      ) : null}
      {actionLabel && actionHref ? (
        <Link href={actionHref}>
          <Button type="button">{actionLabel}</Button>
        </Link>
      ) : null}
    </div>
  );
}
