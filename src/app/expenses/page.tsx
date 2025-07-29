"use client"
import type React from "react"
import { useMemo, useEffect, useState } from "react"
import { useExpensesStore } from "@base/store/useExpensesStore"
import ExpenseList from "@base/components/expenses/ListExpense"
import { ChevronDown, ChevronUp, Search, X } from "lucide-react"
import AddExpenseModalWrapper from "@base/components/expenses/AddExpenseModalWrapper"

type StatusFilter = "all" | "pending" | "paid"

export default function ExpensesPage() {
  const { 
    expenses, 
    categories, 
    loading, 
    error, 
    fetchExpenses, 
    deleteExpense,
    fetchCategories, 
    markAsPaid } = useExpensesStore()
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)
  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const [dateFilters, setDateFilters] = useState({
    due_date__year: "",
    due_date__month: "",
  })

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  useEffect(() => {
    if (!dateFilters.due_date__year || !dateFilters.due_date__month) {
      const now = new Date()
      setDateFilters({
        due_date__year: now.getFullYear().toString(),
        due_date__month: (now.getMonth() + 1).toString(),
      })
    }
  })

  useEffect(() => {
    if (dateFilters.due_date__year && dateFilters.due_date__month) {
      const allFilters = {
        ...dateFilters,
        search: searchTerm,
      }
      fetchExpenses(allFilters)
      fetchCategories()
    }
  }, [fetchExpenses, fetchCategories, dateFilters, searchTerm])

  const filteredExpenses = useMemo(() => {
    let filtered = expenses
    if (statusFilter === "pending") {
      filtered = filtered.filter((expense) => !expense.paid)
    } else if (statusFilter === "paid") {
      filtered = filtered.filter((expense) => expense.paid)
    }
    return filtered
  }, [expenses, statusFilter, searchTerm])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setDateFilters((prev) => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setDateFilters({ due_date__year: "", due_date__month: "" })
  }

  const handleSearch = () => {
    setSearchTerm(searchInput)
  }

  const clearSearch = () => {
    setSearchInput("")
    setSearchTerm("")
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
          <div className="w-12 h-12 border-3 border-purple-900 border-t-purple-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-3 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
          <div className="mt-4 text-center">
            <div className="text-base font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              [ CARREGANDO... ]
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-6 bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
          <div className="text-xl font-bold text-red-400 mb-2">[ ERRO ]</div>
          <div className="text-red-300">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="relative mb-4">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg blur"></div>
          <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg p-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50"
                  placeholder="Insira o Nome da Despesa"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSearch}
                  className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white text-xs font-semibold rounded-lg border border-purple-500/30 shadow-sm hover:shadow-purple-500/20 transition-all duration-300 active:scale-95"
                >
                  Buscar
                </button>

                {(searchInput || searchTerm) && (
                  <button
                    onClick={clearSearch}
                    className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 border border-slate-500/50 rounded-lg text-white text-xs font-medium transition-all duration-300 hover:shadow-sm hover:shadow-slate-500/20 active:scale-95 flex items-center justify-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    <span className="hidden sm:inline">Limpar</span>
                  </button>
                )}

                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="flex-none p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {isFiltersOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
              <div className="w-full sm:w-auto">
                <AddExpenseModalWrapper/>
              </div>
            </div>
          </div>
        </div>

        {isFiltersOpen && (
          <div className="mb-4">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/15 via-blue-600/15 to-purple-600/15 rounded-lg blur"></div>
              <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative group w-full sm:w-auto">
                    <select
                      name="due_date__year"
                      id="due_date__year"
                      value={dateFilters.due_date__year}
                      onChange={handleFilterChange}
                      className="w-full sm:w-auto text-sm bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-lg px-2 py-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-purple-400/50"
                    >
                      {availableYears.map((year) => (
                        <option key={year} value={year} className="bg-slate-800">
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative group w-full sm:w-auto">
                    <select
                      name="due_date__month"
                      id="due_date__month"
                      value={dateFilters.due_date__month}
                      onChange={handleFilterChange}
                      className="w-full sm:w-auto text-sm bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-lg px-2 py-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-purple-400/50"
                    >
                      {monthsOfYear.map((month) => (
                        <option key={month.value} value={month.value} className="bg-slate-800">
                          {month.name.charAt(0).toUpperCase() + month.name.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={clearFilters}
                    className="relative group w-full sm:w-auto bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 border border-slate-500/50 rounded-lg px-3 py-2 text-sm text-white font-medium transition-all duration-300 hover:shadow-sm hover:shadow-slate-500/20 active:scale-95"
                  >
                    <span className="relative z-10">Limpar</span>
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`relative group px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300 active:scale-95 ${
                        statusFilter === "all"
                          ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-sm shadow-purple-500/30 border border-purple-400/50"
                          : "bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 hover:from-slate-600 hover:to-slate-500 border border-slate-500/50 hover:text-white"
                      }`}
                    >
                      <span className="relative z-10">Todas</span>
                      {statusFilter === "all" && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-purple-600/20 animate-pulse"></div>
                      )}
                    </button>
 
                    <button
                      onClick={() => setStatusFilter("pending")}
                      className={`relative group px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300 active:scale-95 ${
                        statusFilter === "pending"
                          ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-sm shadow-amber-500/30 border border-amber-400/50"
                          : "bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 hover:from-slate-600 hover:to-slate-500 border border-slate-500/50 hover:text-white"
                      }`}
                    >
                      <span className="relative z-10">Pendentes</span>
                      {statusFilter === "pending" && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/20 to-amber-600/20 animate-pulse"></div>
                      )}
                    </button>

                    <button
                      onClick={() => setStatusFilter("paid")}
                      className={`relative group px-4 py-2 text-xs font-medium rounded-lg transition-all duration-300 active:scale-95 ${
                        statusFilter === "paid"
                          ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-sm shadow-green-500/30 border border-green-400/50"
                          : "bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 hover:from-slate-600 hover:to-slate-500 border border-slate-500/50 hover:text-white"
                      }`}
                    >
                      <span className="relative z-10">Concluídas</span>
                      {statusFilter === "paid" && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/20 to-green-600/20 animate-pulse"></div>
                      )}
                    </button>
                  </div>

                  <div className="sm:hidden">
                    <div className="relative group mt-2">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                        className="w-full text-sm bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-lg p-2 text-white font-medium focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-purple-400/50"
                      >
                        <option value="all" className="bg-slate-800">
                          Mostrar Todas
                        </option>
                        <option value="pending" className="bg-slate-800">
                          Mostrar Pendentes
                        </option>
                        <option value="paid" className="bg-slate-800">
                          Mostrar Concluídas
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg blur"></div>
          <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              <h3 className="text-sm font-medium text-slate-200">Lista de Despesas</h3>
              <div className="ml-auto text-xs text-slate-400 font-mono">
                {filteredExpenses.length} {filteredExpenses.length === 1 ? "item" : "itens"}
              </div>
            </div>

            <div className="relative">
              <ExpenseList
                expenses={filteredExpenses}
                onMarkAsPaid={markAsPaid}
                onDeleteExpense={deleteExpense} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}