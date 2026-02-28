import React from "react";

interface FiltersProps {
  month: string;
  year: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
}

export function Filters({
  month,
  year,
  onMonthChange,
  onYearChange,
}: FiltersProps) {
  const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) =>
    (currentYear - i).toString(),
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Mês:
        </label>
        <select
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Ano:
        </label>
        <select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
