import React, { useEffect, useState } from "react";
import { TransacoesService } from "./transacoes.service";
import { Transaction, TransactionFormData } from "./transacoes.types";
import { Kpis } from "./components/Kpis";
import { FormAdd } from "./components/FormAdd";
import { List } from "./components/List";
import { Filters } from "./components/Filters";
import { Export } from "./components/Export";
import { User } from "../auth/auth.types";

interface TransacoesPageProps {
  user: User;
}

export function TransacoesPage({ user }: TransacoesPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const companyName = user.user_metadata?.empresa || "Minha Empresa";

  const currentDate = new Date();
  const [month, setMonth] = useState(
    String(currentDate.getMonth() + 1).padStart(2, "0"),
  );
  const [year, setYear] = useState(String(currentDate.getFullYear()));

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await TransacoesService.getTransactions(month, year);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar transações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [month, year]);

  const handleAdd = async (data: TransactionFormData) => {
    try {
      await TransacoesService.addTransaction(data);
      await loadTransactions();
    } catch (err: any) {
      alert(err.message || "Erro ao adicionar transação");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir?")) return;
    try {
      await TransacoesService.deleteTransaction(id);
      await loadTransactions();
    } catch (err: any) {
      alert(err.message || "Erro ao excluir transação");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Controle de Faturamento
          </h1>
          <p className="text-gray-500">
            {companyName} - Gerencie suas compras, vendas e visualize seu lucro.
          </p>
        </div>
        <Export
          transactions={transactions}
          month={month}
          year={year}
          companyName={companyName}
        />
      </header>

      <Filters
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

      <Kpis transactions={transactions} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <FormAdd onSubmit={handleAdd} />
        </div>
        <div className="lg:col-span-2">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Carregando...</div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
          ) : (
            <List transactions={transactions} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
}
