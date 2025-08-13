"use client"
import type { InstallmentExpense } from "@base/types/expenses"
import { CreditCard } from "lucide-react"
import InstallmentExpenseCard from "@base/components/installments_expenses/InstallmentExpenseCard"

type InstallmentExpenseGridProps = {
  installmentExpenses: InstallmentExpense[]
}

export default function InstallmentExpenseGrid({ installmentExpenses }: InstallmentExpenseGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {installmentExpenses.map((expense) => (
          <InstallmentExpenseCard key={expense.id} installmentExpense={expense} />
        ))}
      </div>

      {installmentExpenses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Nenhuma despesa parcelada</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Adicione suas primeiras despesas parceladas para começar a organizar suas finanças.
          </p>
        </div>
      )}
    </>
  )
}
