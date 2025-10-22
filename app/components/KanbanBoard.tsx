// app/components/KanbanBoard.tsx

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { activity, team, task, board } from "../utils/types";
import clsx from "clsx"; // Usado para classes condicionais

type KanbanBoardProps = {
  activity: activity;
  teams: team[];
  onStatusChange: (activityId: string, teamId: string, taskId: string, newStatus: task["status"]) => void;
};

const COLUMNS: { key: task["status"]; label: string }[] = [
  { key: "not_started", label: "A Fazer" },
  { key: "doing", label: "Em Progresso" },
  { key: "done", label: "Concluído" },
];

// O tipo do dado que será renderizado por COLUNA: é a própria task.
// O KanbanBoard lida com a inicialização.

export default function KanbanBoard({
  activity,
  teams,
  onStatusChange,
}: KanbanBoardProps) {
  const [draggingTask, setDraggingTask] = useState<string | null>(null);

  /**
   * 🛠️ Inicializa ou retorna o Workflow (board[]) com o status de cada equipe.
   * Isso garante que cada equipe tenha uma cópia das tasks do taskBoard.
   */
  const initializedWorkflow = useMemo(() => {
    if (!activity.taskBoard) return [];

    const templates = activity.taskBoard; // tasks[] (Templates do professor)
    const savedWorkflow = activity.workflow || []; // board[] (Progresso salvo)

    // O workflow inicializado deve ser um array de boards (um para cada equipe ativa)
    const workflow: board[] = teams.map(team => {
      // 1. Tenta encontrar o board salvo para a equipe
      const savedBoard = savedWorkflow.find(b => b.teamId === team.id);

      if (savedBoard) {
        // 2. Se encontrou, garantimos que todas as tasks do template estão lá, mas mantemos o status salvo.
        const initializedTasks = templates.map(templateTask => {
          const savedTaskInstance = savedBoard.tasks.find(t => t.id === templateTask.id);

          // Se o template for novo, usa o status inicial (not_started).
          return savedTaskInstance
            ? savedTaskInstance
            : {
              ...templateTask,
              status: "not_started"
            };
        });
        return {
          id: savedBoard.id, // Reutiliza o ID do board se houver
          teamId: team.id,
          tasks: initializedTasks
        } as board;
      } else {
        // 3. Se não encontrou, inicializa o board com o status padrão
        const initialTasks = templates.map(t => ({
          ...t,
          status: "not_started"
        }));
        return {
          id: `board-${team.id}`, // Cria um ID temporário/lógico se não houver um no banco
          teamId: team.id,
          tasks: initialTasks
        } as board;
      }
    });

    return workflow;
  }, [activity.taskBoard, activity.workflow, teams]);

  const [localWorkflow, setLocalWorkflow] = useState<board[]>(initializedWorkflow);

  // Sempre que o Firebase atualizar a activity.workflow, sincronizamos:
  React.useEffect(() => {
    if (activity.workflow && activity.workflow.length > 0) {
      setLocalWorkflow(activity.workflow);
    }
  }, [activity.workflow]);


  /** Lógica de Drag and Drop */
  /**
     * Função para processar o drop de uma tarefa em uma nova coluna.
     * teamId é a equipe do destino.
     * newStatus é o status da coluna de destino.
     */
  const handleDrop = useCallback(
    (teamId: string, newStatus: task["status"]) => {
      if (!draggingTask) return;

      // Atualiza visualmente o estado local
      setLocalWorkflow((prevWorkflow) =>
        prevWorkflow.map((board) =>
          board.teamId === teamId
            ? {
              ...board,
              tasks: board.tasks.map((t) =>
                t.id === draggingTask ? { ...t, status: newStatus } : t
              ),
            }
            : board
        )
      );

      // Persiste no Firebase
      onStatusChange(activity.id, teamId, draggingTask, newStatus);

      setDraggingTask(null);
    },
    [activity.id, draggingTask, onStatusChange]
  );


  if (!activity.kanban || !activity.taskBoard?.length) {
    return <p className="text-red-500">Não há tarefas cadastradas nesta atividade.</p>;
  }

  if (!teams.length) {
    return <p className="text-red-500">Nenhuma equipe ativa encontrada para esta turma.</p>;
  }


  return (
    <div className="space-y-8 mt-6 mb-6">

      {localWorkflow.map((board) => {
        console.log(JSON.stringify(localWorkflow, undefined, 4))
        const team = teams.find(t => t.id === board.teamId);
        // Não deveria ocorrer, mas é uma proteção
        if (!team) return null;

        // O teamTasks é o array de tasks para renderizar no board da equipe
        const teamTasks = board.tasks;
        console.log(JSON.stringify(board, undefined, 4))

        return (
          <section key={team.id} className="border rounded-lg p-4 shadow bg-white">
            <h2 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">
              {team.name}
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {COLUMNS.map(({ key, label }) => (
                <div
                  key={key}
                  className={clsx(
                    "rounded-lg min-h-[150px] p-3 border border-gray-200",
                    // Adiciona uma cor de fundo sutil para as colunas
                    key === 'not_started' ? 'bg-red-50' :
                      key === 'doing' ? 'bg-yellow-50' :
                        'bg-green-50'
                  )}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(team.id, key)}
                >
                  <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">{label}</h3>
                  <div className="space-y-3">
                    {teamTasks
                      .filter((t) => t.status === key)
                      .map((t) => (
                        <motion.div
                          // CHAVE COMPOSTA para ser única na tela
                          key={`${t.id}-${team.id}`}
                          draggable
                          // No drag, salvamos o ID da TAREFA (template)
                          onDragStart={() => setDraggingTask(t.id)}
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-white rounded shadow cursor-grab border-l-4 border-blue-400 hover:border-blue-600 transition"
                        >
                          <p className="font-medium text-gray-800">
                            {t.briefDescription}
                          </p>
                          {t.observations && (
                            <p className="text-xs text-gray-500 mt-1">
                              {t.observations}
                            </p>
                          )}
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}