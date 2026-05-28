"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/server/actions/auth-actions";

type LogoutButtonProps = {
  className?: string;
};

/**
 * ログアウトボタン（Server Action 実行）
 */
export function LogoutButton({ className }: LogoutButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          void signOutAction();
        });
      }}
    >
      {pending ? "ログアウト中…" : "ログアウト"}
    </Button>
  );
}
