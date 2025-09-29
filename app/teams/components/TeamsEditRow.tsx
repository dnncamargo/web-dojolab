// app/teams/components/TeamsEditRow.tsx
"use client";

import { useState } from "react";
import { team, classroom } from "../../utils/types";

type Props = {
  team: team;
  classrooms: classroom[];
  onCancel: () => void;
  onSave: (id: string, data: Partial<team>) => Promise<void> | void;
};

export default function TeamEditRow({ team, classrooms, onCancel, onSave }: Props) {
  const [teamName, setTeamName] = useState(team.name);
  const [classroomId, setClassroomId] = useState(team.classroomId || "");

  const handleSave = () => {
    onSave(team.id, {
      name: teamName,
      classroomId: classroomId,
    });
    onCancel();
  };

  return (
    <tr className="border-t border-gray-200 bg-gray-50">
      {/* Nome */}
      <td className="px-4 py-2">
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </td>

      {/* Turma */}
      <td className="px-4 py-2">
        <select
          value={classroomId}
          onChange={(e) => setClassroomId(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="">—</option>
          {classrooms.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
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
