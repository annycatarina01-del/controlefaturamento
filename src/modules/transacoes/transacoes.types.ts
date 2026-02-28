export type TransactionType = "compra" | "venda";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface TransactionFormData {
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
}
