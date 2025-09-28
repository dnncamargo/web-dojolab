import { ActivityStatus } from "./types";

export const getStatusLabel = (status: ActivityStatus) => {
  return ({
    not_assigned: "Sem atribuição",
    assigned: "Atribuída",
    in_progress: "Em andamento",
    completed: "Concluída",
    cancelled: "Cancelada"
  }[status] || status)

}

export function resolveStatus(
  classroomId: string | null | undefined,
  status?: ActivityStatus
): ActivityStatus {
  if (!classroomId) {
    return "not_assigned"
  }
  // se tem turma, não pode ficar "not_assigned"
  return status && status !== "not_assigned" ? status : "assigned"
}
