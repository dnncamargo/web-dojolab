"use client";

import { classroom } from "@/app/utils/types";

type ClassroomRowProps = {
  classroom: classroom;
  expanded: boolean;
  setEditingId: (id: string | null) => void;
  onToggleExpand: () => void;
  onRemove: (id: string) => void;
  colSpan: number;
};

export default function ClassroomRow({ classroom, expanded, setEditingId, onToggleExpand, onRemove }: ClassroomRowProps) {

  // Lógica de estilo condicional para inativo
  const isInactive = classroom.isActive === false;
  const textClass = isInactive ? "text-gray-500" : "text-gray-900";

  return (
    <tr className={`border-t border-gray-200 hover:bg-gray-50 ${isInactive ? "bg-gray-100" : ""}`}>
      <td className={`px-4 py-2 ${textClass}`}>{classroom.name}</td>

      {/* CORREÇÃO: Coluna 2: Ativo (Célula vazia, corresponde a w-20) */}
      <td className="px-4 py-2">
        {/* Conteúdo vazio para manter a largura da coluna 'Ativo' */}
      </td>
      
      <td className="px-4 py-2 flex gap-2 justify-end " colSpan={2}>
        <button
          onClick={() => setEditingId(classroom.id)}
          className="bg-blue-500 m-1 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Editar
        </button>
        <button
          onClick={onToggleExpand}
          className="bg-pink-500 m-1 text-white px-3 py-1 rounded hover:bg-pink-600"
        >
          {expanded ? "Fechar" : "Ver Alunos"}
        </button>
        <button
          className="px-3 py-1 m-1 bg-red-500 text-white rounded"
          onClick={() => {
            // Exibe um alerta de confirmação
            if (window.confirm("Tem certeza que deseja remover esta classe?")) {
              onRemove(classroom.id);
            }
          }}
        >
          Remover
        </button>
      </td>
    </tr>
  );
}
