// app/students/components/StudentForm.tsx
"use client";


import { useState } from "react";
import { student, classroom } from "../../utils/types";

type StudentFormProps = {
  onAdd: (name: string, classId: string) => void;
  classes: classroom[];
  loading: boolean;
};

export default function StudentForm({ onAdd, classes, loading }: StudentFormProps) {
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !classId) return;
    onAdd(name, classId);
    setName("");
    setClassId("");
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
        value={classId}
        onChange={e => setClassId(e.target.value)}
        required
      >
        <option value="">Selecione a turma</option>
        {loading ? (
          <option disabled>Carregando...</option>
        ) : (
          classes.map((cls: any) => (
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
