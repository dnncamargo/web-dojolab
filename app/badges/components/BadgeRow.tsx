"use client";

import { badge } from "@/app/utils/types";

type BadgeRowProps = {
    badge: badge;
    expanded: boolean;
    setEditingId: (id: string | null) => void;
    onToggleExpand: () => void;
    onRemove: (id: string) => void;
    isTableEditing: boolean; 
};

export default function BadgeRow({ badge, expanded, setEditingId, onToggleExpand, onRemove, isTableEditing  }: BadgeRowProps) {

    // Lógica de estilo condicional para inativo
    const isInactive = badge.isActive === false;
    const textClass = isInactive ? "text-gray-500" : "text-gray-900";
    return (
        <tr className={`border-t border-gray-200 hover:bg-gray-50 ${isInactive ? "bg-gray-100" : ""}`}>
            <td className={`px-4 py-2 ${textClass}`}>{badge.name}</td>

            <td className="px-4 py-2">
                {badge.imageUrl ? (
                    <img
                        src={badge.imageUrl}
                        alt={badge.name}
                        className="h-8 w-8 object-cover rounded"
                    />
                ) : (
                    "—"
                )}
            </td>
            <td className="px-4 py-2">
                {badge.description || "—"}
            </td>
            {isTableEditing && <td className="px-4 py-2"></td>}
            <td className="px-4 py-2 flex gap-2 justify-end">
                <button
                    onClick={() => setEditingId(badge.id)}
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                >
                    Editar
                </button>
                <button
                    onClick={onToggleExpand}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                    {expanded ? "Fechar" : "Ver Alunos"}
                </button>
                <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => {
                        // Exibe um alerta de confirmação
                        if (window.confirm("Tem certeza que deseja remover esta insígnia?")) {
                            onRemove(badge.id);
                        }
                    }}
                >
                    Remover
                </button>
            </td>

        </tr>

    )
}