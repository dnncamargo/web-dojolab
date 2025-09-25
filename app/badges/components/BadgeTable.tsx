// app/badges/components/BadgeTable.tsx
"use client";

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
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Imagem</th>
            <th className="px-4 py-2 text-left">Descrição</th>
            <th className="px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {badges.map((badge) => (
            <tr key={badge.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2">{badge.name}</td>
              <td className="px-4 py-2">
                {badge.imageUrl ? (
                  <img src={badge.imageUrl} alt={badge.name} className="h-8 w-8 object-cover rounded" />
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-2">{badge.description}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => onRemove(badge.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remover
                </button>
                {/* Botão de editar simples */}
                <button
                  onClick={() =>
                    onUpdate(badge.id, { active: !badge.active })
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  {badge.active ? "Desativar" : "Ativar"}
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
