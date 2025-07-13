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

type Props = {
    data: CardInvestimentMonth
}

export function InvestimentCard({ data }: Props) {
    const nameMonth = new Date(data.year, data.month - 1).toLocaleString('pt-BR', { month: 'long'})
    return(
        <div className="flex items-center h-screen justify-center">
            {data.itens.map((item) => {
                return(
                    <div>
                        <p>ativo da operação: {item.asset.code} - {item.asset.type}</p>
                        <p key={item.id}>preço unitário: {item.unit_price}</p>
                        <p>cotas compradas: {item.quantity}</p>
                        <p>tipo de ordem: {item.order_type}</p>
                        <p>data da operação: {item.operation_date}</p>
                    </div>
                )
            })}
        </div>
    )
}