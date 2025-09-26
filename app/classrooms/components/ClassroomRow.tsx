"use client";

import { classroom } from "@/app/utils/types";

type ClassroomRowProps = {
  classroom: classroom;
  expanded: boolean;
  onToggleExpand: () => void;
  onRemove: (id: string) => void;
};

export default function ClassroomRow({ classroom, expanded, onToggleExpand, onRemove }: ClassroomRowProps) {
  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2">{classroom.name}</td>
      <td className="px-4 py-2 flex gap-2 justify-end">
        <button
          onClick={onToggleExpand}
          className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
        >
          {expanded ? "Fechar" : "Ver Alunos"}
        </button>
        <button
          onClick={() => onRemove(classroom.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Remover
        </button>
      </td>
    </tr>
  );
}
