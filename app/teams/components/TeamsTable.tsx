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
              />)}
              {expandedTeamId === team.id && (
                <TeamsExpandRow
                  team={team}
                  students={students}
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
