import { useState } from "react"
import { activity, criteria } from "@/app/utils/types"
import { useClassroom } from "../../hooks/useClassroom"
import CriteriaEditor from "./CriteriaEditor"
import { resolveStatus } from "@/app/utils/status"

type ActivityFormExpandedProps = {
    initialTitle: string
    onAdd: (activity: Omit<activity, "id">) => Promise<void>
    onCancel: () => void
}

export default function ActivityFormExpanded({
    initialTitle,
    onAdd,
    onCancel,
}: ActivityFormExpandedProps) {
    const [title, setTitle] = useState(initialTitle)
    const [description, setDescription] = useState("")
    const [timeConfig, setTimeConfig] = useState<{ mode: "chronometer" | "alarm"; value: number } | undefined>()
    const [status, setStatus] = useState<"not_assigned" | "assigned">("not_assigned")
    const [criteria, setCriteria] = useState<criteria[]>([])
    const [selectedClass, setSelectedClass] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { classrooms } = useClassroom()
    const [error, setError] = useState<string | null>(null);

    const handleSave = () => {
        if (!title.trim() || criteria.length === 0) return

        const newActivity: Omit<activity, "id"> = {
            title,
            description,
            classroomId: selectedClass || undefined,
            assessment: criteria,
            status: resolveStatus(selectedClass, status),
            ...(timeConfig ? { timeConfig } : {}),
            date: selectedDate,
            createdAt: new Date(),
        }
        onAdd(newActivity)
        onCancel()
    }

    return (
        <div className="space-y-4 mt-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded-md"
            />

            <textarea
                placeholder="Descrição (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded-md"
            />

            <div>
                <label className="block text-sm mb-1">Data da Atividade (obrigatória)</label>
                <input
                    type="date"
                    // conversão só para exibir no input
                    value={selectedDate.toISOString().split("T")[0]}
                    // conversão só na leitura do input → volta para Date
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="border p-2 rounded-md w-full"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    A data deve ser hoje ou posterior. (campo obrigatório)
                </p>
            </div>

            <CriteriaEditor criteria={criteria} setCriteria={setCriteria} />

            <div>
                <label className="block text-sm">Selecione a Turma (opcional)</label>
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full border p-2 rounded-md"
                >
                    <option value="">-- Nenhuma turma --</option>
                    {classrooms.map((classroom) => (
                        <option key={classroom.id} value={classroom.id}>
                            {classroom.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm">Configuração de Tempo (opcional)</label>
                <select
                    value={timeConfig?.mode || ""}
                    onChange={(e) =>
                        setTimeConfig(
                            e.target.value
                                ? { mode: e.target.value as "chronometer" | "alarm", value: 0 }
                                : undefined
                        )
                    }
                    className="w-full border p-2 rounded-md"
                >
                    <option value="">-- Nenhum --</option>
                    <option value="cronometro">Cronômetro</option>
                    <option value="despertador">Despertador</option>
                </select>
                {timeConfig && (
                    <input
                        type="number"
                        placeholder="Tempo em minutos"
                        value={timeConfig.value}
                        onChange={(e) =>
                            setTimeConfig({ ...timeConfig, value: Number(e.target.value) })
                        }
                        className="w-full border p-2 rounded-md mt-2"
                    />
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                    Salvar Atividade
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}
