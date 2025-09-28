// app/students/components/StudentRow.tsx
"use client";

import { useState } from "react";
import { student, classroom } from "../../utils/types";

type StudentRowProps = {
    student: student;
    classrooms: classroom[];
    setEditingId: (id: string | null) => void;
    toggleExpand: (id: string, type: "team" | "badge") => void;
    onRemove: (id: string) => void;
};

export default function StudentRow({ student, classrooms, setEditingId, toggleExpand, onRemove }: StudentRowProps) {
    const classroom = classrooms.find((cls) => cls.id === student.classroomId);
    return (

        <tr className="border-t border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-2">{student.name}</td>
            <td className="px-4 py-2">
                {classrooms.find((c) => c.id === student.classroomId)?.name || "—"}
            </td>
            <td className="px-4 py-2 flex gap-2 justify-end">
                <button
                    onClick={() => setEditingId(student.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                    Editar
                </button>
                <button
                    onClick={() => toggleExpand(student.id, "team")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                    Equipe
                </button>
                <button
                    onClick={() => toggleExpand(student.id, "badge")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                    Insígnia
                </button>
                <button
                    onClick={() => onRemove(student.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    Remover
                </button>
            </td>
        </tr>
    );
}