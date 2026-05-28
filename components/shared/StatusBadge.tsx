import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<string, string> = {
  planned: "予定",
  reserved: "予約済",
  picked_up: "受取済",
  cancelled: "キャンセル",
  draft: "下書き",
  applied: "応募済",
  awaiting_result: "結果待ち",
  done: "完了",
  won: "当選",
  lost: "落選",
  pending: "未確定",
};

const STATUS_VARIANTS: Record<
  string,
  "default" | "secondary" | "success" | "warning" | "muted"
> = {
  won: "success",
  lost: "muted",
  pending: "warning",
  awaiting_result: "warning",
  cancelled: "muted",
};

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status] ?? "secondary"}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
