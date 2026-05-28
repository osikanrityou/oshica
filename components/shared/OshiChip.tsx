import { cn } from "@/lib/utils";

type OshiChipProps = {
  name: string;
  color?: string | null;
  className?: string;
};

export function OshiChip({ name, color, className }: OshiChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
      style={
        color
          ? { backgroundColor: `${color}22`, color }
          : undefined
      }
    >
      {name}
    </span>
  );
}
