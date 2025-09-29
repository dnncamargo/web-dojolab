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
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);

  const toggleExpand = (classId: string) => {
    setExpandedClassId(expandedClassId === classId ? null : classId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-right">Ações</th>
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
                expanded={expandedClassId === cls.id}
                setEditingId={setEditingId}
                onToggleExpand={() => toggleExpand(cls.id)}
                onRemove={onRemove}
              />)}
              {expandedClassId === cls.id && (
                <ClassroomExpandRow classroom={cls} students={students} />
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
