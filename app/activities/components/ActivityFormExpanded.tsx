import { useState } from "react"
import { activity, criteria, task } from "@/app/utils/types"
import { useClassroom } from "../../hooks/useClassroom"
import CriteriaEditor from "./CriteriaEditor"
import DescriptionEditor from "./DescriptionEditor"
import { resolveStatus } from "@/app/utils/status"
import { decodeHtmlEntities } from "@/app/utils/htmlUtils"
import clsx from "clsx"
import TaskEditor from "./TaskEditor"

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
    const [graded, setGraded] = useState(false)
    const [descriptionType, setDescriptionType] = useState<'richtext' | 'interactive' | 'externalpdf'>("richtext")
    const [criteria, setCriteria] = useState<criteria[]>([])
    const [kanban, setKanban] = useState(false)
    const [taskBoard, setTaskBoard] = useState<task[]>([])
    const [tagString, setTagString] = useState<string>("");
    const [selectedClass, setSelectedClass] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { classrooms } = useClassroom()
    const status = "not_assigned"

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

        let finalDescription = description;

        if (descriptionType === "interactive") {
            // Se o conteúdo veio do RichTextEditor e contém tags escapadas
            if (finalDescription.includes("&lt;")) {
                finalDescription = decodeHtmlEntities(finalDescription);
            }
        }
        const tagsArray = tagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        const newActivity: Omit<activity, "id"> = {
            title,
            description: finalDescription,
            classroomId: selectedClass || undefined,
            assessment: criteria,
            status: resolveStatus(selectedClass, status),
            timed,
            kanban,
            graded,
            tags: tagsArray,
            descriptionType: descriptionType,
            date: selectedDate,
            createdAt: new Date(),
        }
        onAdd(newActivity)
        setTitle("")
        setDescription("")
        setTimed(false)
        setGraded(false)
        setCriteria([])
        setSelectedClass("")
        setSelectedDate(new Date())
        setTagString("");
        onCancel()
    }

    const handleChangeDescriptionType = (newType: 'richtext' | 'interactive' | 'externalpdf') => {
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
                <label className="block text-sm font-medium ml-2">Descrição</label>
                <DescriptionEditor
                    value={description}
                    onChange={setDescription}
                    descriptionType={descriptionType}
                    onSetDescriptionType={handleChangeDescriptionType} />

            </div>

            <div className="flex justify-between">
                <div className="flex flex-row w-10/12">

                    <div className="flex-1 ml-1">
                        <label className="block text-sm font-medium ml-2">Turma</label>
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
                        <label className="block text-sm font-medium ml-2">Data</label>
                        <input
                            type="date"
                            // conversão só para exibir no input
                            value={selectedDate.toISOString().split("T")[0]}
                            // conversão só na leitura do input → volta para Date
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                            className="border p-1 rounded-md"
                            required
                        />
                    </div>
                </div>
                <div>
                    <div className="ml-8 flex flex-col self-center">
                        <label className="block text-sm mb-1">Tarefas</label>
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
                        <label className="block text-sm mb-1">Avaliação</label>
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
                        <label className="block text-sm mb-1">Tempo</label>
                        <button
                            type="button"
                            onClick={() => setTimed(!timed)}
                            className={clsx('w-12 h-6 rounded-full transition flex self-center p-1',
                                timed ? 'bg-blue-600' : 'bg-gray-300')}
                        >
                            <div className={clsx('bg-white w-4 h-4 rounded-full shadow transform transition',
                                timed ? 'translate-x-6' : 'translate-x-0')} />
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
                <label className="block text-sm mb-1 ml-2">Tags (separadas por vírgula)</label>
                <input
                    type="text"
                    value={tagString}
                    onChange={(e) => setTagString(e.target.value)}
                    className="w-full ml-1 border p-2 rounded-md"
                    placeholder="ex: matemática, lúdico, 5o ano"
                />
            </div>

            {/* NOVO: Exibição de Erro */}
            {errorMessage && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md font-medium text-sm">
                    {errorMessage}
                </div>
            )}

            <div className="flex">
                <button
                    className="px-4 py-1 m-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
                    onClick={handleSave}
                    disabled={!title.trim() || (graded && criteria.length === 0)}
                >
                    Salvar Atividade
                </button>
                <button
                    onClick={onCancel}
                    className="px-3 py-1 m-1 bg-gray-300 rounded-md"
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}
