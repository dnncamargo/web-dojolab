// app/activities/[id]/results/page.tsx
"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useActivities } from "@/app/hooks/useActivities"; // Assumindo este path
import { useStudents } from "@/app/hooks/useStudents"; // Assumindo este hook
import { useTeams } from "@/app/hooks/useTeams"; // Assumindo este hook
import PodiumDisplay from "@/app/components/PodiumDisplay"; // Nosso novo componente

export default function ActivityResultsPage() {
  const params = useParams();
  const router = useRouter();

  const { activities, loading: activitiesLoading } = useActivities();
  const { students } = useStudents();
  const { teams } = useTeams();

  // 1. Encontrar a atividade
  const activity = useMemo(
    () => activities.find((a) => a.id === params.id),
    [activities, params.id]
  );

  // 2. Criar mapas de nomes para o PodiumDisplay
  const studentMap = useMemo(() => {
    return students.reduce<Record<string, { name: string }>>((acc, s) => {
      acc[s.id] = { name: s.name };
      return acc;
    }, {});
  }, [students]);

  const teamMap = useMemo(() => {
    return teams.reduce<Record<string, { name: string }>>((acc, t) => {
      acc[t.id] = { name: t.name };
      return acc;
    }, {});
  }, [teams]);

  if (activitiesLoading) {
    return <div className="p-6 text-gray-500">Carregando resultados...</div>;
  }

  if (!activity) {
    return <div className="p-6 text-red-600">Atividade não encontrada.</div>;
  }
  
  // A atividade deve estar finalizada para ter um pódio
  if (activity.status !== "completed" || !activity.podium) {
    console.log(activity.podium)
    return <div className="p-6 text-red-600">Esta atividade ainda não foi finalizada.</div>;
  }
  
  const { studentPodium, teamPodium } = activity.podium;


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Resultados: {activity.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Pódio de Alunos */}
        <PodiumDisplay
          title="🏆 Pódio de Alunos"
          entries={studentPodium}
          entityMap={studentMap}
          entityType="student"
        />

        {/* Pódio de Equipes */}
        <PodiumDisplay
          title="🏅 Pódio de Equipes"
          entries={teamPodium}
          entityMap={teamMap}
          entityType="team"
        />
      </div>

      {/* Botão de Finalização/Voltar */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-lg"
        >
          Voltar à Lista de Atividades
        </button>
      </div>
    </div>
  );
}