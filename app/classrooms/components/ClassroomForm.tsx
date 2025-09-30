"use client";

import { useState } from "react";

// Função utilitária para capitalizar o nome
const capitalizeName = (name: string): string => {
  return name.toLowerCase().split(' ').map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

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
      const studentLines = lines.map((line) => {
        const [name] = line.split(","); // Apenas a primeira coluna é considerada
        // 3. Aplica a capitalização
        return { name: capitalizeName(name.trim()) };
      });

      // 2. O nome da turma é o que está no input no momento do upload.
      // A lógica para checar se a turma já existe ou criar uma nova deve ser no onUpload (ou no hook).
      onUpload(studentLines, classroomName);

      // Limpa o nome da turma e o input de arquivo após o upload
      setClassroomName("");
      // Resetar o input type="file" exige manipulá-lo diretamente ou re-renderizar, 
      // mas para este exemplo, apenas limpamos o nome da turma.
      e.target.value = '';
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
    </form>
  );
}
