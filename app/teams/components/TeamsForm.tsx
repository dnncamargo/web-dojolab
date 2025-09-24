// app/teams/components/TeamsForm.tsx
"use client";

import { team } from "@/app/utils/types";
import { useState } from "react";

type TeamsFormProps = {
  onAdd: (name: string) => void;
};

export default function TeamsForm({ onAdd }: TeamsFormProps) {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;
    onAdd(teamName);
    setTeamName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-2"
    >
      <input
        className="border rounded px-3 py-2 flex-1 placeholder-black"
        placeholder="Nome da equipe"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Adicionar
      </button>
    </form>
  );
}
