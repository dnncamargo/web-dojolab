// app/students/components/StudentForm.tsx
"use client";

import { useState } from "react";
import { classroom } from "../../utils/types";

type StudentFormProps = {
  onAdd: (name: string, classId: string) => void;
  classrooms: classroom[];
  loading: boolean;
};

export default function StudentForm({ onAdd, classrooms, loading }: StudentFormProps) {
  const [name, setName] = useState("");
  const [classroomId, setClassroomId] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !classroomId) return;
    onAdd(name, classroomId);
    setName("");
    setClassroomId("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-2"
    >
      <input
        className="border rounded px-3 py-2 flex-1 placeholder-black"
        placeholder="Nome do aluno"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <select
        className="border rounded px-3 py-2 flex-1"
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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Adicionar
      </button>
    </form>
  );
}
