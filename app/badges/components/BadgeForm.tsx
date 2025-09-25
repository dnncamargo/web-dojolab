// app/badges/components/BadgeForm.tsx
"use client";

import { useState } from "react";
import { badge } from "../../utils/types";

export default function BadgeForm({ onAdd }: { onAdd: (badge: Omit<badge, "id" | "createdAt">) => void }) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      imageUrl,
      description,
      active: true,
    });

    setName("");
    setImageUrl("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded-lg mb-6">
      <h2 className="text-lg font-bold mb-3">Adicionar Insígnia</h2>
      <input
        type="text"
        placeholder="Nome da insígnia"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-text"
      />
      <input
        type="text"
        placeholder="URL da imagem"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="input-text"
      />
      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input-text"
      />
      <button type="submit" className="btn-primary mt-3">
        Adicionar
      </button>
    </form>
  );
}
