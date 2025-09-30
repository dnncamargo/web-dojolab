"use client";

import { student, team } from "@/app/utils/types";

type TeamsExpandRowProps = {
  team: team;
  students: student[];
  colSpan: number
};

export default function TeamsExpandRow({ team, students }: TeamsExpandRowProps) {
  const members = team.members
    .map((id) => students.find((s) => s.id === id))
    .filter((s): s is student => !!s);

  return (
    <tr>
      <td colSpan={2} className="bg-gray-50 px-4 py-3">
        <h3 className="font-semibold mb-2">Alunos da equipe</h3>
        <ul className="list-disc pl-6 space-y-1">
          {members.length > 0 ? (
            members.map((s) => <li key={s.id}>{s.name}</li>)
          ) : (
            <li className="text-gray-500">Nenhum aluno nesta equipe.</li>
          )}
        </ul>
        <p className="mt-2 text-sm text-gray-600">
          Total: <strong>{members.length}</strong> aluno(s)
        </p>
      </td>
    </tr>
  );
}
