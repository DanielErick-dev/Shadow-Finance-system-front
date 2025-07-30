import api from "@base/lib/api";
import type { Category, NewCategoryData } from "@base/types/expenses";
import { create } from "zustand";
import toast from "react-hot-toast";

export type CategoryState = {
    categories: Category[];
    error: string | null;
    loading: boolean;
    fetchCategories: () => Promise<void>;
    addCategory: (CategoryData: NewCategoryData) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    loading: false,
    error: null,
    categories: [],
    fetchCategories: async () => {
        try {
            const response = await api.get<Category[]>('/categories/');
            set({ categories: response.data });
        } catch (error) {
            const errorMessage = 'Não foi possível carregar as categorias';
            set({ error: errorMessage });
            toast.error(errorMessage);
        }
    },
    addCategory: async (categoryData) => {
        const promise = api.post('/categories/', categoryData); 
        await toast.promise(promise, {
            loading: 'Criando Nova Categoria...',
            success: 'Categoria Criada com Sucesso!',
            error: (err: any) => err.response?.data?.name?.[0] || 'Falha ao criar Categoria'
        });
        await get().fetchCategories();
    },
}))


