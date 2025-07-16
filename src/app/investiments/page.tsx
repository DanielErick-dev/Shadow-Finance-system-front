"use client"
import { useEffect, useState } from "react"
import { InvestimentCard } from "@base/components/investiments/listInvestiment"
import { useInvestimentStore } from "@base/store/useInvestimentsStore"
import BackButton from "@base/components/ui/custom/backButton"
import GenericFormModal from "@base/components/ui/custom/GenericFormModal"
import { Label } from "@base/components/ui/label"
import { useAssetsStore } from "@base/store/useAssetsStore"

export default function Investiments(){
  const {
    cards,
    loading: investimentLoading,
    error: investimentError,
    fetchInvestiments,
    addMonthCard,
    addInvestiments } = useInvestimentStore();
  
  const { assets, loading: assetsLoading, error: assetsError, fetchAssets } = useAssetsStore();
  const [isSubmittingMonth, setIsSubmittingMonth] = useState(false);
  const [newMonthData, setNewMonthData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchInvestiments();
    fetchAssets();
  }, [fetchInvestiments, fetchAssets]);

  const handleAddMonthSubmit = async () => {
    setIsSubmittingMonth(true);
    try{
      await addMonthCard(newMonthData);
    } catch (error: any){
      console.error(error.message || 'Erro ao adicionar novo mês de referência')
    } finally{
      setIsSubmittingMonth(false);
    }
  }
  const handleNewMonthChange = (e: any) => {
    const { name, value } = e.target
    setNewMonthData((prev) => ({
      ...prev,
      [name]: Number(value)
    }));
  }
  const anosDisponiveis = [2023, 2024, 2025]
  const mesesDoAno = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(0, i).toLocaleString('pt-BR', { month: 'long' })
  }))
  if (investimentLoading || assetsLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <p className="text-lg text-purple-400 animate-pulse">
                    「 Carregando dados do sistema... 」
                </p>
            </div>
        )
    }
    if (investimentError || assetsLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="rounded-lg border border-red-500/50 bg-red-900/20 p-6 text-center">
                    <h3 className="text-lg font-bold text-red-400">[ ERRO DE CONEXÃO ]</h3>
                    <p className="text-red-400/80 mt-2">{investimentError || assetsLoading}</p>
                </div>
            </div>
        )
    }
  return(
    <div className="min-h-screen text-slate-200 py-6 sm:py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-5 border-b border-purple-800/50 gap-3">
          <h1 className="text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            REGISTRO DE INVESTIMENTOS
          </h1>
          <div className="mb-4 sm:mb-0">
            <BackButton/>
          </div>
          <GenericFormModal
            title="[ADICIONAR MÊS DE REFERÊNCIA"
            description="[selecione o mês e ano para criar um novo registro de investimentos]"
            isSubmitting={isSubmittingMonth}
            onSubmit={handleAddMonthSubmit}
            submitText="CRIAR REGISTRO"
            triggerButton={
            <button className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600
            text-white font-semibold px-4 py-2 cursor-pointer rounded-lg hover:from-purple-500 hover:to-blue-500 transition-colors shadow-lg duration-200 
            ">
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              NOVO MÊS DE REFERÊNCIA
            </button>
            }
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="month"
                  className="text-sm font-semibold text-purple-300 tracking-wide"
                >
                  Mês
                </Label>
                <select
                  name="month"
                  id="month"
                  value={newMonthData.month}
                  onChange={handleNewMonthChange}
                  className="block w-full bg-slate-800 border-2 border-slate-700
                  focus:border-purple-500 focus:ring-purple-500 rounded-md"
                
                >
                  {mesesDoAno.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.name.charAt(0).toUpperCase() + month.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="year"
                  className="text-sm font-semibold text-purple-300 tracking-wide"
                >
                  Ano
                </Label>
                <input
                  name="year"
                  id="year"
                  type="number"
                  value={newMonthData.year}
                  onChange={handleNewMonthChange}
                  className="block w-full bg-slate-800 border-2 border-slate-700
                  rounded-md focus:border-purple-500 focus:ring-purple-500"
                  min={2000}
                  max={new Date().getFullYear() + 10}
                />
              </div>
            </div>
          </GenericFormModal>
        </header>
        {cards.length === 0 && (
          <div className="text-center py-16 bg-slate-900 border rounded-xl border-dashed border-slate-700">
            <svg 
              className="mx-auto h-12 w-12 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-slate-300">Nenhum Registro Encontrado</h3>
            <p className="mt-1 text-sm text-slate-500">Inicie adicionando um novo mês de referência para seus investimentos</p>
          </div>

        )}
        <div className="space-y-10">
          {cards.map((card) => (
            <InvestimentCard
              key={card.id}
              data={card}
              onAddInvestiment={addInvestiments}
              availableAssets={assets}
            />
          ))}
        </div>
      </div>
    </div>
  )
}