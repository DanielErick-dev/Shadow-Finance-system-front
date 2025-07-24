"use client";

import type { Expense } from "@base/types/expenses";
import { Pencil, Trash2, Calendar, Tag } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@base/components/ui/tooltip";
import { CheckCircle } from "lucide-react";

type ExpenseListProps = {
    expenses: Expense[];
    onMarkAsPaid: (expenseId: number) => Promise<void>;
};
type ExpenseCardProps = {
    expense: Expense;
    markAsPaid: (expenseId: number) => void;
}

function ExpenseCard({ expense, markAsPaid }: ExpenseCardProps) {
    const isPaid = expense.paid;
    const statusClasses = isPaid
        ? "border-green-500/30 hover:border-green-500/60"
        : "border-amber-500/30 hover:border-amber-500/60";

    return (
        <div
            className={`bg-slate-900/80 backdrop-blur-sm border rounded-lg overflow-hidden 
                        ${statusClasses} transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10
                        flex flex-col h-full`}
        >
            <div className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-100 truncate" title={expense.name}>
                            {expense.name}
                        </h3>
                        {expense.category && (
                            <span className="mt-1 flex items-center gap-1 text-xs text-purple-300 font-mono">
                                <Tag className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{expense.category.name}</span>
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>  
                                    <button 
                                        onClick={() => alert(`Editar: ${expense.name}`)} className="p-1.5 rounded-full hover:bg-slate-700 group" title="Editar">
                                            <Pencil className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 cursor-pointer hover:scale-100" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    Editar Despesa
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>  
                                    <button 
                                        onClick={() => alert(`Deletar: ${expense.name}`)}
                                        className="p-1.5 rounded-full hover:bg-slate-700 group" title="Deletar">
                                            <Trash2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500 cursor-pointer" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    Deletar Despesa
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {!expense.paid && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => markAsPaid(expense.id)}
                                            className="p-1.5 rounded-full hover:bg-slate-700 group"
                                            title="Marcar Como Paga"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-green-500"/>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        Marcar Como Paga
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 pb-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span className="truncate">
                            Venc:{" "}
                            {new Date(expense.due_date + "T00:00:00").toLocaleDateString("pt-BR", { timeZone: "UTC", day: "2-digit", month: "2-digit" })}
                        </span>
                    </div>
                    {expense.payment_date && (
                        <div className="flex items-center gap-2 text-xs text-green-400">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">
                                Pago:{" "}
                                {new Date(expense.payment_date + "T00:00:00").toLocaleDateString("pt-BR", { timeZone: "UTC", day: "2-digit", month: "2-digit" })}
                            </span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold w-full text-center ${isPaid ? "bg-green-900/50 text-green-300" : "bg-amber-900/50 text-amber-400"}`}>
                        {isPaid ? "CONCLUÍDA" : "PENDENTE"}
                    </span>
                    <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 text-center">
                        R$ {Number(expense.amount).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ExpenseList({ expenses, onMarkAsPaid }: ExpenseListProps) {
    if (!expenses || expenses.length === 0) {
        return (
            <div className="text-center py-16 rounded-xl bg-slate-900 border border-dashed border-slate-700">
                <svg className="mx-auto h-12 w-12 text-slate-600"><path /* ... */ /></svg>
                <h3 className="mt-4 text-lg font-medium text-slate-300">Nenhum Registro Encontrado</h3>
                <p className="mt-1 text-sm text-slate-500">Nenhuma despesa corresponde aos filtros selecionados.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {expenses.map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} markAsPaid={onMarkAsPaid}/>
            ))}
        </div>
    );
}
