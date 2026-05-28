"use client";

import { ErrorFallback } from "@/components/shared/ErrorFallback";
import { MobilePage } from "@/components/layout/MobilePage";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <MobilePage>
      <ErrorFallback reset={reset} />
    </MobilePage>
  );
}
