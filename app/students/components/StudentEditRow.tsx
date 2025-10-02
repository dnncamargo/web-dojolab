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
  const [isActive, setIsActive] = useState(student.isActive !== undefined ? student.isActive : true);

  const handleSave = () => {
    onSave(student.id, {
      name,
      classroomId: classroomId,
      isActive
    });
    onCancel();
  };

  return (
    <tr className="border-t border-gray-200 bg-gray-50">
      {/* Nome */}
      <td className="px-4 py-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 m-1 rounded w-full"
        />
      </td>

      {/* Turma */}
      <td className="px-4 py-2">
        <select
          value={classroomId}
          onChange={(e) => setClassroomId(e.target.value)}
          className="border px-2 py-1 m-1 rounded w-full"
        >
          <option value="">—</option>
          {classrooms.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </td>

      {/* Ativo */}
      <td className="px-4 py-2">
        <div className="flex items-center justify-start h-full">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            title={isActive ? "Desativar Aluno" : "Ativar Aluno"}
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
