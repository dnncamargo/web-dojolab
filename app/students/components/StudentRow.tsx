// app/students/components/StudentRow.tsx
"use client";

import { student, classroom } from "../../utils/types";

type StudentRowProps = {
    student: student & { isActive?: boolean };
    classrooms: classroom[];
    setEditingId: (id: string | null) => void;
    toggleExpand: (id: string, type: "team" | "badge") => void;
    onRemove: (id: string) => void;
    isExpanded: boolean;
    currentExpandType: "team" | "badge" | null;
    colSpan: number; 
};

export default function StudentRow({ student, classrooms, setEditingId, isExpanded, currentExpandType, toggleExpand, onRemove, colSpan }: StudentRowProps) {

    // Funções auxiliares para determinar se o *próprio* botão deve ser "Fechar"
    const isTeamExpanded = isExpanded && currentExpandType === "team";
    const isBadgeExpanded = isExpanded && currentExpandType === "badge";

        // Lógica de estilo condicional para inativo
    const isInactive = student.isActive === false;
    const textClass = isInactive ? "text-gray-500" : "text-gray-900";

    return (

        <tr className={`border-t border-gray-200 hover:bg-gray-50 ${isInactive ? "bg-gray-100" : ""}`}>
            {/* Nome (Aplica a classe condicional) */}
            <td className={`px-4 py-2 ${textClass}`}>{student.name}</td>
            <td className={`px-4 py-2 ${textClass}`} colSpan={2}>
                {classrooms.find((c) => c.id === student.classroomId)?.name || "—"}
            </td>
            <td colSpan={colSpan} className="px-4 py-2 flex justify-end">
                <button
                    onClick={() => setEditingId(student.id)}
                    className="bg-blue-500 text-white px-3 py-1 m-1 rounded hover:bg-blue-600"
                >
                    Editar
                </button>
                <button
                    onClick={() => toggleExpand(student.id, "team")}
                    className={
                        `px-3 py-1 rounded transition ` +
                        (isTeamExpanded ? "bg-emerald-500 m-1 text-white hover:bg-emerald-600" : "m-1 bg-green-500  text-white hover:bg-green-600")
                    }
                >
                    {isTeamExpanded ? "Fechar" : "Equipe"}
                </button>
                <button
                    onClick={() => toggleExpand(student.id, "badge")}
                    className={
                        `px-3 py-1 rounded transition ` +
                        (isBadgeExpanded ? "bg-orange-500 m-1 text-white hover:bg-orange-600" : "m-1 bg-yellow-500 text-white hover:bg-yellow-600")
                    }
                >
                    {isBadgeExpanded ? "Fechar" : "Insígnia"}
                </button>
                {/* Botão Remover */}
                <button
                    className="px-3 py-1 m-1 bg-red-500 text-white rounded"
                    onClick={() => {
                        // Exibe um alerta de confirmação
                        if (window.confirm("Tem certeza que deseja remover este aluno?")) {
                            onRemove(student.id);
                        }
                    }}
                >
                    Remover
                </button>
            </td>
        </tr>
    );
}