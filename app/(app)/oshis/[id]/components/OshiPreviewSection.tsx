import Link from "next/link";

type OshiPreviewSectionProps = {
  title: string;
  listHref: string;
  emptyTitle: string;
  emptyDescription: string;
  hasItems: boolean;
  children: React.ReactNode;
};

export function OshiPreviewSection({
  title,
  listHref,
  emptyTitle,
  emptyDescription,
  hasItems,
  children,
}: OshiPreviewSectionProps) {
  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-black text-oshica-text">{title}</h2>

        <Link href={listHref} className="text-xs font-bold text-oshica-primary">
          一覧を見る ›
        </Link>
      </div>

      <div className="space-y-3">
        {hasItems ? (
          children
        ) : (
          <div className="rounded-3xl border border-dashed border-oshica-border bg-white p-5 text-center">
            <p className="font-bold text-oshica-text">{emptyTitle}</p>
            <p className="mt-1 text-sm text-oshica-primary">
              {emptyDescription}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}