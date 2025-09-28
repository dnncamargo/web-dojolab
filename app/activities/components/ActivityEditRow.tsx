import { useEffect, useState } from "react";
import { activity, classroom, criteria } from "../../utils/types";
import { resolveStatus, getStatusLabel } from "../../utils/status";
import { ActivityStatus } from "@/app/utils/types";
import CriteriaList from "./CriteriaList";

type ActivityEditRowProps = {
  activity: activity;
  classrooms: classroom[];
  onSave: (id: string, data: Partial<activity>) => void;
  onCancel: () => void;
  onRemove: (id: string) => void;
  onClose: () => void;
};

export default function ActivityEditRow({
  activity,
  classrooms,
  onSave,
  onCancel,
  onRemove,
  onClose
}: ActivityEditRowProps) {
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description || "");
  const [classroomId, setClassroomId] = useState(activity.classroomId || "");
  const [date, setDate] = useState(activity.date);
  const [criteria, setCriteria] = useState<criteria[]>(activity.assessment || [])
  const [status, setStatus] = useState<ActivityStatus>(
    activity.status && ["assigned", "in_progress", "completed", "cancelled"].includes(activity.status)
      ? (activity.status as ActivityStatus)
      : "assigned" // fallback seguro
  );


  useEffect(() => {
    setCriteria(activity.assessment || [])
  }, [activity])


  const handleSave = () => {
    onSave(activity.id, {
      title,
      description,
      classroomId,
      date,
      assessment: criteria,
      status: resolveStatus(classroomId, status),
    });
    onClose();
  };

  return (
    <tr className="bg-gray-50">
      <td colSpan={5} className="p-4 space-y-4">

        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-3 py-1 bg-green-600 text-white rounded"
            onClick={handleSave}
          >
            Salvar
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={() => {
              // Exibe um alerta de confirmação
              if (window.confirm("Tem certeza que deseja remover esta atividade?")) {
                onRemove(activity.id);
              }
            }}
          >
            Remover
          </button>
        </div>
        <div>

          <label className="block text-sm font-medium">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          {!classroomId ? (
            <input
              type="text"
              value={getStatusLabel("not_assigned")}
              disabled
              className="border rounded p-2 w-full bg-gray-100 text-gray-500"
            />
          ) : (
            <select
              value={status || "assigned"} // nunca undefined
              onChange={(e) => setStatus(e.target.value as ActivityStatus)}
              className="border rounded p-2 w-full"
            >
              <option value="assigned">{getStatusLabel("assigned")}</option>
              <option value="in_progress">{getStatusLabel("in_progress")}</option>
              <option value="completed">{getStatusLabel("completed")}</option>
              <option value="cancelled">{getStatusLabel("cancelled")}</option>
            </select>

          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mt-2">
          <strong>Critérios de Avaliação:</strong>
          <CriteriaList criteria={activity.assessment} />
        </div>


        <div>
          <label className="block text-sm font-medium">Turma</label>
          <select
            value={classroomId}
            onChange={(e) => setClassroomId(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">— Nenhuma turma —</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Data</label>
          <input
            type="date"
            value={date.toISOString().split("T")[0]}
            onChange={(e) => setDate(new Date(e.target.value))}
            className="border rounded p-2"
          />
        </div>

      </td>
    </tr>
  );
}
