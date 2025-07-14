"use client"
import PrivateRoute from "@base/components/layout/PrivateRoute"
import { useEffect } from "react"
import { InvestimentCard } from "@base/components/investiments/listInvestiment"
import { useInvestimentStore } from "@base/store/useInvestimentsStore"
import BackButton from "@base/components/ui/custom/backButton"

export default function Investiments(){
  const {
    cards,
    loading: investimentLoading,
    error: investimentError,
    fetchInvestiments } = useInvestimentStore();
  
  useEffect(() => {
    fetchInvestiments();
  }, [fetchInvestiments]);
  if (investimentLoading){
    return(
      <div className="flex h-screen justify-center items-center">
        <h1>Carregando Investimentos</h1>
      </div>
    )
  }
  if (investimentError){
    return(
      <div className="flex h-screen justify-center items-center">
        <h1 className="text-red-800">ocorreu um erro ao carregar os investimentos</h1>
      </div>
    )
  }
  return(
    <PrivateRoute>
      <div className="min-h-screen text-slate-200 py-6 sm:py-10">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-5 border-b border-purple-800/50 gap-3">
            <h1 className="text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              REGISTRO DE INVESTIMENTOS
            </h1>
            <div className="mb-4 sm:mb-0">
              <BackButton/>
            </div>
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
          <div>
            {cards.map((card) => (
              <InvestimentCard
                key={card.id}
                data={card}
              />
            ))}
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}