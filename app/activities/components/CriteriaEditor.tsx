// app/components/CriteriaEditor.tsx
"use client";

import { criteria } from "@/app/utils/types";
import React from "react";

type CriteriaEditorProps = {
  criteria: criteria[];
  onChange: (c: criteria[]) => void;
};

export default function CriteriaEditor({ criteria, onChange }: CriteriaEditorProps) {
  // Normaliza um weight possivelmente indefinido -> número válido (1..5)
  const normalizeWeight = (w: unknown) => {
    const n = typeof w === "number" && !Number.isNaN(w) ? Math.floor(w) : NaN;
    if (Number.isFinite(n) && n >= 1 && n <= 5) return n;
    return 1;
  };

  const toggleEvaluation = (id: string) => {
    onChange(
      criteria.map((c) =>
        c.id === id ? { ...c, evaluationType: c.evaluationType === "integer" ? "boolean" : "integer" } : c
      )
    );
  };

  const toggleScoring = (id: string) => {
    onChange(
      criteria.map((c) =>
        c.id === id ? { ...c, scoringType: c.scoringType === "individual" ? "team" : "individual" } : c
      )
    );
  };

  const toggleWeight = (id: string) => {
    onChange(
      criteria.map((c) => {
        if (c.id !== id) return c;
        const current = normalizeWeight((c as any).weight as number); // garante número
        const next = current >= 5 ? 1 : current + 1;
        return { ...c, weight: next };
      })
    );
  };

  const handleRemove = (id: string) => {
    if (criteria.length <= 1) {
      alert("A atividade precisa ter pelo menos 1 critério.");
      return;
    }
    onChange(criteria.filter((c) => c.id !== id));
  };

  const addCriteria = () => {
    const newC: criteria = {
      id: crypto.randomUUID(),
      description: "",
      evaluationType: "integer",
      scoringType: "individual",
      weight: 1, // atenção: default obrigatório
      // observations?: undefined
    };
    onChange([...criteria, newC]);
  };

  const handleDescriptionChange = (id: string, value: string) => {
    onChange(criteria.map((c) => (c.id === id ? { ...c, description: value } : c)));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Critérios de Avaliação</label>

      {criteria.map((c) => {
        const weight = normalizeWeight((c as criteria).weight);
        return (
          <div key={c.id} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Nome do critério"
              value={c.description}
              onChange={(e) => handleDescriptionChange(c.id, e.target.value)}
              className="flex-1 border p-2 rounded-md"
            />

            <button
              type="button"
              onClick={() => toggleEvaluation(c.id)}
              className="px-2 py-1 bg-blue-200 rounded-md"
            >
              {c.evaluationType === "integer" ? "Inteiro" : "Booleano"}
            </button>

            <button
              type="button"
              onClick={() => toggleScoring(c.id)}
              className="px-2 py-1 bg-purple-200 rounded-md"
            >
              {c.scoringType === "individual" ? "Individual" : "Equipe"}
            </button>

            <button
              type="button"
              onClick={() => toggleWeight(c.id)}
              className="py-1 px-3 bg-yellow-200 rounded-md font-semibold text-center"
              title="Peso (clicar para aumentar 1..5)"
            >
              {weight}
            </button>

            <button
              type="button"
              onClick={() => handleRemove(c.id)}
              className="px-2 py-1 bg-red-300 rounded-md"
              title="Remover critério"
            >
              ✕
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addCriteria}
        className="mt-2 px-3 py-1 bg-green-200 rounded-md"
      >
        + Adicionar Critério
      </button>
    </div>
  );
}
