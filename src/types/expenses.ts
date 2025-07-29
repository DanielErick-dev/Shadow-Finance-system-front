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

export type NewExpenseData = {
    name: string;
    amount: number | string;
    due_date: string;
    paid: boolean;
    payment_date: string | null;
    category_id: number | null;
}

export type NewCategoryData = {
    name: string;
}