// app/components/ActivityInProgressTable.tsx
"use client";

import { useRouter } from "next/navigation";
import { activity, classroom } from "../utils/types";

type Props = {
  activities: activity[];
  classrooms: classroom[];
};

export default function ActivityInProgressTable({ activities, classrooms }: Props) {
  const router = useRouter();
  const inProgress = activities.filter((a) => a.status === "in_progress");

  return (
    <div className="bg-gray-100">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 text-left">Atividade</th>
            <th className="py-2 px-4 text-left">Turma</th>
            <th className="py-2 px-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {inProgress.map((activity) => (
            <tr className="border-t border-gray-200 hover:bg-gray-50" key={activity.id}>
              <td className="py-2 px-4">{activity.title}</td>
              <td className="px-4 py-2">
                {activity.classroomId
                  ? classrooms
                      .sort((a,b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }))
                      .find(c => c.id === activity.classroomId)?.name || "Turma não encontrada"
                  : "—"}
              </td>
              <td className="py-2 px-4 text-right">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => router.push(`/in-progress/${activity.id}`)}
                >
                  Ver Atividade
                </button>
              </td>
            </tr>
          ))}
          {inProgress.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center p-4 text-gray-500">
                Nenhuma atividade em andamento
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
