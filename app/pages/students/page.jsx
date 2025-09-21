"use client"

import { useEffect, useState } from "react";
/*import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";*/

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [newName, setNewName] = useState("");
  const [newClass, setNewClass] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      const snap = await getDocs(collection(db, "students"));
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchStudents();
  }, []);

  async function addStudent() {
    if (!newName || !newClass) return;
    await addDoc(collection(db, "students"), {
      name: newName,
      classId: newClass,
      badge: null,
      createdAt: serverTimestamp(),
      historico: []
    });
    setNewName("");
    setNewClass("");
  }

  async function removeStudent(id) {
    await deleteDoc(doc(db, "students", id));
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cadastro de Alunos</h1>

      {/* Formulário de cadastro */}
      <div className="flex gap-2 mb-4">
        <input
          className="border px-2 py-1"
          placeholder="Nome do aluno"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <input
          className="border px-2 py-1"
          placeholder="Turma ID"
          value={newClass}
          onChange={e => setNewClass(e.target.value)}
        />
        <button
          onClick={addStudent}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Adicionar
        </button>
      </div>

      {/* Tabela de alunos */}
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2">Nome</th>
            <th className="border px-2">Turma</th>
            <th className="border px-2">Insígnia</th>
            <th className="border px-2">Criado em</th>
            <th className="border px-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td className="border px-2">{student.name}</td>
              <td className="border px-2">{student.classId}</td>
              <td className="border px-2">{student.badge || "—"}</td>
              <td className="border px-2">
                {student.createdAt?.toDate().toLocaleDateString() || "—"}
              </td>
              <td className="border px-2">
                <button
                  onClick={() => removeStudent(student.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remover
                </button>
                {/* TODO: Botão editar */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
