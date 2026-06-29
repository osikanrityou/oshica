"use client";

import { useMemo, useState } from "react";

import { CalendarBottomSheet } from "./CalendarBottomSheet";
import { CalendarLegend } from "./CalendarLegend";
import { CalendarMonth } from "./CalendarMonth";
import {
  type CalendarSchedule as CalendarScheduleType,
  formatDateKey,
} from "./calendar-utils";

type Props = {
  schedules: CalendarScheduleType[];
};

export function CalendarView({ schedules }: Props) {
  const [selected, setSelected] = useState(new Date());
  const [sheetOpen, setSheetOpen] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<string, CalendarScheduleType[]>();

    schedules.forEach((item) => {
      const key = item.date;

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key)!.push(item);
    });

    return map;
  }, [schedules]);

  const selectedDateKey = formatDateKey(selected);
  const selectedSchedules = grouped.get(selectedDateKey) ?? [];

  const modifiers = {
    scheduled: Array.from(grouped.keys()).map((date) => new Date(date)),
  };

  return (
    <div className="space-y-6">
      <CalendarLegend />

      <CalendarMonth
        selected={selected}
        onSelect={(date) => {
          if (!date) return;

          setSelected(date);
          setSheetOpen(true);
        }}
        modifiers={modifiers}
      />

      <CalendarBottomSheet
        open={sheetOpen}
        schedules={selectedSchedules}
        selectedDate={selectedDateKey}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}