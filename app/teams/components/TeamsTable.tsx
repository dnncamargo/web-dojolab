// app/teams/components/TeamsTable.tsx
"use client";

import React, { useState } from "react";

export default function TeamsTable({ teams, students, onRemove }: any) {
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  const toggleExpand = (teamId: string) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Nome da Equipe</th>
            <th className="px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team: any) => (
            <React.Fragment key={team.id}>
              <tr className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{team.name}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => toggleExpand(team.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    {expandedTeamId === team.id ? "Fechar" : "Ver Alunos"}
                  </button>
                  <button
                    onClick={() => onRemove(team.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remover
                  </button>
                </td>
              </tr>

              {expandedTeamId === team.id && (
                <tr>
                  <td colSpan={2} className="bg-gray-50 px-4 py-3">
                    <h3 className="font-semibold mb-2">Alunos da equipe</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {students
                        .filter((s: any) => s.teamId === team.id)
                        .map((s: any) => (
                          <li key={s.id}>{s.name}</li>
                        ))}
                      {students.filter((s: any) => s.teamId === team.id).length ===
                        0 && <li className="text-gray-500">Nenhum aluno associado.</li>}
                    </ul>
                  </td>
                </tr>
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
