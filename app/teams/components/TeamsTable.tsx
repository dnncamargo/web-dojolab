"use client";

import { student, classroom, team } from "@/app/utils/types";
import React, { useState } from "react";
import TeamsRow from "./TeamsRow";
import TeamsEditRow from "./TeamsEditRow";
import TeamsExpandRow from "./TeamsExpandRow";

type TeamsTableProps = {
  teams: team[];
  students: student[];
  classrooms: classroom[];
  onUpdate: (id: string, data: Partial<team>) => void;
  onRemove: (id: string) => void;
};

export default function TeamsTable({ teams, students, classrooms, onUpdate, onRemove }: TeamsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const isEditing = editingId !== null;
  const colSpanCount = 4; // Nome(1), Turma(1), Ativo/Vazio(1), Ações(1)

  const toggleExpand = (teamId: string) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">

        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Nome da Equipe</th>
            <th className="px-4 py-2 text-left">Turma</th>
            
            {/* Coluna para 'Ativo'. Visível apenas em edição, mas o <th> deve existir para manter a largura. */}
            <th className="px-4 py-2 text-left" style={{ width: isEditing ? 'auto' : '0', padding: isEditing ? '0.5rem 1rem' : '0' }}>
              {isEditing ? "Ativo" : ""}
            </th>

            {/* Ações deve estar sempre presente no cabeçalho e alinhado à direita */}
            <th className="px-4 py-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <React.Fragment key={team.id}>
              {editingId === team.id ? (
                <TeamsEditRow
                  team={team}
                  classrooms={classrooms}
                  onCancel={() => setEditingId(null)}
                  onSave={(id, data) => {
                    onUpdate(id, data);
                    setEditingId(null);
                  }}
                />
              ) : (
              <TeamsRow
                team={team}
                classrooms={classrooms}
                expanded={expandedTeamId === team.id}
                setEditingId={setEditingId}
                onToggleExpand={() => toggleExpand(team.id)}
                onRemove={onRemove}
                colSpan={colSpanCount}
              />)}
              {expandedTeamId === team.id && (
                <TeamsExpandRow
                  team={team}
                  students={students}
                  colSpan={colSpanCount}
                />
              )}
            </React.Fragment>
          ))}

          {teams.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center py-4 text-gray-500">
                Nenhuma equipe cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
