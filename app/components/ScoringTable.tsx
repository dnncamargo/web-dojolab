// app/components/ScoringTable.tsx
"use client";

import { useEffect, useState } from "react";
import { activity, scoringResult, student, team } from "../utils/types";
import StarRating from "./StarRating";
import BooleanRating from "./BooleanRating";

type ScoringTableProps = {
  activity: activity;
  students: student[];
  teams: team[];
  initialResults?: scoringResult[];
  onChange?: (results: scoringResult[]) => void;
};

// Tipo do estado local
type ScoresState = Record<
  string, // criteriaId
  Record<
    string, // entityId (aluno ou equipe)
    number | boolean | null
  >
>;

// Função auxiliar para converter initialResults -> ScoresState
const mapInitialResultsToScoresState = (initialResults: scoringResult[]): ScoresState => {
    if (!initialResults.length) return {};
    const initial: ScoresState = {};
    for (const r of initialResults) {
      if (!initial[r.criteriaId]) {
        initial[r.criteriaId] = {};
      }
      // O valor inicial pode ser null, mas o tipo scores[crit][ent] é number | boolean | null
      initial[r.criteriaId][r.targetId] = r.value as (number | boolean | null); 
    }
    return initial;
}

export default function ScoringTable({
  activity,
  students,
  teams,
  initialResults = [],
  onChange,
}: ScoringTableProps) {
  const [scores, setScores] = useState<ScoresState>(
    () => mapInitialResultsToScoresState(initialResults)
  );

  // Converte o estado local em scoringResult[] e envia ao pai
  useEffect(() => {
    if (!onChange) return;

    const results: scoringResult[] = [];
    for (const crit of activity.assessment) {
      const entities = scores[crit.id] || {};
      Object.entries(entities).forEach(([entityId, value]) => {
        if (value !== null) {
          results.push({
            criteriaId: crit.id,
            targetId: entityId,
            targetType: crit.scoringType === "individual" ? "student" : "team",
            value,
          });
        }
      });
    }
    onChange(results);
  }, [scores, activity, onChange]);

    const handleScoreChange = (
    criteriaId: string,
    entityId: string,
    value: number | boolean
  ) => {
    setScores((prev) => ({
      ...prev,
      [criteriaId]: {
        ...(prev[criteriaId] || {}),
        [entityId]: value,
      },
    }));
  };

  // Filtrar apenas alunos e equipes da turma da atividade
  const activeStudents = students.filter(
    (s) => s.isActive && s.classroomId === activity.classroomId
  );
  const activeTeams = teams.filter(
    (t) => t.isActive && t.classroomId === activity.classroomId
  );

  return (
    <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-200 text-gray-700">
          <th className="py-2 px-4 text-left">Critérios</th>
          <th className="py-2 px-4 text-left">Avaliações</th>
        </tr>
      </thead>
      <tbody>
        {activity.assessment.map((crit) => (
          <tr key={crit.id} className="border-t border-gray-200">
            <td className="py-2 px-4">{crit.description}</td>
            <td className="py-2 px-4">
              {crit.scoringType === "individual" &&
                activeStudents.map((st) => (
                  <div key={st.id} className="mb-2 flex items-center gap-2">
                    <span className="w-32">{st.name}</span>
                    {crit.evaluationType === "integer" ? (
                      <StarRating
                        value={(scores[crit.id]?.[st.id] as number) || 0}
                        onChange={(v) => handleScoreChange(crit.id, st.id, v)}
                      />
                    ) : (
                      <BooleanRating
                        value={(scores[crit.id]?.[st.id] as boolean | null) ?? null}
                        onChange={(v) => handleScoreChange(crit.id, st.id, v)}
                      />
                    )}
                  </div>
                ))}

              {crit.scoringType === "team" &&
                activeTeams.map((tm) => (
                  <div key={tm.id} className="mb-2 flex items-center gap-2">
                    <span className="w-32">{tm.name}</span>
                    {crit.evaluationType === "integer" ? (
                      <StarRating
                        value={(scores[crit.id]?.[tm.id] as number) || 0}
                        onChange={(v) => handleScoreChange(crit.id, tm.id, v)}
                      />
                    ) : (
                      <BooleanRating
                        value={(scores[crit.id]?.[tm.id] as boolean | null) ?? null}
                        onChange={(v) => handleScoreChange(crit.id, tm.id, v)}
                      />
                    )}
                  </div>
                ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
