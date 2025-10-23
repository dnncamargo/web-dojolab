"use client";

import { criteria } from "@/app/utils/types";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type CriteriaEditorProps = {
  criteria: criteria[];
  onChange: (c: criteria[]) => void;
};

export default function CriteriaEditor({ criteria, onChange }: CriteriaEditorProps) {
  const [newCriteria, setNewCriteria] = useState("");

  const normalizeWeight = (w: unknown) => {
    const n = typeof w === "number" && !Number.isNaN(w) ? Math.floor(w) : NaN;
    if (Number.isFinite(n) && n >= 1 && n <= 5) return n;
    return 1;
  };

  const addCriteria = () => {
    if (!newCriteria.trim()) {
      alert("A descrição do critério não pode estar vazia.");
      return;
    }

    const newC: criteria = {
      id: uuidv4(),
      description: newCriteria.trim(),
      evaluationType: "integer",
      scoringType: "individual",
      weight: 1,
    };

    onChange([...criteria, newC]);
    setNewCriteria("");
  };

  const updateDescription = (id: string, desc: string) => {
    onChange(criteria.map((c) => (c.id === id ? { ...c, description: desc } : c)));
  };

  const removeCriteria = (id: string) => {
    if (criteria.length <= 1) {
      alert("A atividade precisa ter pelo menos 1 critério.");
      return;
    }
    onChange(criteria.filter((c) => c.id !== id));
  };

  const toggleEvaluation = (id: string) => {
    onChange(
      criteria.map((c) =>
        c.id === id
          ? { ...c, evaluationType: c.evaluationType === "integer" ? "boolean" : "integer" }
          : c
      )
    );
  };

  const toggleScoring = (id: string) => {
    onChange(
      criteria.map((c) =>
        c.id === id
          ? { ...c, scoringType: c.scoringType === "individual" ? "team" : "individual" }
          : c
      )
    );
  };

  const toggleWeight = (id: string) => {
    onChange(
      criteria.map((c) => {
        if (c.id !== id) return c;
        const current = normalizeWeight(c.weight);
        const next = current >= 5 ? 1 : current + 1;
        return { ...c, weight: next };
      })
    );
  };

  return (
    <div className="bg-white border rounded-md p-4 mt-4">
      <h3 className="mb-3">Critérios Avaliativos</h3>

      {/* Campo para adicionar novo critério */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCriteria}
          onChange={(e) => setNewCriteria(e.target.value)}
          placeholder="Descrição do critério, tipo de pontuação, tipo de avaliação e peso ..."
          className="border rounded-l-lg p-2 flex-1"
        />
        <button
          onClick={addCriteria}
          className="bg-green-600 text-white px-3 py-2 rounded-r-lg hover:bg-green-700"
        >
          Adicionar
        </button>
      </div>

      {/* Lista de critérios */}
      <ul className="space-y-2">
        {criteria.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between border-b pb-1"
          >
            <input
              type="text"
              value={c.description}
              onChange={(e) => updateDescription(c.id, e.target.value)}
              className="flex-1 p-1 border-none focus:outline-none bg-transparent"
            />

            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={() => toggleEvaluation(c.id)}
                className="px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded-md text-sm"
              >
                {c.evaluationType === "integer" ? "Inteiro" : "Booleano"}
              </button>

              <button
                onClick={() => toggleScoring(c.id)}
                className="px-2 py-1 bg-purple-100 hover:bg-purple-200 rounded-md text-sm"
              >
                {c.scoringType === "individual" ? "Individual" : "Equipe"}
              </button>

              <button
                onClick={() => toggleWeight(c.id)}
                className="px-2 py-1 bg-yellow-100 hover:bg-yellow-200 rounded-md text-sm font-semibold"
              >
                {normalizeWeight(c.weight)}
              </button>

              <button
                onClick={() => removeCriteria(c.id)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
