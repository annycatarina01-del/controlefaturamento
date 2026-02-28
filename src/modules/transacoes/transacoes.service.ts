import { supabase } from "@/src/lib/supabase";
import { Transaction, TransactionFormData } from "./transacoes.types";

export const TransacoesService = {
  async getTransactions(month: string, year: string): Promise<Transaction[]> {
    const startDate = `${year}-${month}-01`;
    // Calculate the last day of the month
    const endDate = new Date(parseInt(year), parseInt(month), 0)
      .toISOString()
      .split("T")[0];

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addTransaction(data: TransactionFormData): Promise<Transaction> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Usuário não autenticado");

    const { data: result, error } = await supabase
      .from("transactions")
      .insert([{ ...data, user_id: userData.user.id }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) throw error;
  },
};
