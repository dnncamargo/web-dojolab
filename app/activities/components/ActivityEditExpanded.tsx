import { useEffect, useState } from "react";
import { activity, classroom, criteria, task } from "../../utils/types";
import { resolveStatus, getStatusLabel } from "../../utils/status";
import { ActivityStatus } from "@/app/utils/types";
import CriteriaEditor from "./CriteriaEditor";
import clsx from "clsx";
import DescriptionEditor from "./DescriptionEditor";
import { decodeHtmlEntities } from "@/app/utils/htmlUtils";
import TaskEditor from "./TaskEditor";

type ActivityEditExpandedProps = {
  activity: activity;
  classrooms: classroom[];
  onSave: (id: string, data: Partial<activity>) => void;
  onCancel: () => void;
  onRemove: (id: string) => void;
  onClose: () => void;
};

export default function ActivityEditExpanded({
  activity,
  classrooms,
  onSave,
  onCancel,
  onClose
}: ActivityEditExpandedProps) {
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description || "");
  const [descriptionType, setDescriptionType] = useState<"richtext" | "interactive">(activity.descriptionType)
  const [classroomId, setClassroomId] = useState(activity.classroomId || "");
  const [date, setDate] = useState(activity.date);
  const [kanban, setKanban] = useState(activity.kanban)
  const [taskBoard, setTaskBoard] = useState<task[]>(activity.taskBoard || [])
  const [timed, setTimed] = useState(activity.timed || false);
  const [graded, setGraded] = useState(activity.graded);
  const [criteria, setCriteria] = useState<criteria[]>(activity.assessment || [])
  const initialTags = (activity.tags || []).join(', ');
  const [tagString, setTagString] = useState<string>(initialTags);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<ActivityStatus>(
    activity.status && ["assigned", "in_progress", "completed", "cancelled"].includes(activity.status)
      ? (activity.status as ActivityStatus)
      : "assigned" // fallback seguro
  );

  useEffect(() => {
    setTaskBoard(activity.taskBoard || [])
    setCriteria(activity.assessment || [])
    setTagString((activity.tags || []).join(', '))
  }, [activity])

  const wasCompleted = () => {
    return (
      activity.status === "completed" &&
      Array.isArray(activity.results) &&
      activity.results.length > 0 &&
      activity.podium !== undefined &&
      activity.finalizedAt !== undefined
    );
  };

  const handleSave = () => {

    // 1. Limpa erros anteriores
    setErrorMessage(null);

    // 2. Validação do Título (title.length === 0)
    if (!title.trim()) {
      setErrorMessage("O Título da atividade é obrigatório.");
      return;
    }

    // 3. Validação dos Critérios (se graded, criteria.length === 0)
    if (graded && criteria.length === 0) {
      setErrorMessage("Atividades avaliadas devem ter ao menos um critério.");
      return;
    } else {
      let i = 0;
      for (i; i < criteria.length; i++) {
        if (criteria[i].description === "") {
          setErrorMessage("Um ou mais Critérios de Avaliação não possuem descrição preenchida.");
          return;
        }
      }
    }

    const tagsArray = tagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    let finalDescription = description;

    if (descriptionType === "interactive") {
      // Se o conteúdo veio do RichTextEditor e contém tags escapadas
      if (finalDescription.includes("&lt;")) {
        finalDescription = decodeHtmlEntities(finalDescription);
      }
    }

    onSave(activity.id, {
      title,
      description: finalDescription,
      classroomId,
      date,
      assessment: criteria,
      descriptionType,
      timed,
      kanban,
      taskBoard,
      graded,
      status: resolveStatus(classroomId, status),
      tags: tagsArray
    });
    setTitle("")
    setDescription("")
    setTimed(false)
    setGraded(false)
    setCriteria([])
    setTaskBoard([])
    setClassroomId("")
    setKanban(false)
    setDate(new Date())
    setTagString("");
    onClose();
  };

  const handleChangeDescriptionType = (newType: 'richtext' | 'interactive') => {
    setDescriptionType(newType)
  }

  return (
    <tr className="bg-gray-50">
      <td colSpan={5} className="p-4 space-y-4">

        <div className="flex justify-end">
          <button
            className="px-3 py-1 m-1 bg-gray-500 text-white rounded-md"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-6 py-1 m-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
            onClick={handleSave}
            disabled={!title.trim() || (graded && criteria.length === 0)}
          >
            Salvar Atividade
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
          <label className="block text-sm font-medium">Descrição</label>
          <DescriptionEditor
            value={description}
            onChange={setDescription}
            descriptionType={descriptionType}
            onSetDescriptionType={handleChangeDescriptionType}
          />

        </div>
        <div className="flex justify-between">
          <div className="flex flex-row w-10/12">

            <div className="flex-1">
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
                  <option
                    value="completed"
                    disabled={!wasCompleted()}   // 🔒 desabilita Completed se não houver resultados
                  >
                    {getStatusLabel("completed")}
                  </option>
                  <option value="cancelled">{getStatusLabel("cancelled")}</option>
                </select>
              )}
            </div>

            <div className="flex-1 ml-4">
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

            <div className=" ml-4">
              <label className="block text-sm font-medium">Data</label>
              <input
                type="date"
                value={date.toISOString().split("T")[0]} // Usa a string de data corrigida
                onChange={(e) => setDate(new Date(e.target.value + 'T00:00:00'))} // Cria a nova data no fuso horário local/UTC do input
                className="border rounded p-1"
              />
            </div>
          </div>
          <div>
            <div className="ml-8 flex flex-col self-center">
              <label className="block text-sm mb-1">Kanban</label>
              <button
                type="button"
                onClick={() => setKanban(!kanban)}
                className={clsx('w-12 h-6 rounded-full transition flex self-center p-1',
                  kanban ? 'bg-blue-600' : 'bg-gray-300')}
              >
                <div className={clsx('bg-white w-4 h-4 rounded-full shadow transform transition',
                  kanban ? 'translate-x-6' : 'translate-x-0')} />
              </button>

            </div>
          </div>
          <div>
            <div className="ml-8 flex flex-col self-center">
              <label className="block text-sm mb-1">Pontuação</label>
              <button
                type="button"
                onClick={() => setGraded(!graded)}
                className={clsx('w-12 h-6 rounded-full transition flex self-center p-1',
                  graded ? 'bg-blue-600' : 'bg-gray-300')}
              >
                <div className={clsx('bg-white w-4 h-4 rounded-full shadow transform transition',
                  graded ? 'translate-x-6' : 'translate-x-0')} />
              </button>

            </div>
          </div>
          <div>
            <div className="ml-8 flex flex-col self-center">
              <label className="block text-sm mb-1">Temporizador</label>
              <button
                type="button"
                onClick={() => setTimed(!timed)}
                className={clsx('w-12 h-6 rounded-full transition flex self-center p-1',
                  timed ? 'bg-blue-600' : 'bg-gray-300')}
              >
                <div className={clsx('bg-white w-4 h-4 rounded-full shadow transform transition', timed ? 'translate-x-6' : 'translate-x-0')} />
              </button>

            </div>
          </div>
        </div>

        {/* Kanban */}
        {kanban && (
          <TaskEditor
            tasks={taskBoard}
            onChange={setTaskBoard}
          />
        )}

        {/* Avaliação */}
        {graded && (
          <CriteriaEditor
            criteria={criteria}
            onChange={setCriteria}
          />
        )}

        {/* TAGS */}
        <div>
          <label className="block text-sm mb-1">Tags (separadas por vírgula)</label>
          <input
            type="text"
            value={tagString}
            onChange={(e) => setTagString(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="ex: matemática, lúdico, 5o ano"
          />
        </div>

        {/* NOVO: Exibição de Erro */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md font-medium text-sm">
            {errorMessage}
          </div>
        )}
      </td>
    </tr>
  );
}
