import { ActivityStatus } from "./types";

export const getStatusLabel = (status: ActivityStatus) => {
  return ({
    not_assigned: "Sem atribuição",
    assigned: "Atribuída",
    in_progress: "Em Andamento",
    completed: "Concluída",
    cancelled: "Cancelada"
  }[status] || status)

}

export function resolveStatus(
  classroomId: string | null | undefined,
  status?: ActivityStatus
): ActivityStatus {
  // Se não há turma, nunca pode ser assigned/in_progress/completed
  if (!classroomId) {
    return "not_assigned";
  }

  // Se a atividade tem turma mas ainda não começou
  if (!status || status === "not_assigned") {
    return "assigned";
  }

  // Regras adicionais:
/*   if (status === "completed") {
    // Só pode ser completed se passou por in_progress
    return "in_progress";
  } */

  return status;
}
