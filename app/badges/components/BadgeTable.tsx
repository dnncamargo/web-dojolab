// app/badges/components/BadgeTable.tsx
"use client";

import { useState } from "react";
import { badge } from "../../utils/types";

export default function BadgeTable({
  badges,
  onRemove,
  onUpdate,
}: {
  badges: badge[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: Partial<badge>) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<badge>>({});

  const handleEdit = (badge: badge) => {
    setEditingId(badge.id);
    setEditData({ ...badge });
  };

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, editData);
      setEditingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Imagem</th>
            <th className="px-4 py-2 text-left">Descrição</th>
            <th className="px-4 py-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {badges.map((b) => (
            <tr
              key={b.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-2">
                {editingId === b.id ? (
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  b.name
                )}
              </td>

              <td className="px-4 py-2">
                {editingId === b.id ? (
                  <input
                    type="text"
                    value={editData.imageUrl || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, imageUrl: e.target.value })
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : b.imageUrl ? (
                  <img
                    src={b.imageUrl}
                    alt={b.name}
                    className="h-8 w-8 object-cover rounded"
                  />
                ) : (
                  "—"
                )}
              </td>

              <td className="px-4 py-2">
                {editingId === b.id ? (
                  <textarea
                    value={editData.description || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  b.description || "—"
                )}
              </td>

              <td className="px-4 py-2 flex gap-2 justify-end">
                {editingId === b.id ? (
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Salvar
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(b)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                )}

                <button
                  onClick={() => onRemove(b.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
          {badges.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                Nenhuma insígnia cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
