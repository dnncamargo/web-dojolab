"use client";

import { classroom, student } from "@/app/utils/types";
import React, { useState } from "react";
import ClassroomRow from "./ClassroomRow";
import ClassroomExpandRow from "./ClassroomExpandRow";
import ClassroomEditRow from "./ClassroomEditRow";

type ClassroomTableProps = {
  students: student[];
  classrooms: classroom[];
  onUpdate: (classId: string, data: Partial<classroom>) => void;
  onRemove: (classId: string) => void;
};

export default function ClassroomTable({ students, classrooms, onUpdate, onRemove }: ClassroomTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedClassroomId, setExpandedClassroomId] = useState<string | null>(null);
  const isEditing = editingId !== null;
  const colSpanCount = 3; // Nome(1), Ativo/Vazio(1), Ações(1)

  const toggleExpand = (classroomId: string) => {
    setExpandedClassroomId(expandedClassroomId === classroomId ? null : classroomId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            {/* CORREÇÃO 1: Largura fixa para 'Nome' (Permite que o nome ocupe a maior parte) */}
            <th className="px-4 py-2 text-left w-1/2">Nome</th>

            {/* CORREÇÃO 2: Coluna 'Ativo' sempre presente, com largura fixa e pequena (w-20) */}
            <th className="px-4 py-2 text-left w-20">
              {isEditing ? "Ativo" : ""} {/* Mostra "Ativo" apenas em modo de edição */}
            </th>

            {/* CORREÇÃO 3: Largura fixa para 'Ações' (suficiente para os botões) */}
            <th className="px-4 py-2 text-right w-48">Ações</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map((cls) => (
            <React.Fragment key={cls.id}>
              {editingId === cls.id ? (
                <ClassroomEditRow
                  classroom={cls}
                  onCancel={() => setEditingId(null)}
                  onSave={(id, data) => {
                    onUpdate(id, data);
                    setEditingId(null);
                  }}
                />
              ) : (
                <ClassroomRow
                  classroom={cls}
                  expanded={expandedClassroomId === cls.id}
                  setEditingId={setEditingId}
                  onToggleExpand={() => toggleExpand(cls.id)}
                  onRemove={onRemove}
                  colSpan={colSpanCount}
                />)}
              {expandedClassroomId === cls.id && (
                <ClassroomExpandRow
                  classroom={cls}
                  students={students}
                  colSpan={colSpanCount}
                />
              )}
            </React.Fragment>
          ))}

          {classrooms.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center py-4 text-gray-500">
                Nenhuma turma cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
