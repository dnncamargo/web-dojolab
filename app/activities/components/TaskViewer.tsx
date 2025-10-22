"use client";

import { task } from "@/app/utils/types";

type TaskViewerProps = {
  tasks: task[];
};

export default function TaskViewer({ tasks }: TaskViewerProps) {
  if (!tasks?.length)
    return <p className="text-gray-500 italic text-sm">Nenhuma tarefa cadastrada.</p>;

  return (
    <div className="mt-4 bg-slate-50 border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Tarefas</h3>
      <ul className="list-disc pl-5 space-y-1">
        {tasks.map((t) => (
          <li key={t.id} className="text-gray-800">
            {t.briefDescription}
          </li>
        ))}
      </ul>
    </div>
  );
}
