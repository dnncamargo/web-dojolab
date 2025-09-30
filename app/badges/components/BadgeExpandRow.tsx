"use client";

import { badge, classroom, student } from "@/app/utils/types";

type BadgeExpandRowProps = {
    badge: badge;
    students: student[];
    classrooms: classroom[];
    colSpan: number;
};

export default function BadgeExpandRow({ badge, students, classrooms, colSpan }: BadgeExpandRowProps) {

    const badgeStudents = students.filter((s) => {
        const studentBadges = s.badges || [];
        return studentBadges.includes(badge.id);
    });

    return (
        <tr>
            <td colSpan={colSpan} className="px-4 py-3 bg-gray-50">
                <h3 className="font-semibold mb-2">Alunos com esta Insígnia</h3>
                <ul className="list-disc pl-6 space-y-1">
                    {badgeStudents.length > 0 ? (
                        badgeStudents.map((s) => <li key={s.id}>{s.name} ({classrooms.find((c) => c.id === s.classroomId)?.name || "—"})</li>)
                    ) : (
                        <li className="text-gray-500">Nenhum aluno associado.</li>
                    )}
                </ul>
                <p className="mt-2 text-sm text-gray-600">
                    Total: <strong>{badgeStudents.length}</strong> aluno(s)
                </p>
            </td>
        </tr>
    );
}
