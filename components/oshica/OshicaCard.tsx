type OshicaCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function OshicaCard({ children, className = "" }: OshicaCardProps) {
  return (
    <div
      className={`rounded-3xl border border-[#BFCDE0]/70 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}