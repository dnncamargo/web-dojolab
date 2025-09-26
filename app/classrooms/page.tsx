"use client";

import { useClassroom } from "../hooks/useClassroom";
import { useStudents } from "../hooks/useStudents";
import ClassroomForm from "./components/ClassroomForm";
import ClassroomTable from "./components/ClassroomTable";

export default function ClassesPage() {
  const { classrooms, loading, addClassroom, removeClassroom } = useClassroom();
  const { students, addStudent } = useStudents();

  // Quando CSV é carregado, cria alunos para a turma mais recente
  const handleUpload = async (studentLine: { name: string }[], classroomName: string) => {
    if (!classrooms.length) return;

    // pega a turma mais recente (se essa for a regra)
    const classId = classroomName;

    // garante que todas as inserções sejam feitas
    await Promise.all(
      studentLine.map((student) => addStudent(student.name, classId))
    );
  };

  return (
    <div>
      <h1 className="title-section">Cadastro de Turmas</h1>

      <ClassroomForm onAdd={addClassroom} onUpload={handleUpload} />

      {loading ? (
        <p className="body-text">Carregando turmas...</p>
      ) : (
        <ClassroomTable students={students} classrooms={classrooms} onRemove={removeClassroom} />
      )}
    </div>
  );
}
