import { useState } from "react"
import { activity, criteria } from "@/app/utils/types"
import { useClassroom } from "../../hooks/useClassroom"
import CriteriaEditor from "./CriteriaEditor"
import DescriptionEditor from "./DescriptionEditor"
import { resolveStatus } from "@/app/utils/status"
import { decodeHtmlEntities } from "@/app/utils/htmlUtils"
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
    const [descriptionType, setDescriptionType] = useState<"richtext" | "interactive">("richtext")
    const [criteria, setCriteria] = useState<criteria[]>([])
    const [selectedClass, setSelectedClass] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { classrooms } = useClassroom()
    const status = "not_assigned"

    const handleSave = () => {
        if (!title.trim() || criteria.length === 0) return

        let finalDescription = description;

        if (descriptionType === "interactive") {
            // Se o conteúdo veio do RichTextEditor e contém tags escapadas
            if (finalDescription.includes("&lt;")) {
                finalDescription = decodeHtmlEntities(finalDescription);
            }
        }


        const newActivity: Omit<activity, "id"> = {
            title,
            description: finalDescription,
            classroomId: selectedClass || undefined,
            assessment: criteria,
            status: resolveStatus(selectedClass, status),
            timed,
            descriptionType: descriptionType,
            date: selectedDate,
            createdAt: new Date(),
        }
        onAdd(newActivity)
        onCancel()
    }

    const handleChangeDescriptionType = (newType: 'richtext' | 'interactive') => {
        setDescriptionType(newType)
    }

    return (
        <div className="space-y-4 mt-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full ml-1 border p-2 rounded-md"
            />

            <div>
                <label className="block text-sm font-medium">Descrição</label>
                <DescriptionEditor
                    value={description}
                    onChange={setDescription}
                    descriptionType={descriptionType}
                    onSetDescriptionType={handleChangeDescriptionType} />

            </div>

            <div className="flex justify-between">
                <div className="flex flex-row w-10/12">

                    <div className="flex-1 ml-4">
                        <label className="block text-sm font-medium">Turma</label>
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

                    <div className=" ml-4">
                        <label className="block text-sm font-medium">Data</label>
                        <input
                            type="date"
                            // conversão só para exibir no input
                            value={selectedDate.toISOString().split("T")[0]}
                            // conversão só na leitura do input → volta para Date
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            className="border p-2 rounded-md w-full"
                            required
                        />
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

            <CriteriaEditor
                criteria={criteria}
                onChange={setCriteria}
            />

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
