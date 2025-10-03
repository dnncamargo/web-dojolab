// app/teams/components/TeamsForm.tsx
"use client";

import { useState } from "react";
import { classroom } from "../../utils/types";

type TeamsFormProps = {
  onAdd: (name: string, classroomId: string) => void;
  classrooms: classroom[];
  loading: boolean;
};

export default function TeamsForm({ onAdd, classrooms, loading }: TeamsFormProps) {
  const [teamName, setTeamName] = useState("");
  const [classroomId, setClassroomId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !classroomId) return;
    onAdd(teamName, classroomId);
    setTeamName("");
    setClassroomId("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-2"
    >
      <input
        className="border rounded-l-lg px-3 py-2 flex-1 placeholder-black"
        placeholder="Nome da equipe"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        required
      />
      <select
        className="bg-white border rounded-none px-3 py-2 flex-1"
        value={classroomId}
        onChange={e => setClassroomId(e.target.value)}
        required
      >
        <option value="">Selecione a turma</option>
        {loading ? (
          <option disabled>Carregando...</option>
        ) : (
          classrooms.map((cls: classroom) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))
        )}
      </select>
      <button
        type="submit"
        className="bg-green-600 text-white px-3 py-2 rounded-r-lg hover:bg-green-700"
      >
        Adicionar
      </button>
    </form>
  );
}
