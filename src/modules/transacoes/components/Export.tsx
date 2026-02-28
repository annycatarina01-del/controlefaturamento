import React, { useState } from "react";
import { Download, Calendar, X } from "lucide-react";
import { Transaction } from "../transacoes.types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportProps {
  transactions: Transaction[];
  month: string;
  year: string;
  companyName: string;
}

export function Export({
  transactions,
  month,
  year,
  companyName,
}: ExportProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleExportPDF = (filteredTxs?: Transaction[]) => {
    const dataToExport = filteredTxs || transactions;
    const doc = new jsPDF();

    const formatCurrency = (value: number) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);

    const formatDate = (dateString: string) => {
      const [y, m, d] = dateString.split("-");
      return `${d}/${m}/${y}`;
    };

    const totalVendas = dataToExport
      .filter((t) => t.type === "venda")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalCompras = dataToExport
      .filter((t) => t.type === "compra")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const lucro = totalVendas - totalCompras;

    // Header
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(companyName, 14, 12);
    doc.text(new Date().toLocaleDateString("pt-BR"), 196, 12, { align: "right" });

    doc.setFontSize(18);
    doc.setTextColor(0);
    const title =
      startDate && endDate
        ? `Relatório: ${formatDate(startDate)} a ${formatDate(endDate)}`
        : `Relatório de Compras e Vendas - ${month}/${year}`;

    doc.text(title, 14, 25);

    doc.setFontSize(12);
    doc.text(`Total de Vendas: ${formatCurrency(totalVendas)}`, 14, 35);
    doc.text(`Total de Compras: ${formatCurrency(totalCompras)}`, 14, 43);
    doc.text(`Lucro Total: ${formatCurrency(lucro)}`, 14, 51);

    const tableData = dataToExport.map((t) => [
      formatDate(t.date),
      t.description,
      t.type === "venda" ? "Venda" : "Compra",
      formatCurrency(t.amount),
    ]);

    autoTable(doc, {
      startY: 56,
      head: [["Data", "Descrição", "Tipo", "Valor"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [31, 41, 55] }, // gray-800
    });

    const fileName =
      startDate && endDate
        ? `relatorio-${startDate}-a-${endDate}.pdf`
        : `relatorio-transacoes-${month}-${year}.pdf`;

    doc.save(fileName);
    setShowOptions(false);
  };

  const handleCustomExport = () => {
    if (!startDate || !endDate) {
      alert("Selecione as datas inicial e final.");
      return;
    }

    const filtered = transactions.filter(
      (t) => t.date >= startDate && t.date <= endDate,
    );

    if (filtered.length === 0) {
      alert("Nenhuma transação encontrada no período selecionado.");
      return;
    }

    handleExportPDF(filtered);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={transactions.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={18} />
        Exportar PDF
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Opções de Exportação
            </h3>
            <button
              onClick={() => setShowOptions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleExportPDF()}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors flex items-center gap-2"
            >
              <Calendar size={14} />
              Exportar mês atual ({month}/{year})
            </button>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Ou filtrar por período
              </p>
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  onClick={handleCustomExport}
                  className="w-full mt-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors"
                >
                  Exportar Período
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
