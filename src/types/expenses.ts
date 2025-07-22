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