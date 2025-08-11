import api from "@base/lib/api";
import toast from "react-hot-toast";
import { InstallmentExpense, NewInstallmentExpenseData } from "@base/types/expenses";
import { create } from 'zustand';

type InstallmentsExpenseState = {
    installmentsExpenses: InstallmentExpense[];
    loading: boolean;
    error: string | null;
    fetchInstallmentsExpenses: () => Promise<void>;
}
export const useInstallmentsExpenseStore = create<InstallmentsExpenseState>((set, get) => ({
    loading: false,
    error: null,
    installmentsExpenses: [],
    fetchInstallmentsExpenses: async () => {
        set({ error: null, loading: true });
        try{
            const response = await api.get<InstallmentExpense[]>('/installments/');
            set({ installmentsExpenses: response.data, loading: false });
        } catch (error){
            const errorMessage = 'não foi possivel carregar as despesas parceladas';
            set({ error: errorMessage});
            toast.error(errorMessage);
        }
    }
}))