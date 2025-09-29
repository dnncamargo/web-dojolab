// app/teams/components/TeamsEditRow.tsx
"use client";

import { useState } from "react";
import { classroom } from "../../utils/types";

type Props = {
  classroom: classroom;
  onCancel: () => void;
  onSave: (id: string, data: Partial<classroom>) => Promise<void> | void;
};

export default function ClassroomEditRow({ classroom, onCancel, onSave }: Props) {
  const [classroomName, setClassroomName] = useState(classroom.name);

  const handleSave = () => {
    onSave(classroom.id, {
      name: classroomName,
    });
    onCancel();
  };

  return (
    <tr className="border-t border-gray-200 bg-gray-50">
      {/* Nome */}
      <td className="px-4 py-2">
        <input
          value={classroomName}
          onChange={(e) => setClassroomName(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </td>

      {/* Ações */}
      <td className="px-4 py-2 flex gap-2 justify-end">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Salvar
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
      </td>
    </tr>
  );
}
