export type Category = {
    id: number;
    name: string;
}

export type Expense = {
    id: number;
    name: string;
    amount: string;
    due_date: string;
    payment_date: string | null;
    category: Category | null;
    paid: boolean;
}

export type ExpenseFormData = {
    name: string;
    amount: string;
    due_date: string;
    paid: boolean;
    payment_date: string | null;
    category_id: number | null;
}

export type NewCategoryData = {
    name: string;
}

export type InstallmentExpense = {
    id: number;
    name: string;
    total_amount: string;
    installments_quantity: number;
    first_due_date: string;
    category: Category | null;
}

export type NewInstallmentExpenseData = {
    name: string;
    total_amount: number;
    installments_quantity: number;
    first_due_date: string;
    category_id: number | null;
}