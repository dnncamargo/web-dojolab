"use client";

import { useState } from "react";
import { task } from "@/app/utils/types";
import { v4 as uuidv4 } from "uuid";

type TaskEditorProps = {
  tasks: task[];
  onChange: (tasks: task[]) => void;
};

export default function TaskEditor({ tasks, onChange }: TaskEditorProps) {
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    const updated = [
      ...tasks,
      { id: uuidv4(), briefDescription: newTask.trim(), status: "not_started" as const },
    ];
    onChange(updated);
    setNewTask("");
  };

  const updateTask = (id: string, desc: string) => {
    onChange(tasks.map((t) => (t.id === id ? { ...t, briefDescription: desc } : t)));
  };

  const removeTask = (id: string) => {
    onChange(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="bg-white border rounded-md p-4 mt-4">
      <h3 className="mb-3">Tarefas</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Descrição da tarefa..."
          className="border rounded-l-lg p-2 flex-1"
        />
        <button
          onClick={addTask}
          className="bg-green-600 text-white px-3 py-2 rounded-r-lg hover:bg-green-700"
        >
          Adicionar
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between border-b pb-1">
            <input
              type="text"
              value={task.briefDescription}
              onChange={(e) => updateTask(task.id, e.target.value)}
              className="flex-1 p-1 border-none focus:outline-none"
            />
            <button
              onClick={() => removeTask(task.id)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
