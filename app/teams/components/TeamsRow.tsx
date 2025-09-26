"use client";

import { team } from "@/app/utils/types";

type TeamsRowProps = {
  team: team;
  expanded: boolean;
  onToggleExpand: () => void;
  onRemove: (id: string) => void;
};

export default function TeamsRow({ team, expanded, onToggleExpand, onRemove }: TeamsRowProps) {
  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2">{team.name}</td>
      <td className="px-4 py-2 flex gap-2 justify-end">
        <button
          onClick={onToggleExpand}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          {expanded ? "Fechar" : "Ver Alunos"}
        </button>
        <button
          onClick={() => onRemove(team.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Remover
        </button>
      </td>
    </tr>
  );
}
