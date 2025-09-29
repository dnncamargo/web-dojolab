"use client";

import { classroom } from "@/app/utils/types";

type ClassroomRowProps = {
  classroom: classroom;
  expanded: boolean;
  setEditingId: (id: string | null) => void;
  onToggleExpand: () => void;
  onRemove: (id: string) => void;
};

export default function ClassroomRow({ classroom, expanded, setEditingId, onToggleExpand, onRemove }: ClassroomRowProps) {
  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2">{classroom.name}</td>
      <td className="px-4 py-2 flex gap-2 justify-end">
        <button
          onClick={() => setEditingId(classroom.id)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Editar
        </button>
        <button
          onClick={onToggleExpand}
          className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
        >
          {expanded ? "Fechar" : "Ver Alunos"}
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
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
