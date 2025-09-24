// app/students/components/StudentTable.tsx
"use client";

import { useState } from "react";
import { student, classroom } from "../../utils/types";

type StudentTableProps = {
  students: student[];
  classes: classroom[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: student) => void;
};

export default function StudentTable({ students, classes, onRemove, onUpdate }: StudentTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editClassId, setEditClassId] = useState("");
  const [editBadge, setEditBadge] = useState("");

  const startEditing = (student: student) => {
    setEditingId(student.id);
    setEditName(student.name);
    setEditClassId(student.classId || "");
    setEditBadge(student.badge || "");
  };

  const saveEdit = async (id: string) => {
    await onUpdate(id, {
      id,
      name: editName,
      classId: editClassId,
      badge: editBadge,
    } as student);
    setEditingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Turma</th>
            <th className="px-4 py-2 text-left">Insígnia</th>
            <th className="px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student: student) => (
            <tr
              key={student.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              {editingId === student.id ? (
                <>
                  {/* Nome */}
                  <td className="px-4 py-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />
                  </td>

                  {/* Turma */}
                  <td className="px-4 py-2">
                    <select
                      value={editClassId}
                      onChange={(e) => setEditClassId(e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    >
                      <option value="">—</option>
                      {classes.map((cls: classroom) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Insígnia */}
                  <td className="px-4 py-2">
                    <select
                      value={editBadge}
                      onChange={(e) => setEditBadge(e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    >
                      <option value="">—</option>
                      <option value="ouro">Ouro</option>
                      <option value="prata">Prata</option>
                      <option value="bronze">Bronze</option>
                    </select>
                  </td>

                  {/* Ações */}
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => saveEdit(student.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(student.id)}
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
                    {classes.find((cls: classroom) => cls.id === student.classId)?.name || "—"}
                  </td>
                  <td className="px-4 py-2">{student.badge || "—"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => startEditing(student)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Editar
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
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                Nenhum aluno cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
