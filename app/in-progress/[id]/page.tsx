'app/in-progress/[id]/page.tsx'
"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActivities } from "@/app/hooks/useActivities";
import { useStudents } from "@/app/hooks/useStudents";
import { useTeams } from "@/app/hooks/useTeams";
import type { scoringResult } from "@/app/utils/types";
import RichTextDescription from "@/app/activities/components/RichTextDescription";
import InteractiveDescription from "@/app/activities/components/InteractiveDescription";
import Timer from "@/app/components/Timer";
import KanbanBoard from "../../components/KanbanBoard";
import ScoringTable from "@/app/components/ScoringTable";

export default function ActivityInProgressPage() {
  const params = useParams();
  const router = useRouter();

  const { activities, loading: activitiesLoading, updateTaskStatus, handleFinalize } = useActivities();
  const { students } = useStudents();
  const { teams } = useTeams();

  // 1. CHAME TODOS OS HOOKS NO NÍVEL SUPERIOR

  // procura a activity pela rota (useMemo)
  const activity = useMemo(
    () => activities.find((a) => a.id === params.id),
    [activities, params.id]
  );

  // estado local dos resultados (useState)
  const [results, setResults] = useState<scoringResult[]>([]);

  // sincroniza quando a activity mudar (useEffect)
  useEffect(() => {
    if (activity?.results) {
      setResults(activity.results);
    }
  }, [activity]);

  // Quando a atividade for marcada localmente como 'completed', redirecione.
  useEffect(() => {
    // 1. Verifica se a atividade existe
    if (!activity) return;

    // 2. Verifica se a atividade foi finalizada no Firebase E sincronizada localmente
    if (activity.status === 'completed' && activity.podium) {
      // Redireciona APENAS quando o estado local estiver atualizado.
      router.push(`/in-progress/${activity.id}/results`);
    }
  }, [activity, router]); // Depende da atividade e do router


  // callback estável para atualizar resultados (useCallback)
  const handleResultsChange = useCallback((next: scoringResult[]) => {
    setResults(next);
  }, []);

  // 2. AGORA, FAÇA O RETORNO CONDICIONAL (EARLY EXIT)

  if (!activity) {
    return <div className="p-6 text-red-600">Atividade não encontrada</div>;
  }

  // Filtrar apenas alunos e equipes da turma da atividade

  const activeStudents = students
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }))
    .filter(
      (s) => s.isActive && s.classroomId === activity.classroomId
    );
  const activeTeams = teams
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }))
    .filter(
      (t) => t.isActive && t.classroomId === activity.classroomId
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Finalizar a atividade?")) return;

    await handleFinalize(activity, results);

  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">{activity.title}</h1>
        <button
          className="px-3 py-1 bg-gray-600 text-white rounded"
          onClick={() => router.push("/")}
        >
          Voltar
        </button>
      </div>

      {/* Descrição */}

      {activity.descriptionType === "interactive" ? (
        <InteractiveDescription htmlContent={activity.description ?? ""} />
      ) : (
        <RichTextDescription content={activity.description ?? ""} className="mt-4 mb-6" />
      )}

      {/* Timer */}
      {activity.timed && (
        <div className="mt-6 mb-6">
          <Timer />
        </div>
      )}

      {/* Kanban */}
      {activity.kanban && (
        <KanbanBoard
          activity={activity}
          teams={activeTeams} // Passa o array de todas as equipes
          onStatusChange={(activityId, teamId, taskId, newStatus) => {
            // Chama a função do hook que persiste a alteração no banco de dados.
            updateTaskStatus(activityId, teamId, taskId, newStatus);
          }}
        />
      )}

      {/* Formulário de critérios */}

      <form onSubmit={handleSubmit}>

        {activity.graded ? (
          <>
            {(activity.assessment && activity.assessment.length > 0) ? (
              <ScoringTable
                activity={activity}
                students={activeStudents}
                teams={activeTeams}
                initialResults={results}
                onChange={handleResultsChange}
              />
            ) : (
              <p className="text-red-500">
                Não há critérios avaliativos cadastrados nesta atividade
              </p>)
            }

          </>
        ) : (
          <p className="text-red-500">
            Esta atividade não é avaliativa
          </p>)}



        <div className="flex justify-end gap-4 mt-6">

          <button
            type="submit"
            disabled={activitiesLoading || activity.status === 'completed'} // Desabilita se já estiver concluído
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            {activitiesLoading ? "Finalizando..." : "Finalizar Atividade"}
          </button>
        </div>
      </form>
    </div>
  );
}
