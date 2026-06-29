type OshicaToastProps = {
  message: string;
  type?: "success" | "error";
};

export function OshicaToast({ message, type = "success" }: OshicaToastProps) {
  return (
    <div
      className={`fixed left-1/2 top-6 z-[9999] w-[90%] max-w-sm -translate-x-1/2 rounded-2xl px-4 py-3 text-sm font-bold shadow-lg ${
        type === "success"
          ? "bg-white text-oshica-text"
          : "bg-red-50 text-red-500"
      }`}
    >
      {type === "success" ? "✓ " : "⚠ "}
      {message}
    </div>
  );
}