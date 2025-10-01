"use client";

import { useState } from "react";
import { parseStudentsCsv } from "@/app/utils/parseCsv";

type ClassroomFormProps = {
  onAdd: (classroomName: string) => Promise<void>;
  onUpload: (students: { name: string }[], classroomName: string) => Promise<void>;
}

export default function ClassroomForm({ onAdd, onUpload }: ClassroomFormProps) {
  const [classroomName, setClassroomName] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classroomName.trim()) return;
    try {
      await onAdd(classroomName);
      setClassroomName("");
    } catch (err) {
      console.error("Erro ao adicionar turma:", err);
      alert("Erro ao adicionar turma.");
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const students = await parseStudentsCsv(file);
      await onUpload(students, classroomName); // hook já decide criar/usar turma

      // Limpa
      setClassroomName("");
      e.target.value = "";
    } catch (err) {
      console.error("Erro ao processar CSV:", err);
      alert("Não foi possível importar os alunos. Verifique o arquivo.");
    }
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

      {/* Botão para Upload de CSV */}
      <label className="flex items-center gap-2 cursor-pointer bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">
        Importar Alunos (CSV)
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="hidden"
          // O input de nome da turma é opcional para o upload de CSV
          // mas é usado para nomear a turma.
          disabled={!classroomName.trim()}
        />
      </label>
      <button
        type="submit"
        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
      >
        Adicionar
      </button>


    </form>
  );
}
