// app/students/components/StudentRow.tsx
"use client";

import { useState } from "react";
import { student, classroom } from "../../utils/types";

type Props = {
  student: student;
  classes: classroom[];
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  expandedId: string | null;
  expandType: "team" | "badge" | null;
  onUpdate: (id: string, data: student) => void;
  onRemove: (id: string) => void;
  toggleExpand: (id: string, type: "team" | "badge") => void;
};

export default function StudentRow({
  student,
  classes,
  editingId,
  setEditingId,
  onUpdate,
  onRemove,
  toggleExpand,
}: Props) {
  const [editName, setEditName] = useState(student.name);
  const [editClassId, setEditClassId] = useState(student.classroomId || "");

  const saveEdit = async () => {
    await onUpdate(student.id, { ...student, name: editName, classroomId: editClassId });
    setEditingId(null);
  };

  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      {editingId === student.id ? (
        <>
          <td className="px-4 py-2">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
          </td>
          <td className="px-4 py-2">
            <select
              value={editClassId}
              onChange={(e) => setEditClassId(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            >
              <option value="">—</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </td>
          <td className="px-4 py-2 flex gap-2">
            <button
              onClick={saveEdit}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Salvar
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </td>
        </>
      ) : (
        <>
          <td className="px-4 py-2">{student.name}</td>
          <td className="px-4 py-2">
            {classes.find((cls) => cls.id === student.classroomId)?.name || "—"}
          </td>
          <td className="px-4 py-2 flex gap-2">
            <button
              onClick={() => setEditingId(student.id)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => toggleExpand(student.id, "team")}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Equipe
            </button>
            <button
              onClick={() => toggleExpand(student.id, "badge")}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Insígnia
            </button>
                        <button
              onClick={() => onRemove(student.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remover
            </button>
          </td>
        </>
      )}
    </tr>
  );
}
