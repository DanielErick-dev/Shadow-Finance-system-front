"use client"
import PrivateRoute from "@base/components/layout/PrivateRoute"
import { useEffect } from "react"
import { InvestimentCard } from "@base/components/investiments/listInvestiment"
import { useInvestimentStore } from "@base/store/useInvestimentsStore"

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
      <div className="container">
        <h1 className="capitalize mt-4 text-center">página em Desenvolvimento</h1>
        {cards.map((card) => (
          <InvestimentCard key={card.id} data={card} />
        ))}
        
      </div>
    </PrivateRoute>
  )
}