import api from '@base/lib/api'
import { create } from 'zustand'
import { ItemInvestiment, CardInvestimentMonth, NewInvestimentMonthData } from '@base/types/investiments'
import { toast } from 'react-hot-toast'

type InvestimentsState = {
    cards: CardInvestimentMonth[]
    loading: boolean;
    error: null | string;
    fetchInvestiments: () => Promise<void>;
    addInvestiments: (cardId: number, newInvestiment: Omit<ItemInvestiment, 'id'>) => Promise<void>;
    addMonthCard: (data: NewInvestimentMonthData) => Promise<void>
}

export const useInvestimentStore = create<InvestimentsState>((set, get) => ({
    cards: [],
    loading: false,
    error: null,
    fetchInvestiments: async () => {
        set({ loading: true, error: null})
        try{
            const response = await api.get('cards-investiments/')
            set({
                cards: response.data,
                loading: false
            })
        } catch (error){
            const errorMessage = 'não foi possivel carregar os investimentos'
            set({ error: errorMessage, loading: false})
            toast.error(errorMessage)
        }
    },
    addInvestiments: async (cardId, NewInvestiment) => {
        const dataParaApi = {
            asset_id: NewInvestiment.asset.id,
            order_type: NewInvestiment.order_type,
            quantity: NewInvestiment.quantity,
            unit_price: NewInvestiment.unit_price,
            operation_date: NewInvestiment.operation_date,
            card: cardId

        }
        const promise = api.post('itens-investiments', dataParaApi)
        await toast.promise(promise, {
            loading: 'Adicionando Investimento..',
            success: 'Investimento Adicionado com Sucesso',
            error: 'Falha ao Adicionar Investimento'
        });
        await get().fetchInvestiments();
    },
    addMonthCard: async (data) => {
        const { month, year} = data;
        const { cards } = get();
        const mesExiste = cards.some(card => card.month === month && card.year === year)
        if (mesExiste){
            toast.error('este mês já está registrado');
            throw new Error('mês já registrado')
        }
        const promise = api.post('cards-investiments/', {month, year})
        await toast.promise(promise, {
            loading: 'criando registro de mês..',
            success: 'novo mês de referência adicionado',
            error: (err: any) => err.response?.data?.detail || 'erro ao adicionar registro de mês'
        })
        await get().fetchInvestiments();
    }
}))


