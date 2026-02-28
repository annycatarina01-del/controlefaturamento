import React, { useState } from "react";
import { TransactionFormData } from "../transacoes.types";

interface FormAddProps {
  onSubmit: (data: TransactionFormData) => Promise<void>;
}

export function FormAdd({ onSubmit }: FormAddProps) {
  const [type, setType] = useState<"compra" | "venda">("venda");
  const [description, setDescription] = useState("");
  const [amountDisplay, setAmountDisplay] = useState("");
  const [amountValue, setAmountValue] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setAmountDisplay("");
      setAmountValue(0);
      return;
    }
    const numericValue = parseInt(value, 10) / 100;
    setAmountValue(numericValue);
    setAmountDisplay(
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numericValue),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amountValue <= 0 || !date) return;

    setIsSubmitting(true);
    await onSubmit({
      type,
      description,
      amount: amountValue,
      date,
    });
    setIsSubmitting(false);
    setDescription("");
    setAmountDisplay("");
    setAmountValue(0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Nova Transação
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType("venda")}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              type === "venda"
                ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-200"
                : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
            }`}
          >
            Venda
          </button>
          <button
            type="button"
            onClick={() => setType("compra")}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              type === "compra"
                ? "bg-red-100 text-red-800 border-2 border-red-200"
                : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
            }`}
          >
            Compra
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <input
          type="text"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="Ex: Venda de produto X"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor (R$)
        </label>
        <input
          type="text"
          required
          value={amountDisplay}
          onChange={handleAmountChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="R$ 0,00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data
        </label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || amountValue <= 0}
        className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Salvando..." : "Adicionar"}
      </button>
    </form>
  );
}
