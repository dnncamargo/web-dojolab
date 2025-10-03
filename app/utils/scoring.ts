// app/utils/scoring.ts
import { activity, scoringResult } from "./types";

export function validateAllCriteriaFilled(
  activity: activity,
  results: scoringResult[]
): boolean {
  const expected = activity.assessment.length;
  const byCriteria = new Set(results.map((r) => r.criteriaId));
  return byCriteria.size === expected;
}

/**
 * Calcula pontuação final de estudantes e equipes
 * - booleanos: 1 ou 0 multiplicado pelo peso
 * - inteiros: soma direta multiplicada pelo peso
 */
export function calculatePodium(
  activity: activity,
  results: scoringResult[]
) {
  const studentScores: Record<string, number> = {};
  const teamScores: Record<string, number> = {};

  for (const r of results) {
    const c = activity.assessment.find((a) => a.id === r.criteriaId);
    if (!c) continue;

    let value = 0;
    if (c.evaluationType === "boolean") {
      value = (r.value ? 1 : 0) * (c.weight ?? 1);
    } else {
      value = (r.value as number) * (c.weight ?? 1);
    }

    if (r.targetType === "student") {
      studentScores[r.targetId] = (studentScores[r.targetId] || 0) + value;
    } else if (r.targetType === "team") {
      teamScores[r.targetId] = (teamScores[r.targetId] || 0) + value;
    }
  }

  const studentPodium = Object.entries(studentScores)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));

  const teamPodium = Object.entries(teamScores)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));

  return { studentPodium, teamPodium };
}
