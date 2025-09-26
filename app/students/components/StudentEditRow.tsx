// app/students/components/StudentEditRow.tsx
"use client";

import { useState } from "react";
import { student, classroom } from "../../utils/types";

type Props = {
  student: student;
  classrooms: classroom[];
  onCancel: () => void;
  onSave: (id: string, data: Partial<student>) => Promise<void> | void;
};

export default function StudentEditRow({ student, classrooms, onCancel, onSave }: Props) {
  const [name, setName] = useState(student.name);
  const [classroomId, setClassroomId] = useState(student.classroomId || "");

  const handleSave = () => {
    onSave(student.id, {
      name,
      classroomId: classroomId,
    });
    onCancel();
  };

  return (
    <>
      {/* Nome */}
      <td className="px-4 py-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
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
    </>
  );
}
