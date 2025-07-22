"use client"

import type React from "react"

import { useMemo, useEffect, useState } from "react"
import { useExpensesStore } from "@base/store/useExpensesStore"
import ExpenseList from "@base/components/expenses/ListExpense"

type StatusFilter = "all" | "pending" | "paid"

export default function ExpensesPage() {
  const { expenses, categories, loading, error, fetchExpenses, fetchCategories } = useExpensesStore()
  const [dateFilters, setDateFilters] = useState({
    due_date__year: '',
    due_date__month: '',
  })

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  useEffect(() => {
    if(!dateFilters.due_date__year || !dateFilters.due_date__month){
        const now = new Date();
        setDateFilters({
            due_date__year: now.getFullYear().toString(),
            due_date__month: (now.getMonth() + 1).toString(),
        })
    }
  })
  useEffect(() => {
    if(dateFilters.due_date__year && dateFilters.due_date__month){
        fetchExpenses(dateFilters)
        fetchCategories()
    }
    
  }, [fetchExpenses, fetchCategories, dateFilters])

  const filteredExpenses = useMemo(() => {
    if (statusFilter === "pending") {
      return expenses.filter((expense) => !expense.paid)
    }
    if (statusFilter === "paid") {
      return expenses.filter((expense) => expense.paid)
    }
    return expenses
  }, [expenses, statusFilter])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setDateFilters((prev) => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setDateFilters({ due_date__year: "", due_date__month: "" })
  }

  const availableYears = [new Date().getFullYear() + 1, new Date().getFullYear(), new Date().getFullYear() - 1]

  const monthsOfYear = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(0, i).toLocaleString("pt-BR", { month: "long" }),
  }))

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-900 border-t-purple-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
          <div className="mt-6 text-center">
            <div className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              [ CARREGANDO SISTEMA... ]
            </div>
            <div className="text-sm text-slate-400 mt-2 animate-pulse">Inicializando módulo de despesas</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-8 bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
          <div className="text-2xl font-bold text-red-400 mb-2">[ ERRO DO SISTEMA ]</div>
          <div className="text-red-300">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div
            className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-950 pointer-events-none"
        ></div>

        <div
            className={`fixed inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] pointer-events-none`}
        ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-xl blur"></div>
            <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-slate-200">Filtros Temporais</h3>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group w-full sm:w-auto">
                    <select
                      name="due_date__year"
                      id="due_date__year"
                      value={dateFilters.due_date__year}
                      onChange={handleFilterChange}
                      className="w-full sm:w-auto bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-lg px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                      {availableYears.map(year => (
                        <option key={year} value={year} className="bg-slate-800">{year}</option>
                      ))}
                    </select>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  
                  <div className="relative group w-full sm:w-auto">
                    <select
                      name="due_date__month"
                      id="due_date__month"
                      value={dateFilters.due_date__month}
                      onChange={handleFilterChange}
                      className="w-full sm:w-auto bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-lg px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                      {monthsOfYear.map(month => (
                        <option key={month.value} value={month.value} className="bg-slate-800">
                          {month.name.charAt(0).toUpperCase() + month.name.slice(1)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  
                  <button
                    onClick={clearFilters}
                    className="relative group w-full sm:w-auto bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 border border-slate-500/50 rounded-lg px-6 py-3 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/20 hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10">Limpar Data</span>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
              
              <div className="border-t border-slate-700/50 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-slate-200">Status dos Lançamentos</h3>
                </div>
                
                <div className="hidden sm:flex items-center gap-3">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`relative group px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                      statusFilter === 'all' 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30 border border-purple-400/50' 
                        : 'bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 hover:from-slate-600 hover:to-slate-500 border border-slate-500/50 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">Todas</span>
                    {statusFilter === 'all' && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-purple-600/20 animate-pulse"></div>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`relative group px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                      statusFilter === 'pending' 
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/30 border border-amber-400/50' 
                        : 'bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 hover:from-slate-600 hover:to-slate-500 border border-slate-500/50 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">Pendentes</span>
                    {statusFilter === 'pending' && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/20 to-amber-600/20 animate-pulse"></div>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setStatusFilter('paid')}
                    className={`relative group px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                      statusFilter === 'paid' 
                        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30 border border-green-400/50' 
                        : 'bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 hover:from-slate-600 hover:to-slate-500 border border-slate-500/50 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">Concluídas</span>
                    {statusFilter === 'paid' && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/20 to-green-600/20 animate-pulse"></div>
                    )}
                  </button>
                </div>
                
                <div className="sm:hidden">
                  <div className="relative group">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                      className="w-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-lg p-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-purple-400/50"
                    >
                      <option value="all" className="bg-slate-800">Mostrar Todas</option>
                      <option value="pending" className="bg-slate-800">Mostrar Pendentes</option>
                      <option value="paid" className="bg-slate-800">Mostrar Concluídas</option>
                    </select>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-blue-600/15 rounded-xl blur"></div>
          <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold text-slate-200">Lista de Despesas</h3>
              <div className="ml-auto text-sm text-slate-400 font-mono">
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'item' : 'itens'}
              </div>
            </div>
            
            <div className="relative">
              <ExpenseList expenses={filteredExpenses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
