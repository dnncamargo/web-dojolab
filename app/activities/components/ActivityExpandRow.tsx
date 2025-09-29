import { activity, classroom } from "../../utils/types";
import CriteriaList from "./CriteriaList";

type ActivityExpandRowProps = {
  activity: activity;
  classrooms: classroom[];
};

export default function ActivityExpandRow({
  activity,
  classrooms,
}: ActivityExpandRowProps) {
  
  return (
    <tr className="bg-gray-50">
      <td colSpan={5} className="p-4">
        <div className="text-gray-700 mt-2 mb-4">{activity.description || "Sem descrição"}</div>
        <div className="mt-2">
          <strong>Critérios de Avaliação:</strong>
          <CriteriaList criteria={activity.assessment} />
        </div>
        <div className="mt-2">
          <strong>Atividade cronometrada:</strong> {activity.timed ? "Sim" : "Não"}
        </div>
        <div className="mt-2">
          <strong>Criada em:</strong> {activity.createdAt.toLocaleDateString("pt-BR")}
        </div>
      </td>
    </tr>
  );
}
