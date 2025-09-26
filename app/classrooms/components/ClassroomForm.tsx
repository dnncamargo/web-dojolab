"use client";

import { useState } from "react";

export default function ClassroomForm({ onAdd, onUpload }: {
  onAdd: (classroomName: string) => void;
  onUpload: (students: { name: string }[], classroomName: string) => void;
}) {
  const [classroomName, setClassroomName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classroomName) return;
    onAdd(classroomName);
    setClassroomName("");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

      // Cada linha do CSV vira um aluno
      const studentLine = lines.map((line) => {
        const [name] = line.split(","); // pode expandir p/ mais colunas
        return { name: name.trim() };
      });

      onUpload(studentLine, classroomName);
    };
    reader.readAsText(file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-2"
    >
      <input
        className="border rounded px-3 py-2 flex-1 placeholder-black"
        placeholder="Nome da turma"
        value={classroomName}
        onChange={(e) => setClassroomName(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
      >
        Adicionar
      </button>

      <label className="flex items-center gap-2 cursor-pointer bg-gray-200 px-3 py-2 rounded hover:bg-gray-300">
        Upload CSV
        <input type="file" accept=".csv" onChange={handleFile} hidden />
      </label>
    </form>
  );
}
