// app/components/TableControls.tsx
"use client";

import { useState } from "react";
import { ArrowDownAZ, Filter } from "lucide-react";

type SortOption = { value: string; label: string };
type FilterOption = { value: string; label: string };

type TableControlsProps = {
  sortOptions: SortOption[];
  filterOptions: FilterOption[];
  onSortChange: (field: string) => void;
  onFilterChange: (field: string) => void;
};

export default function TableControls({
  sortOptions,
  filterOptions,
  onSortChange,
  onFilterChange,
}: TableControlsProps) {
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="flex gap-2 items-center">
      {/* Botão Ordenar */}
      <button
        onClick={() => {
          setShowSort((s) => !s);
          setShowFilter(false);
        }}
        className={`p-2 rounded transition ${
          showSort ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"
        }`}
        title="Ordenar"
      >
        <ArrowDownAZ className="w-5 h-5" />
      </button>

      {/* Painel de ordenação */}
      {showSort && (
        <div className="absolute mt-12 bg-white shadow-md rounded p-3 z-10">
          <p className="font-semibold mb-2">Ordenar por:</p>
          <select
            onChange={(e) => onSortChange(e.target.value)}
            className="border rounded p-2 w-full"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Botão Filtrar */}
      <button
        onClick={() => {
          setShowFilter((f) => !f);
          setShowSort(false);
        }}
        className={`p-2 rounded transition ${
          showFilter ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"
        }`}
        title="Filtrar"
      >
        <Filter className="w-5 h-5" />
      </button>

      {/* Painel de filtro */}
      {showFilter && (
        <div className="absolute mt-12 bg-white shadow-md rounded p-3 z-10">
          <p className="font-semibold mb-2">Filtrar por:</p>
          <select
            onChange={(e) => onFilterChange(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Todos</option>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
