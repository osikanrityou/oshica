"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  idleLabel: string;
  pendingLabel?: string;
  className?: string;
};

export function SubmitButton({
  idleLabel,
  pendingLabel = "保存中...",
  className = "",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-oshica-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        idleLabel
      )}
    </button>
  );
}