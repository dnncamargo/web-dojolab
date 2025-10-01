// app/activities/components/ActivityTable.tsx
"use client";

import React, { useState } from "react";
import { activity, classroom } from "../../utils/types";
import ActivityRow from "./ActivityRow";
import ActivityEditRow from "./ActivityEditRow";
import ActivityExpandRow from "./ActivityExpandRow";
import { useRouter } from "next/navigation";

type ActivityTableProps = {
  activities: activity[];
  classrooms: classroom[];
  loadingClassrooms: boolean;
  onUpdate: (id: string, data: Partial<activity>) => void;
  onDelete: (id: string) => void;
  onCopy: (activity: activity) => void;
};

export default function ActivityTable({
  activities,
  classrooms,
  loadingClassrooms,
  onUpdate,
  onDelete,
  onCopy,

}: ActivityTableProps) {
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleViewResults = (id: string) => {
    router.push(`/in-progress/${id}/results`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Título</th>
            <th className="px-4 py-2 text-left">Turma</th>
            <th className="px-4 py-2 text-left">Data</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* Mostra carregamento enquanto as turmas estão sendo buscadas */}
          {loadingClassrooms && (
            <tr>
              <td colSpan={5} className="bg-gray-100 p-4 text-center text-gray-600">
                Carregando turmas...
              </td>
            </tr>
          )}

          {/* Só renderiza as atividades se as turmas já foram carregadas */}
          {!loadingClassrooms &&
            activities.map((a) => (
              <React.Fragment key={a.id}>
                {editingId === a.id ? (
                  <ActivityEditRow
                    activity={a}
                    classrooms={classrooms}
                    onSave={onUpdate}
                    onCancel={() => setEditingId(null)}
                    onRemove={onDelete}
                    onClose={() => setEditingId(null)}
                  />
                ) : (
                  <ActivityRow
                    activity={a}
                    classrooms={classrooms}
                    onRemove={onDelete}
                    onExpand={toggleExpand}
                    onEdit={setEditingId}
                    expanded={expandedId === a.id}
                    editing={editingId === a.id}
                  />
                )}

                {expandedId === a.id && (
                  <ActivityExpandRow
                    activity={a}
                    onCopy={onCopy}
                    onViewResults={handleViewResults}
                  />
                )}
              </React.Fragment>
            ))}

          {/* Nenhuma atividade cadastrada */}
          {activities.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                Nenhuma atividade cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
