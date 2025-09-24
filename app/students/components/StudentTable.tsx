// app/students/components/StudentTable.tsx
"use client";

export default function StudentTable({ students, classes, onRemove }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Turma</th>
            <th className="px-4 py-2 text-left">Insígnia</th>
            <th className="px-4 py-2 text-left">Criado em</th>
            <th className="px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student: any) => (
            <tr key={student.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2">{student.name}</td>
              <td className="px-4 py-2">{classes.find((cls: any) => cls.id === student.classId)?.name || "—"}</td>
              <td className="px-4 py-2">{student.badge || "—"}</td>
              <td className="px-4 py-2">
                {student.createdAt?.toDate().toLocaleDateString() || "—"}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onRemove(student.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                Nenhum aluno cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
