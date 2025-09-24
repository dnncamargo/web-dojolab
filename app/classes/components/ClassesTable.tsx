"use client";

export default function ClassTable({ classes, onRemove }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Criado em</th>
            <th className="px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls: any) => (
            <tr
              key={cls.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-2">{cls.name}</td>
              <td className="px-4 py-2">
                {cls.createdAt?.toDate
                  ? cls.createdAt.toDate().toLocaleDateString()
                  : "—"}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onRemove(cls.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
          {classes.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                Nenhuma turma cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
