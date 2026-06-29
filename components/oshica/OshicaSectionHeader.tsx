import Link from "next/link";

type OshicaSectionHeaderProps = {
  title: string;
  href?: string;
  actionLabel?: string;
};

export function OshicaSectionHeader({
  title,
  href,
  actionLabel = "すべて見る ›",
}: OshicaSectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-black text-[#001117]">{title}</h2>

      {href && (
        <Link href={href} className="text-xs font-bold text-[#60799E]">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}