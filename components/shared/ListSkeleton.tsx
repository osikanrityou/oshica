import { cn } from "@/lib/utils";

type ListSkeletonProps = {
  count?: number;
  className?: string;
};

export function ListSkeleton({ count = 3, className }: ListSkeletonProps) {
  return (
    <ul className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="h-20 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"
        />
      ))}
    </ul>
  );
}
