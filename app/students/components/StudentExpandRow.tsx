// app/students/components/StudentExpandRow.tsx
"use client";

import { student, team, badge } from "../../utils/types";

type StudentExpandRowProps = {
    student: student;
    expandType: "team" | "badge" | null;
    teams?: team[];         // opcional, pode ser undefined mas tratamos
    badges?: badge[];      // opcional
    onToggleTeam: (teamId: string, studentId: string) => Promise<void> | void;
    onToggleBadge: (studentId: string, badgeId: string) => Promise<void> | void;
    onUpdate?: (id: string, data: student) => void;
    colSpan: number; 
};

export default function StudentExpandRow({
    student,
    expandType,
    teams = [],
    badges = [],
    onToggleTeam,
    onToggleBadge,
    colSpan
}: StudentExpandRowProps) {
    const isMemberOf = (t: team) => Array.isArray(t.members) && t.members.includes(student.id);
    const hasBadge = (b: badge) => {
        const studentBadges: string[] = student.badges || [];
        return Array.isArray(studentBadges) ? studentBadges.includes(b.id) : false;
    };

    return (
        <tr>
            <td colSpan={colSpan} className="px-4 py-3 bg-gray-50">
                <div className="flex gap-3 overflow-x-auto">
                    {expandType === "team" &&
                        teams
                            .filter((t) => t.classroomId === student.classroomId) // 🔹 só equipes da turma
                            .map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => onToggleTeam(t.id, student.id)}
                                    className={`w-12 h-12 flex items-center justify-center rounded-full transition
          ${isMemberOf(t) ? "bg-purple-500 text-white" : "bg-purple-200 hover:bg-purple-300"}`}
                                    title={t.name}
                                >
                                    {t.name?.charAt(0) ?? "T"}
                                </button>
                            ))}


                    {expandType === "badge" &&
                        badges.map((b) => (
                            <button
                                key={b.id}
                                onClick={() => onToggleBadge(student.id, b.id)}
                                className={`w-12 h-12 flex items-center justify-center rounded-full transition
                  ${hasBadge(b) ? "bg-yellow-500 text-white" : "bg-yellow-200 hover:bg-yellow-300"}`}
                                title={b.name}
                            >
                                {b.imageUrl ? (
                                    <img src={b.imageUrl} alt={b.name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    b.name?.charAt(0) ?? "B"
                                )}
                            </button>
                        ))}
                </div>
            </td>
        </tr>
    );
}
