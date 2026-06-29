"use client";

type DeleteButtonProps = {
  label?: string;
  message?: string;
};

export function DeleteButton({
  label = "削除",
  message = "本当に削除しますか？",
}: DeleteButtonProps) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!confirm(message)) {
          event.preventDefault();
        }
      }}
      className="
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
      "
    >
      {label}
    </button>
  );
}