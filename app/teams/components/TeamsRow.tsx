"use client";

import { team } from "@/app/utils/types";

type TeamsRowProps = {
  team: team;
  classrooms: { id: string; name: string }[];
  expanded: boolean;
  setEditingId: (id: string | null) => void;
  onToggleExpand: () => void;
  onRemove: (id: string) => void;
};

export default function TeamsRow({ team, classrooms, expanded, setEditingId, onToggleExpand, onRemove }: TeamsRowProps) {
  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2">
        {team.name}
      </td>
      <td className="px-4 py-2">
        {classrooms.find((c) => c.id === team.classroomId)?.name || "—"}
      </td>
      <td className="px-4 py-2 flex gap-2 justify-end">
        <button
          onClick={() => setEditingId(team.id)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Editar
        </button>
        <button
          onClick={onToggleExpand}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          {expanded ? "Fechar" : "Ver Alunos"}
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={() => {
            // Exibe um alerta de confirmação
            if (window.confirm("Tem certeza que deseja remover esta equipe?")) {
              onRemove(team.id);
            }
          }}
        >
          Remover
        </button>
      </td>
    </tr>
  );
}
