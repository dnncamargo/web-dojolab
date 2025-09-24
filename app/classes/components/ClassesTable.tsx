"use client";

import React, { useState } from "react";

export default function ClassTable({ students, classes, onRemove }: {
  students: any[];
  classes: any[];
  onRemove: (classId: string) => void;
}) {
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);

  const toggleExpand = (classId: string) => {
    if (expandedClassId === classId) {
      setExpandedClassId(null);
    } else {
      setExpandedClassId(classId);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow p-4 mb-6 rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls: any) => (
            <React.Fragment key={cls.id}>
              <tr className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{cls.name}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => toggleExpand(cls.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    {expandedClassId === cls.id ? "Fechar" : "Ver Alunos"}
                  </button>
                  <button
                    onClick={() => onRemove(cls.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remover
                  </button>
                </td>
              </tr>

              {expandedClassId === cls.id && (
                <tr>
                  <td colSpan={2} className="bg-gray-50 px-4 py-3">
                    <h3 className="font-semibold mb-2">Alunos da turma</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {students
                        .filter((s: any) => s.classId === cls.id)
                        .map((s: any) => (
                          <li key={s.id}>{s.name}</li>
                        ))}
                      {students.filter((s: any) => s.classId === cls.id).length ===
                        0 && <li className="text-gray-500">Nenhum aluno associado.</li>}
                    </ul>
                    <h3 className="font-semibold mb-2 inline-block mr-2">Total: </h3>
                    <p className="mb-4 inline-block">{students.filter((s: any) => s.classId === cls.id).length} alunos</p>
                    
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {classes.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center py-4 text-gray-500">
                Nenhuma turma cadastrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
