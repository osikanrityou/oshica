export function CalendarLegend() {
  const items = [
    {
      label: "イベント",
      className: "bg-oshica-primary",
    },
    {
      label: "締切",
      className: "bg-oshica-secondary",
    },
    {
      label: "発売日",
      className: "bg-oshica-border",
    },
    {
      label: "当落",
      className: "bg-oshica-secondary",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-oshica-primary shadow-sm"
        >
          <span className={`h-2 w-2 rounded-full ${item.className}`} />
          {item.label}
        </div>
      ))}
    </div>
  );
}