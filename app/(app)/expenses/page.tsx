
import { Wallet } from "lucide-react";

import { MobilePage } from "@/components/layout/MobilePage";
import { OshicaCard } from "@/components/oshica/OshicaCard";
import { OshicaPageHeader } from "@/components/oshica/OshicaPageHeader";
import { ExpenseList } from "@/features/expense/components/ExpenseList";
import { createClient } from "@/lib/supabase/server";
import {
  ExpenseRepository,
  type ExpenseWithOshi,
} from "@/server/repositories/expense-repository";

export const metadata = { title: "支出" };

export default async function ExpensesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let items: ExpenseWithOshi[] = [];

  if (user) {
    try {
      const repo = new ExpenseRepository(supabase);
      items = await repo.listByUser(user.id);
    } catch {
      items = [];
    }
  }

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;

  const monthTotal = items
    .filter((item) => item.spent_at?.startsWith(thisMonth))
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <MobilePage className="bg-oshica-bg pb-36">
      <OshicaPageHeader
        label="Expenses"
        title="支出"
        description="どの推しに使った金額か、まとめて確認できます"
        icon={<Wallet className="h-5 w-5" />}
        actionHref="/expenses/new"
        actionLabel="追加する ›"
      />

      <section className="mt-6 grid grid-cols-2 gap-3">
        <OshicaCard>
          <p className="text-xs font-bold text-oshica-primary">合計支出</p>
          <p className="mt-2 text-xl font-black text-oshica-text">
            ¥{total.toLocaleString("ja-JP")}
          </p>
        </OshicaCard>

        <OshicaCard>
          <p className="text-xs font-bold text-oshica-primary">今月</p>
          <p className="mt-2 text-xl font-black text-oshica-text">
            ¥{monthTotal.toLocaleString("ja-JP")}
          </p>
        </OshicaCard>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-oshica-text">支出履歴</h2>
          <p className="text-xs font-bold text-oshica-primary">
            {items.length}件
          </p>
        </div>

        <ExpenseList items={items} />
      </section>
    </MobilePage>
  );
}