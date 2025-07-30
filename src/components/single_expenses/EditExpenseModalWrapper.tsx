"use client"

import { useState, useEffect } from "react";
import GenericFormModal from "@base/components/ui/custom/GenericFormModal";
import AddExpenseForm from "@base/components/expenses/AddExpenseForm";
import { useExpensesStore } from "@base/store/useSingleExpensesStore";
import type { Expense, Category, ExpenseFormData } from "@base/types/expenses";

type EditExpenseModalWrapperProps = {
    expenseToEdit: Expense | null;
    onClose: () => void;
};

export default function EditExpenseModalWrapper({
    expenseToEdit,
    onClose
}: EditExpenseModalWrapperProps){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updateExpense, categories } = useExpensesStore();

    const handleSubmit = async (formData: ExpenseFormData) => {
        if(!expenseToEdit) return;
        setIsSubmitting(true);
        try{
            await updateExpense(expenseToEdit.id, formData);
        } catch(error){
            throw error;
        } finally{
            setIsSubmitting(false);
        }
    };

    const isOpen = !!expenseToEdit;

    if(!isOpen)return null;
    return(
        <GenericFormModal
            open={isOpen}
            onOpenChange={(openState) => { if (!openState) onClose();}}
            title="[ EDITAR DESPESA ]"
            description="[ Modifique os detalhes da sua despesa ]"
            isSubmitting={isSubmitting}
            showFooter={false}
            useInternalForm={false}
        >
            <AddExpenseForm
                initialData={expenseToEdit}
                onSave={handleSubmit}
                onCancel={onClose}
                availableCategories={categories}
                submitButtonText="Salvar Alterações"
            />
        </GenericFormModal>
    )
}