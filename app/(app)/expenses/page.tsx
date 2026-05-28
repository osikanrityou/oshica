import Link from "next/link";

import { MobilePage } from "@/components/layout/MobilePage";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ExpenseList } from "@/features/expense/components/ExpenseList";
import { ROUTES } from "@/lib/constants/routes";
import { createClient } from "@/lib/supabase/server";
import { ExpenseRepository } from "@/server/repositories/expense-repository";

export const metadata = { title: "支出" };

export default async function ExpensesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let items: Awaited<ReturnType<ExpenseRepository["listByUser"]>> = [];

  if (user) {
    try {
      const repo = new ExpenseRepository(supabase);
      items = await repo.listByUser(user.id);
    } catch {
      items = [];
    }
  }

  return (
    <MobilePage>
      <PageHeader
        title="支出"
        action={
          <Link href={ROUTES.expenseNew}>
            <Button size="sm" type="button">
              新規
            </Button>
          </Link>
        }
      />
      <ExpenseList items={items} />
    </MobilePage>
  );
}
