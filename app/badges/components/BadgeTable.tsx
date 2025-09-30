// app/badges/components/BadgeTable.tsx
"use client";

import React, { useState } from "react";
import { badge, classroom, student } from "../../utils/types";
import BadgeRow from "./BadgeRow";
import BadgeEditRow from "./BadgeEditRow";
import BadgeExpandRow from "./BadgeExpandRow";

type BadgeTableProps = {
  badges: badge[];
  students: student[];
  classrooms: classroom[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: Partial<badge>) => void;
}

export default function BadgeTable({ badges, students, classrooms, onRemove, onUpdate }: BadgeTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedBadgeId, setExpandedBadgeId] = useState<string | null>(null);
  const isEditing = editingId !== null;
  const colSpanCount = isEditing ? 5 : 4;

  const toggleExpand = (badgeId: string) => {
    setExpandedBadgeId(expandedBadgeId === badgeId ? null : badgeId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Imagem</th>
            <th className="px-4 py-2 text-left">Descrição</th>
            {isEditing && (
              <th className="px-4 py-2 text-left">Ativo</th>
            )}
            <th className="px-4 py-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {badges.map((b) => (
            <React.Fragment key={b.id}>
              {editingId === b.id ? (
                <BadgeEditRow
                  badge={b}
                  onCancel={() => setEditingId(null)}
                  onSave={(id, data) => {
                    onUpdate(id, data);
                    setEditingId(null);
                  }}
                />
              ) : (
                <BadgeRow
                  badge={b}
                  expanded={expandedBadgeId === b.id}
                  setEditingId={setEditingId}
                  onToggleExpand={() => toggleExpand(b.id)}
                  onRemove={onRemove}
                  isTableEditing={isEditing} 
                />)}
              {expandedBadgeId === b.id && (
                <BadgeExpandRow
                  badge={b}
                  students={students}
                  classrooms={classrooms}
                  colSpan={colSpanCount}
                />
              )}
            </React.Fragment>
          ))}

          {badges.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center py-4 text-gray-500">
                Nenhuma insígnia cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
