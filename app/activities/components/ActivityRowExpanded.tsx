import { activity } from "../../utils/types";
import CriteriaList from "./CriteriaList";
import InteractiveDescription from "./InteractiveDescription";
import RichTextDescription from "./RichTextDescription";

type ActivityRowExpandedProps = {
  activity: activity;
  onCopy: (activity: activity) => void;
  onViewResults: (id: string) => void;
};

export default function ActivityRowExpanded({
  activity,
  onCopy,
  onViewResults
}: ActivityRowExpandedProps) {

  const canViewResults =
    activity.status === "completed" &&
    activity.podium !== undefined &&
    activity.results !== null;

  return (
    <tr className="bg-gray-50">
      <td colSpan={5} className="p-4">

        <div className="text-gray-700 mt-2 mb-4">
          {/* Descrição */}

          {activity.descriptionType === "interactive" ? (
            <InteractiveDescription htmlContent={activity.description ?? "Sem Descrição"} />
          ) : (
            <RichTextDescription content={activity.description ?? "Sem Descrição"} className="mt-4 mb-6" />
          )}


        </div>
        <div className="mt-2">
          <strong>Critérios de Avaliação:</strong>
          <CriteriaList criteria={activity.assessment} />
        </div>
        <div className="mt-2">
          <strong>Atividade cronometrada:</strong> {activity.timed ? "Sim" : "Não"}
        </div>
        <div className="mt-2 mb-6">
          <strong>Criada em:</strong> {activity.createdAt.toLocaleDateString("pt-BR")}
        </div>

        <div className="flex mb-2 justify-end">
          {/* Botão Visualizar Resultados */}
          {canViewResults && (
            <button
              className="px-3 py-1 ml-2 bg-fuchsia-700 text-white rounded hover:bg-fuchsia-900 transition"
              onClick={() => onViewResults(activity.id)}
            >
              Ver Resultados
            </button>
          )}

          {/* Botão Copiar */}
          <button
            className="px-3 py-1 ml-5 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
            onClick={() => onCopy(activity)}
          >
            Criar uma cópia
          </button>
        </div>

      </td>
    </tr>
  );
}
