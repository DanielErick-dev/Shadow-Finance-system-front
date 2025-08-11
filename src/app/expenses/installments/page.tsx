"use client"
import { useState, useEffect } from 'react'
import { useInstallmentsExpenseStore } from '@base/store/useInstallmentExpense'
import InstallmentExpenseGrid from '@base/components/installments_expenses/InstallmentExpenseGrid';

export default function InstallmentsPage(){
  const { 
    error, 
    loading, 
    fetchInstallmentsExpenses, 
    installmentsExpenses
  } = useInstallmentsExpenseStore();

  useEffect(() => {
    fetchInstallmentsExpenses();
  }, [fetchInstallmentsExpenses]);

  if(loading){
    return (
      <div 
        className='flex h-screen items-center justify-center text-lg text-purple-400 animate-pulse'
      >
        [ Carregando Contratos Parcelados...]
      </div>
    )
  }
  if(error){
    return(
      <div className='text-center p-10 text-red-400'>[ ERRO: {error} ]</div>
    )
  }
  return(
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <InstallmentExpenseGrid installmentExpenses={installmentsExpenses} />
      </div>
    </main>
  )
}