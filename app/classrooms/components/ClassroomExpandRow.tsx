"use client";

import { classroom, student } from "@/app/utils/types";

type ClassroomExpandRowProps = {
  classroom: classroom;
  students: student[];
};

export default function ClassroomExpandRow({ classroom, students }: ClassroomExpandRowProps) {
  const classStudents = students.filter((s) => s.classroomId === classroom.id);

  return (
    <tr>
      <td colSpan={2} className="bg-gray-50 px-4 py-3">
        <h3 className="font-semibold mb-2">Alunos da turma</h3>
        <ul className="list-disc pl-6 space-y-1">
          {classStudents.length > 0 ? (
            classStudents.map((s) => <li key={s.id}>{s.name}</li>)
          ) : (
            <li className="text-gray-500">Nenhum aluno associado.</li>
          )}
        </ul>
        <p className="mt-2 text-sm text-gray-600">
          Total: <strong>{classStudents.length}</strong> aluno(s)
        </p>
      </td>
    </tr>
  );
}
