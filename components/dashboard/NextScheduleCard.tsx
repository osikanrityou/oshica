import Link from "next/link";

type Schedule = {
  id: string;
  title: string;
  date: string;
  label: string;
  href: string;
};

type Props = {
  schedule?: Schedule;
  deadlineText: (date: string) => string;
};

export function NextScheduleCard({
  schedule,
  deadlineText,
}: Props) {
  if (!schedule) {
    return null;
  }

  return (
    <Link
      href={schedule.href}
      className="mt-6 block rounded-[2rem] bg-sky-400 p-5 text-white shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold opacity-90">
            次の予定
          </p>

          <p className="mt-2 text-lg font-black">
            {schedule.title}
          </p>

          <p className="mt-1 text-sm opacity-90">
            {schedule.label}・{schedule.date}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-sky-500">
          {deadlineText(schedule.date)}
        </span>
      </div>
    </Link>
  );
}