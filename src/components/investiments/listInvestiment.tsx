"use client"
import { useState } from "react";
import { type Asset } from "@base/types/assets";
import { 
    ItemInvestiment, 
    NewInvestimentMonthData, 
    CardInvestimentMonth 
} from "@base/types/investiments";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@base/components/ui/tooltip"
import { toast } from "react-hot-toast";
import { Pencil, Trash } from "lucide-react";

type Props = {
    data: CardInvestimentMonth
}

function InvestimentItemRow({ item }: { item: ItemInvestiment }){
    const totalValue = Number(item.quantity) * Number(item.unit_price)
    const isBuyOrder = 'COMPRA';
    return (
        <li className="bg-slate-800/60 rounded-lg border border-slate-700 p-4 space-y-4">
            <div className="flex justify-between items-start">
                <div >
                    <span
                        className={`px-2 py-1 text-xs font-bold rounded-full border
                        ${
                            isBuyOrder
                            ? 'bg-green-900/50 text-green-300 border-green-500/30'
                            : 'bg-red-900/50 text-red-300 border-red-500/30'
                        }`}
                    >
                        {item.order_type === 'BUY' ? 'COMPRA': 'VENDA'}
                    </span>
                    <h4 className="font-semibold text-lg text-blue-300 mt-1">
                        {item.asset.code.toUpperCase()}
                    </h4>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full hover:bg-slate-700 group">
                        <Pencil className="w-5 h-5 text-slate-400 group-hover:text-blue-400 cursor-pointer"/>
                    </button>
                    <button className="p-2 rounded-full hover:bg-slate-700 group">
                        <Trash className="w-5 h-5 text-slate-400 group-hover:text-red-500 cursor-pointer"/>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-700/50 pt-4">
                <div>
                    <p className="text-xs text-slate-400">Quantidade</p>
                    <p className="font-mono font-medium text-slate-200">
                        {Number(item.quantity).toLocaleString('pt-BR')}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">Preço Unitário</p>
                    <p className="font-mono font-medium text-slate-200">
                        R$ {Number(item.unit_price).toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">Data da Operação</p>
                    <p className="font-mono font-medium text-slate-200">
                        {new Date(item.operation_date + 'T00:00:00').toLocaleDateString(
                            'pt-BR', { timeZone: 'UTC' }
                        )}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">Custo Total</p>
                    <p 
                        className={`text-xl font-bold font-mono
                        ${isBuyOrder ? 'text-red-400': 'text-green-400'}`}
                    >
                        R$ {totalValue.toFixed(2)}
                    </p>
                </div>
            </div>
        </li>
    )
}
export function InvestimentCard({ data }: Props) {
    const nameMonth = new Date(data.year, data.month - 1).toLocaleString('pt-BR', { month: 'long'})
    const totalInvested = data.itens
        .filter(item => item.order_type === 'BUY')
        .reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0)
    return(
        <div className="bg-slate-900 rounded-xl shadow-lg shadow-purple-900/20 border
         border-slate-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-800/50 flex flex-col
            sm:flex-row justify-between items-center gap-2">
                <h3 className="font-bold text-xl text-slate-200 tracking-wider">
                    <span className="text-purple-400">
                         [
                    </span>
                     {nameMonth.charAt(0).toUpperCase() + nameMonth.slice(1)} / {data.year} 
                    <span className="text-purple-400">
                        ]
                    </span>
                </h3>
                <div className="flex items-center gap-4">
                    {totalInvested > 0 && (
                        <p className="text-sm font-semibold text-red-400 px-3 py-1 bg-red-900/30
                        border border-red-500/30 rounded-full">
                            Total Aportado: R$ {totalInvested.toFixed(2)}
                        </p>
                    )}
                    <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold
                    text-xs py-2 px-3 rounded-md transition-colors duration-200">
                        + Investimento
                    </button>
                </div>
            </div>
            <div className="p-5">
                {data.itens.length > 0 ? (
                    <ul className="space-y-4">
                        {data.itens.map((item) => (
                            <InvestimentItemRow key={item.id} item={item} />
                        ))}
                    </ul>
                ): (
                    <p className="text-slate-500 italic text-center py-6">
                        Nenhuma operação de investimento registrada para este período
                    </p>
                )}
            </div>
        </div>
        
    )
}

{/* {data.itens.map((item) => {
            return(
                <div>
                    <p>ativo da operação: {item.asset.code} - {item.asset.type}</p>
                    <p key={item.id}>preço unitário: {item.unit_price}</p>
                    <p>cotas compradas: {item.quantity}</p>
                    <p>tipo de ordem: {item.order_type}</p>
                    <p>data da operação: {item.operation_date}</p>
                </div>
            )
        })} */}
        