// app/teams/components/TeamsEditRow.tsx
"use client";

import { useState } from "react";
import { classroom } from "../../utils/types";

type ClassroomEditRowProps = {
  classroom: classroom;
  onCancel: () => void;
  onSave: (id: string, data: Partial<classroom>) => Promise<void> | void;
};

export default function ClassroomEditRow({ classroom, onCancel, onSave }: ClassroomEditRowProps) {
  const [classroomName, setClassroomName] = useState(classroom.name);
  const [isActive, setIsActive] = useState(classroom.isActive !== undefined ? classroom.isActive : true);

  const handleSave = () => {
    onSave(classroom.id, {
      name: classroomName,
      isActive
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

      {/* Ativo */}
      <td className="px-4 py-2">
        <div className="flex items-center justify-start h-full">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            title={isActive ? "Desativar Turma" : "Ativar Turma"}
          />
        </div>
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
