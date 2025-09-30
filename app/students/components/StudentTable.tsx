// app/students/components/StudentTable.tsx
"use client";

import React, { useState } from "react";
import { student, classroom, team, badge } from "../../utils/types";
import StudentExpandRow from "./StudentExpandRow";
import StudentEditRow from "./StudentEditRow";
import StudentRow from "./StudentRow";

type StudentTableProps = {
  students: student[];
  classrooms: classroom[];
  teams: team[];
  badges: badge[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: Partial<student>) => void;
  onToggleTeam: (teamId: string, studentId: string) => Promise<void> | void;
  onToggleBadge: (studentId: string, badgeId: string) => Promise<void> | void;
};

export default function StudentTable({
  students,
  classrooms,
  teams,
  badges,
  onRemove,
  onUpdate,
  onToggleTeam,
  onToggleBadge,
}: StudentTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandType, setExpandType] = useState<"team" | "badge" | null>(null);
  const isEditing = editingId !== null;
  const colSpanCount = 4; // Nome(1), Turma(1), Ativo/Vazio(1), Ações(1)

  const toggleExpand = (id: string, type: "team" | "badge") => {
    if (expandedId === id && expandType === type) {
      setExpandedId(null);
      setExpandType(null);
    } else {
      setExpandedId(id);
      setExpandType(type);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Turma</th>

            {/* NOVO: Coluna para 'Ativo'. Visível apenas em edição, mas o <th> deve existir para manter a largura. */}
            <th className="px-4 py-2 text-left" style={{ width: isEditing ? 'auto' : '0', padding: isEditing ? '0.5rem 1rem' : '0' }}>
              {isEditing ? "Ativo" : ""}
            </th>

            {/* Ações deve estar sempre presente no cabeçalho e alinhado à direita */}
            <th className="px-4 py-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <React.Fragment key={s.id}>
              {editingId === s.id ? (
                <StudentEditRow
                  student={s}
                  classrooms={classrooms}
                  onCancel={() => setEditingId(null)}
                  onSave={(id, data) => {
                    onUpdate(id, data);
                    setEditingId(null);
                  }}
                />
              ) : (
                <StudentRow
                  student={s}
                  classrooms={classrooms}
                  setEditingId={() => setEditingId(s.id)}
                  toggleExpand={toggleExpand}
                  onRemove={onRemove}
                  isExpanded={expandedId === s.id}
                  currentExpandType={expandedId === s.id ? expandType : null}
                  colSpan={colSpanCount}
                />
              )}

              {expandedId === s.id && (
                <StudentExpandRow
                  student={s}
                  expandType={expandType}
                  teams={teams}
                  badges={badges}
                  onToggleTeam={onToggleTeam}
                  onToggleBadge={onToggleBadge}
                  colSpan={colSpanCount}
                />
              )}
            </React.Fragment>
          ))}

          {students.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                Nenhum aluno cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
