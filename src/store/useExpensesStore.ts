import api from "@base/lib/api";
import toast from "react-hot-toast";
import type { Expense, Category } from "@base/types/expenses";
import { create } from "zustand";

type ExpenseFilters = {
    due_date__year?: number | string;
    due_date__month?: number | string;
    search?: string;
}

export type ExpensesState = {
    expenses: Expense[];
    categories: Category[];
    loading: boolean;
    error: string | null;
    fetchExpenses: (filters?: ExpenseFilters) => Promise<void>;
    fetchCategories: () => Promise<void>;
    addExpense: (expenseData: Omit<Expense, 'id'>) => Promise<void>;
    deleteExpense: (expenseId: number) => Promise<void>;
    addCategory: (categoryData: Omit<Category, 'id'>) => Promise<void>;
    markAsPaid: (expenseId: number) => Promise<void>;
}

export const useExpensesStore = create<ExpensesState>((set, get) => ({
    expenses: [],
    categories: [],
    loading: false,
    error: null,

    fetchExpenses: async (filters = {}) => {
        set({ error: null, loading: true });
        try {
            const response = await api.get<Expense[]>('/expenses/', {
                params: filters
            });
            set({ expenses: response.data, loading: false });
        } catch (error) {
            const errorMessage = 'Não foi possível carregar as despesas';
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
        }
    },

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

    addExpense: async (expenseData) => {
        const dataToApi = {
            name: expenseData.name,
            amount: expenseData.amount,
            due_date: expenseData.due_date,
            payment_date: expenseData.payment_date,
            paid: expenseData.paid,
            category_id: expenseData.category ? expenseData.category.id : null
        };

        const promise = api.post('/expenses/', dataToApi);
        await toast.promise(promise, {
            loading: 'Registrando Despesa...',
            success: 'Despesa Registrada com Sucesso!',
            error: 'Não foi possível registrar a Despesa'
        });
        await get().fetchExpenses();
    },
    deleteExpense: async (expenseId) => {
        const promise = api.delete(`/expenses/${expenseId}/`)
        await toast.promise(promise, {
            loading: 'Deletando Despesa...',
            success: 'Despesa Deletada com Sucesso!',
            error: 'Não foi possível Deletar a Despesa'
        });
        set(state => ({
            expenses: state.expenses.filter(expense => expense.id !== expenseId)
        }))
    },
    markAsPaid: async (expenseId) => {
        const promise = api.patch(`/expenses/${expenseId}/`, {
            paid: true
        })
        await toast.promise(promise, {
            loading: 'Atualizando Despesa',
            success: 'Despesa Marcada como Paga',
            error: 'Não foi possivel marcar a Despesa como Paga'
        });
        await get().fetchExpenses();
    }
}));


