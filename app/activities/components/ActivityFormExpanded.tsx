import { useState } from "react"
import { activity, criteria } from "@/app/utils/types"
import { useClassroom } from "../../hooks/useClassroom"
import CriteriaEditor from "./CriteriaEditor"
import { resolveStatus } from "@/app/utils/status"
import clsx from "clsx"

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
    const [timed, setTimed] = useState(false)
    const [criteria, setCriteria] = useState<criteria[]>([])
    const [selectedClass, setSelectedClass] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { classrooms } = useClassroom()
    const status = "not_assigned"

    const handleSave = () => {
        if (!title.trim() || criteria.length === 0) return

        const newActivity: Omit<activity, "id"> = {
            title,
            description,
            classroomId: selectedClass || undefined,
            assessment: criteria,
            status: resolveStatus(selectedClass, status),
            timed,
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
                className="w-full ml-1 border p-2 rounded-md"
            />

            <textarea
                placeholder="Descrição (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded-md"
            />

            <div className="flex self-start  justify-between">

                <div >
                    <label className="text-sm mb-1">Data da Atividade (obrigatória)</label>
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

                <div>
                    <label className="text-sm mb-1">Selecione a Turma (opcional)</label>
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
            </div>

            <CriteriaEditor
                criteria={criteria}
                onChange={setCriteria}
            />



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

            <div className="flex">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 mr-1 bg-green-500 text-white rounded-md"
                >
                    Salvar Atividade
                </button>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 ml-1 bg-gray-300 rounded-md"
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}
