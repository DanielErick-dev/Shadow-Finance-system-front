import type { Ativo } from '@base/types/dividends'
import { create } from 'zustand'
import api from '@base/lib/api'
import toast from 'react-hot-toast'

export type NewAtivoData = {
    codigo: string;
    tipo: string;
}

export type AtivosState = {
    ativos: Ativo[];
    loading: boolean;
    error: null | string;
    fetchAtivos: () => Promise <void>;
    addAtivo: (data: NewAtivoData) => Promise<void>;
    updateAtivo: (id: number, data: NewAtivoData) => Promise<void>; 
    deleteAtivo: (id: number) => Promise<void>;
}

export const useAtivosStore = create<AtivosState>((set, get) => ({
    ativos: [],
    loading: false,
    error: null,
    fetchAtivos: async () => {
        set({ loading: true, error: null})
        try {
            const response = await api.get('/ativos/')
            set({ ativos: response.data, loading: false})
        } catch (error) {
            const errorMessage = 'Não foi possível carregar a lista de ativos.';
            console.error('Ocorreu um erro ao buscar ativos:', error)
            set({ error: errorMessage, loading: false})
            toast.error(errorMessage);
        }
    },

    addAtivo: async (data) => {
        const promise = api.post('/ativos/', data);

        await toast.promise(promise, {
            loading: 'Registrando novo ativo...',
            success: 'Ativo registrado com sucesso!',
            error: (err: any) => err.response?.data?.codigo?.[0] || 'Falha ao registrar ativo. Verifique se ele já existe',
        });

        
        await get().fetchAtivos();
    },

    updateAtivo: async (id, data) => {
        const promise = api.patch(`/ativos/${id}/`, data);

        await toast.promise(promise, {
            loading: 'Salvando alterações...',
            success: 'Ativo atualizado com sucesso!',
            error: 'Não foi possível salvar as alterações. Verifique informações duplicadas',
        });

        await get().fetchAtivos();
    },

    deleteAtivo: async (id) => {
        const promise = api.delete(`/ativos/${id}/`);

        await toast.promise(promise, {
            loading: 'Excluindo ativo...',
            success: 'Ativo excluído com sucesso.',
            error: 'Falha ao excluir o ativo.',
        });

        set(state => ({
            ativos: state.ativos.filter(ativo => ativo.id !== id)
        }));
    }
}));