import { useEffect, useState } from "react";
import { activity, classroom, criteria } from "../../utils/types";
import { resolveStatus, getStatusLabel } from "../../utils/status";
import { ActivityStatus } from "@/app/utils/types";
import CriteriaEditor from "./CriteriaEditor";
import clsx from "clsx";

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
  onClose
}: ActivityEditRowProps) {
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description || "");
  const [classroomId, setClassroomId] = useState(activity.classroomId || "");
  const [date, setDate] = useState(activity.date);
  const [timed, setTimed] = useState(activity.timed || false);
  const [criteria, setCriteria] = useState<criteria[]>(activity.assessment || [])
  const [status, setStatus] = useState<ActivityStatus>(
    activity.status && ["assigned", "in_progress", "completed", "cancelled"].includes(activity.status)
      ? (activity.status as ActivityStatus)
      : "assigned" // fallback seguro
  );

  const [hasImage, setHasImage] = useState(true || false);
  const [image, setImage] = useState(activity.imageUrl || "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(activity.imageUrl || "");


  useEffect(() => {
    setCriteria(activity.assessment || [])
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url); // Mostra o preview do arquivo
      setImage(""); // Limpa a URL de texto, dando precedência ao arquivo
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImage(url);
    setPreviewUrl(url); // Atualiza o preview com a URL digitada
    setFile(null); // Limpa o arquivo, dando precedência à URL de texto
  }

  const handleSave = () => {

    let finalImageUrl = image;
        if (file) {
            finalImageUrl = URL.createObjectURL(file);
        }

    onSave(activity.id, {
      title,
      description,
      classroomId,
      imageUrl: finalImageUrl,
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

        <div>
          <label className="block text-sm font-medium">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mt-2">
          <CriteriaEditor
            criteria={criteria}
            onChange={setCriteria}
          />
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
          <label className="block text-sm mb-1">Configuração de Tempo (opcional)</label>
          <button
            type="button"
            onClick={() => setTimed(!timed)}
            className={clsx('w-12 h-6 rounded-full transition flex items-center p-1',
              timed ? 'bg-blue-600' : 'bg-gray-300')}
          >
            <div className={clsx('bg-white w-4 h-4 rounded-full shadow transform transition', timed ? 'translate-x-6' : 'translate-x-0')} />
          </button>

        </div>

        <div>
          <label className="block text-sm mb-1">Adicionar imagem (opcional)</label>
          <button
            type="button"
            onClick={() =>
              setHasImage(!hasImage)
            }
            className={clsx('w-12 h-6 rounded-full transition flex items-center p-1',
              hasImage ? 'bg-blue-600' : 'bg-gray-300')}
          >
            <div className={clsx('bg-white w-4 h-4 rounded-full shadow transform transition', hasImage ? 'translate-x-6' : 'translate-x-0')} />
          </button>

          {hasImage && (
            <td className="px-4 py-2">
              <div className="flex flex-col gap-1">
                {/* Preview Image */}
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Pré-visualização da insígnia"
                    className="h-10 w-10 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-200 rounded mb-2 flex items-center justify-center text-xs text-gray-500">
                    Sem Imagem
                  </div>
                )}
                {/* File Input Button */}
                <label className="flex items-center gap-2 cursor-pointer bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">
                  {file ? file.name : (previewUrl ? "Mudar Imagem" : "Selecionar Imagem")}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    hidden
                  />
                </label>
                {/* Input de URL para quem quiser colar um link */}
                <input
                  type="text"
                  placeholder="Ou cole a URL da imagem"
                  value={image}
                  onChange={handleImageUrlChange}
                  className="border rounded px-2 py-1 w-full text-sm mt-1"
                />
              </div>
            </td>
          )}

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
