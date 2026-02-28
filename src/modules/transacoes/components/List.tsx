import React from "react";
import { Transaction } from "../transacoes.types";
import { Trash2 } from "lucide-react";

interface ListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function List({ transactions, onDelete }: ListProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">Nenhuma transação registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
              <th className="py-3 px-4">Data</th>
              <th className="py-3 px-4">Descrição</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4 text-right">Valor</th>
              <th className="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-600">
                  {formatDate(t.date)}
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                  {t.description}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      t.type === "venda"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.type === "venda" ? "Venda" : "Compra"}
                  </span>
                </td>
                <td
                  className={`py-3 px-4 text-sm font-medium text-right ${
                    t.type === "venda" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {t.type === "venda" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
