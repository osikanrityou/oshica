"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

type DeleteButtonProps = {
  label?: string;
  pendingLabel?: string;
  message?: string;
};

export function DeleteButton({
  label = "削除",
  pendingLabel = "削除中...",
  message = "本当に削除しますか？",
}: DeleteButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (pending) {
          event.preventDefault();
          return;
        }

        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      className="
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-full
        border
        border-red-200
        bg-red-50
        px-4
        py-2
        text-sm
        font-bold
        text-red-500
        transition
        hover:bg-red-100
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}