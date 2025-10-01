"use client";

import { classroom, student } from "@/app/utils/types";

type ClassroomExpandRowProps = {
  classroom: classroom;
  students: student[];
  colSpan: number;
};

export default function ClassroomExpandRow({ classroom, students, colSpan }: ClassroomExpandRowProps) {

  // Filtrar alunos
  const classroomActiveStudents = students.filter((s) => s.isActive && s.classroomId === classroom.id);
  const classroomInactiveStudents = students.filter((s) => !s.isActive && s.classroomId === classroom.id);

  // Ordenar alunos
  const sortedActiveStudents = classroomActiveStudents.sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
  )

  const sortedInactiveStudents = classroomInactiveStudents.sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
  )

  const allStudentsFromClassroom: student[] = sortedActiveStudents.concat(sortedInactiveStudents)

  console.log(allStudentsFromClassroom)

  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-3 bg-gray-50">
        <h3 className="font-semibold mb-2">Alunos da turma</h3>
        <ul className="list-disc pl-6 space-y-1">
          {allStudentsFromClassroom.length > 0 ? (
            allStudentsFromClassroom.map((s) => <li key={s.id}>{s.name}</li>)
          ) : (
            <li className="text-gray-500">Nenhum aluno associado.</li>
          )}
        </ul>
        <p className="mt-2 text-sm text-gray-600">
          Total: <strong>{allStudentsFromClassroom.length}</strong> aluno(s)
        </p>
      </td>
    </tr>
  );
}
