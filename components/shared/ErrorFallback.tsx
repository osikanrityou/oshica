type ErrorFallbackProps = {
  title?: string;
  message?: string;
  reset?: () => void;
};

export function ErrorFallback({
  title = "エラーが発生しました",
  message = "しばらくしてから再度お試しください。",
  reset,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="font-medium text-zinc-900 dark:text-zinc-50">{title}</p>
      <p className="text-sm text-zinc-500">{message}</p>
      {reset ? (
        <button
          type="button"
          onClick={reset}
          className="text-sm font-medium text-rose-500"
        >
          再試行
        </button>
      ) : null}
    </div>
  );
}
