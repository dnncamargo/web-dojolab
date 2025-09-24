"use client";

import { useClasses } from "../hooks/useClasses";
import { useStudents } from "../hooks/useStudents";
import ClassForm from "./components/ClassesForm";
import ClassTable from "./components/ClassesTable";

export default function ClassesPage() {
  const { classes, loading, addClass, removeClass } = useClasses();
  const { students, addStudent } = useStudents();

  // Quando CSV é carregado, cria alunos para a turma mais recente
  const handleUpload = async (studentLine: any[], className: string) => {
    if (!classes.length) return;

    // pega a turma mais recente (se essa for a regra)
    const classId = className;

    // garante que todas as inserções sejam feitas
    await Promise.all(
      studentLine.map((student) => addStudent(student.name, classId))
    );
  };

  return (
    <div>
      <h1 className="title-section">Cadastro de Turmas</h1>

      <ClassForm onAdd={addClass} onUpload={handleUpload} />

      {loading ? (
        <p className="body-text">Carregando turmas...</p>
      ) : (
        <ClassTable students={students} classes={classes} onRemove={removeClass} />
      )}
    </div>
  );
}
