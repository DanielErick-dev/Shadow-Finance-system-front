import api from "@base/lib/api";
import { create } from 'zustand';
import type { DividendoMes, ItemDividendo } from '@base/types/dividends'
import toast from "react-hot-toast";

type newCardData = {
    mes: number;
    ano: number;
}
type DividendFilters = {
    ano?: number | string;
    mes?: number | string;
}
type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
export type DividendsState = {
    cards: DividendoMes[];
    count: number;
    loading: boolean;
    error: string | null;
    fetchDividends: (filters?: DividendFilters, page?: number) => Promise<void>;
    addDividend: (cardId: number, newItemData: Omit<ItemDividendo, 'id'>) => Promise<void>;
    updateDividend: (itemId: number, updatedItemData: Omit<ItemDividendo, 'id'>) => Promise<void>;
    deleteDividend: (itemId: number) => Promise<void>;
    addMonthCard: (data: newCardData) => Promise<void>;
    deleteCard: (cardId: number) => Promise<void>;
}

export const useDividendStore = create<DividendsState>((set, get) => ({
    cards: [],
    count: 0,
    loading: false,
    error: null,

    fetchDividends: async (filters = {}, page = 1) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get<PaginatedResponse<DividendoMes>>('/cards-dividendos/', {
                params: { ...filters, page }
            });

            set({ 
                cards: response.data.results,
                count: response.data.count,
                loading: false 
            });
        } catch (error) {
            console.error('Falha ao carregar os cards de dividendos: ', error);
            const errorMessage = 'Não foi possível carregar os dados dos dividendos.';
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
        }
    },
    addDividend: async (cardId, newItemData) => {
        const dataParaApi = {
            valor: newItemData.valor,
            data: newItemData.data,
            ativo_id: newItemData.ativo.id,
            card_mes: cardId
        };
        const promise = api.post('/itens-dividendos/', dataParaApi);
        await toast.promise(promise, {
            loading: 'Adicionando dividendo...',
            success: 'Dividendo adicionado com sucesso!',
            error: 'Falha ao adicionar dividendo.',
        });
        await get().fetchDividends(); 
    },

    updateDividend: async (itemId, updatedItemData) => {
        const dataParaApi = {
            valor: updatedItemData.valor,
            data_recebimento: updatedItemData.data,
            ativo_id: updatedItemData.ativo.id,
        };
        const promise = api.patch(`/itens-dividendos/${itemId}/`, dataParaApi);
        await toast.promise(promise, {
            loading: 'Atualizando registro...',
            success: 'Dividendo atualizado com sucesso!',
            error: 'Falha ao atualizar registro.',
        });
        await get().fetchDividends();
    },

    deleteDividend: async (itemId) => {
        const promise = api.delete(`/itens-dividendos/${itemId}/`);
        await toast.promise(promise, {
            loading: 'Excluindo dividendo...',
            success: 'Dividendo excluído com sucesso.',
            error: 'Falha ao excluir dividendo.',
        });
        set(state => ({
            cards: state.cards.map(card => ({
                ...card,
                itens: card.itens.filter(item => item.id !== itemId)
            })),
            count: state.count - 1 
        }));
        await get().fetchDividends(); 
    },

    addMonthCard: async (data) => {
        const { mes, ano } = data;
        const { cards } = get();
        const mesExiste = cards.some(card => card.mes === mes && card.ano === ano);
        if (mesExiste) {
            toast.error('Este mês já está registrado.');
            throw new Error('Mês já registrado');
        }
        const promise = api.post('/cards-dividendos/', { mes, ano });
        await toast.promise(promise, {
            loading: 'Criando registro do mês...',
            success: 'Novo mês de referência criado!',
            error: (err: any) => err.response?.data?.detail || 'Não foi possível criar o registro.',
        });
        await get().fetchDividends(); 
    },

    deleteCard: async (cardId) => {
        const promise = api.delete(`/cards-dividendos/${cardId}/`);
        await toast.promise(promise, {
            loading: 'Excluindo mês e todos os registros...',
            success: 'Mês excluído com sucesso.',
            error: 'Falha ao excluir o mês.',
        });
        await get().fetchDividends(); 
    }
}));
