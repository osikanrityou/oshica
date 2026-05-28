import { cn } from "@/lib/utils";

type MobilePageProps = {
  children: React.ReactNode;
  className?: string;
};

/** スマホ向け最大幅・余白を揃えるラッパー */
export function MobilePage({ children, className }: MobilePageProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-lg flex-1 px-4 pb-24 pt-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
