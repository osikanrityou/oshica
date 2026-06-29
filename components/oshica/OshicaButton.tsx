import Link from "next/link";
import { ReactNode } from "react";

type OshicaButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function OshicaButton({
  children,
  href,
  type = "button",
  variant = "primary",
  className = "",
}: OshicaButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition active:scale-95";

  const variantClass =
    variant === "primary"
      ? "bg-oshica-primary text-white shadow-sm"
      : variant === "secondary"
        ? "bg-oshica-bg text-oshica-secondary"
        : "bg-transparent text-oshica-primary";

  const classes = `${baseClass} ${variantClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}