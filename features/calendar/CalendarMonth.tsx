"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  selected: Date;
  onSelect: (date: Date | undefined) => void;
  modifiers: Record<string, Date[]>;
};

export function CalendarMonth({ selected, onSelect, modifiers }: Props) {
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        showOutsideDays
        modifiers={modifiers}
        modifiersClassNames={{
          scheduled:
            "after:absolute after:bottom-0.5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-oshica-primary",
        }}
        classNames={{
          months: "flex justify-center",
          month: "w-full",
          month_caption: "mb-5 flex justify-center",
          caption_label: "text-lg font-black text-oshica-text",
          nav: "absolute left-5 right-5 flex items-center justify-between",
          button_previous:
            "flex h-9 w-9 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary",
          button_next:
            "flex h-9 w-9 items-center justify-center rounded-full bg-oshica-bg text-oshica-primary",
          month_grid: "w-full border-collapse table-fixed",
          weekday:
            "w-[14.285%] pb-3 text-center text-xs font-bold text-oshica-primary",
          day: "relative h-10 w-[14.285%] text-center align-middle",
          day_button:
            "relative mx-auto flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150 hover:bg-oshica-bg active:scale-95",
          selected:
            "bg-oshica-primary text-white rounded-full shadow-sm",
          today:
            "bg-oshica-bg text-oshica-secondary rounded-full",
          outside: "text-zinc-300",
        }}
      />
    </div>
  );
}