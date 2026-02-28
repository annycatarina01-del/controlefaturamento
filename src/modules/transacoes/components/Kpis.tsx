import React from "react";
import { Transaction } from "../transacoes.types";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface KpisProps {
  transactions: Transaction[];
}

export function Kpis({ transactions }: KpisProps) {
  const totalVendas = transactions
    .filter((t) => t.type === "venda")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalCompras = transactions
    .filter((t) => t.type === "compra")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const lucro = totalVendas - totalCompras;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-500 font-medium">Total de Vendas</h3>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp size={20} />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 mt-4">
          {formatCurrency(totalVendas)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-500 font-medium">Total de Compras</h3>
          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
            <TrendingDown size={20} />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 mt-4">
          {formatCurrency(totalCompras)}
        </p>
      </div>

      <div className="bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-400 font-medium">Lucro Total</h3>
          <div className="p-2 bg-gray-800 text-white rounded-lg">
            <DollarSign size={20} />
          </div>
        </div>
        <p
          className={`text-2xl font-bold mt-4 ${lucro >= 0 ? "text-emerald-400" : "text-red-400"}`}
        >
          {formatCurrency(lucro)}
        </p>
      </div>
    </div>
  );
}
