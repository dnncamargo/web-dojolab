// app/badges/components/BadgeForm.tsx
"use client";

import { useState } from "react";
import { badge } from "../../utils/types";

export default function BadgeForm({
  onAdd,
}: {
  onAdd: (badge: Omit<badge, "id" | "createdAt">) => void;
}) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Para versão simples, usamos apenas URL local temporária
    const imageUrl = file ? URL.createObjectURL(file) : "";

    onAdd({
      name,
      imageUrl,
      description: "",
      active: true,
    });

    setName("");
    setFile(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-2"
    >
      <input
        type="text"
        placeholder="Nome da insígnia"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded px-3 py-2 flex-1 placeholder-black"
        required
      />

      <label className="flex items-center gap-2 cursor-pointer bg-gray-200 px-3 py-2 rounded hover:bg-gray-300">
        Selecionar Arquivo
        <input type="file" accept="image/*" onChange={handleFile} hidden />
      </label>

      <button
        type="submit"
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
      >
        Adicionar
      </button>
    </form>
  );
}
