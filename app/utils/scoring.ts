// app/utils/scoring.ts
import { activity, scoringResult } from "./types"; // ajuste o path conforme seu projeto

export function validateAllCriteriaFilled(activity: activity, results: scoringResult[]): boolean {
  if (!Array.isArray(results)) return false;

  // exige que cada criterion da activity apareça pelo menos uma vez em results
  const expectedIds = new Set(activity.assessment.map((c) => c.id));
  const presentIds = new Set(results.map((r) => r.criteriaId));

  // todos os critérios devem estar presentes
  for (const id of expectedIds) {
    if (!presentIds.has(id)) return false;
  }
  return true;
}

/**
 * Calcula pódio de estudantes e equipes:
 * - normaliza r.value para número (boolean -> 1/0)
 * - soma por targetId + targetType
 */
export function calculatePodium(activity: activity, results: scoringResult[]) {
  const studentScores: Record<string, number> = {};
  const teamScores: Record<string, number> = {};

  for (const r of results) {
    const crit = activity.assessment.find((a) => a.id === r.criteriaId);
    if (!crit) continue;

    // coerção robusta: se value for boolean, converte; se number, usa Number()
    const numericValue: number =
      typeof r.value === "boolean" ? (r.value ? 1 : 0) : Number(r.value ?? 0);

    if (r.targetType === "student") {
      studentScores[r.targetId] = (studentScores[r.targetId] || 0) + numericValue;
    } else if (r.targetType === "team") {
      teamScores[r.targetId] = (teamScores[r.targetId] || 0) + numericValue;
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
