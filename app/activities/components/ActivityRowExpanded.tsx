import { activity } from "../../utils/types";
import CriteriaList from "./CriteriaList";
import InteractiveDescription from "./InteractiveDescription";
import RichTextDescription from "./RichTextDescription";
import TaskViewer from "./TaskViewer";
import dynamic from 'next/dynamic';

type ActivityRowExpandedProps = {
  activity: activity;
  onCopy: (activity: activity) => void;
  onViewResults: (id: string) => void;
};

const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false, // ❗ evita renderização no servidor
});

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
          ) : activity.descriptionType === "richtext" ? (
            <RichTextDescription content={activity.description ?? "Sem Descrição"} className="mt-4 mb-6" />
          ) : activity.description != null && activity.descriptionType === "externalpdf" ? (
            <PDFViewer pdfSource={activity.description}/>
          ) : ("Sem descrição")
        }

        </div>
        {activity.graded ? (
          <div className="mt-2">
            <strong>Critérios de Avaliação:</strong>
            <CriteriaList criteria={activity.assessment ?? []} />
          </div>
        ):(
          <p className="text-red-500">
            Esta atividade não é avaliativa
          </p>)
        }

        {activity.kanban ? (
          <div className="mt-2">
            <strong>Tarefas:</strong>
            <TaskViewer tasks={activity.taskBoard ?? []} />
          </div>
        ):(
          <p className="text-red-500">
            Esta atividade não possui tarefas
          </p>)
        }
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
