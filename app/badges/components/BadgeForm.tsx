// app/badges/components/BadgeForm.tsx
"use client";

import { useState } from "react";
import { badge } from "../../utils/types";

type BadgeFormProps = {
  onAdd: (badge: Omit<badge, "id" | "createdAt">) => void;
}

export default function BadgeForm({ onAdd }: BadgeFormProps) {
  const [badgeName, setBadgeName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeName.trim()) return;

    // Para versão simples, usamos apenas URL local temporária
    // A URL é gerada aqui e passada para onAdd
    const imageUrl = file ? URL.createObjectURL(file) : "";

    onAdd({
      name: badgeName,
      imageUrl,
      description: "",
      isActive: true,
    });

    setBadgeName("");
    setFile(null);
  };

  // Calcula o URL de pré-visualização (temporário)
  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col md:flex-row"
    >
      <input
        type="text"
        placeholder="Nome da insígnia"
        value={badgeName}
        onChange={(e) => setBadgeName(e.target.value)}
        className="border rounded px-3 py-2 flex-1 m-1 placeholder-black"
        required
      />

      {/* Container para pré-visualização e input de arquivo */}
      <div className="flex items-center m-1">
        {previewUrl && (
          <img 
            src={previewUrl} 
            alt="Pré-visualização" 
            className="h-10 w-10 object-cover rounded" 
          />
        )}
        <label className="flex items-center m-1 cursor-pointer bg-gray-200 px-3 py-2 rounded hover:bg-gray-300">
          {file ? file.name : "Selecionar Arquivo"}
          <input type="file" accept="image/*" onChange={handleFile} hidden />
        </label>
      </div>

      <button
        type="submit"
        className="bg-yellow-600 text-white px-4 py-1 m-1 rounded hover:bg-yellow-700"
      >
        Adicionar
      </button>
    </form>
  );
}
