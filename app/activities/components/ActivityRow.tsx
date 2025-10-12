import { activity, classroom } from "../../utils/types";
import { getStatusLabel } from "../../utils/status";

type ActivityRowProps = {
  activity: activity;
  classrooms: classroom[];
  onRemove: (id: string) => void;
  onExpand: (id: string) => void;
  onEdit: (id: string) => void;
  expanded: boolean;
  editing: boolean;
};

const ActivityRow = ({ activity, classrooms, onRemove, onExpand, onEdit, expanded, editing }: ActivityRowProps) => {

  return (

    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2"><strong>{activity.title}</strong></td>
      <td className="px-4 py-2">
        {activity.classroomId
          ? classrooms.find(c => c.id === activity.classroomId)?.name || "Turma não encontrada"
          : "—"}
      </td>

      <td className="px-4 py-2">
        {activity.date.toLocaleDateString("pt-BR", { timeZone: 'UTC' })}
      </td>

      <td className="px-4 py-2">{getStatusLabel(Array.isArray(activity.status) ? activity.status[0] : activity.status)}</td>
      <td className="px-4 py-2 flex justify-end">

        {/* Botão Ver/Fechar */}
        <button
          className="px-3 py-1 ml-2 bg-blue-500 text-white rounded"
          onClick={() => onExpand(activity.id)}
          disabled={editing} // não permite expandir se está editando
        >
          {expanded ? "Fechar" : "Ver atividade"}
        </button>

        {/* Botão Editar/Salvar */}
        <button
          className="px-3 py-1 ml-2 bg-green-500 text-white rounded"
          onClick={() => onEdit(activity.id)}
          disabled={expanded} // não permite editar se está expandido
        >
          {editing ? "Salvar" : "Editar"}
        </button>

        {/* Botão Remover */}
        <button
          className="px-3 py-1 ml-2 bg-red-500 text-white rounded"
          onClick={() => {
            // Exibe um alerta de confirmação
            if (window.confirm(`Tem certeza que deseja remover "${activity.title}"?
Esta ação não pode ser desfeita.`)) {
              onRemove(activity.id);
            }
          }}
        >
          Remover
        </button>
      </td>
    </tr>

  );
};

export default ActivityRow;
