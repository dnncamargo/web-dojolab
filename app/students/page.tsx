// app/students/page.tsx
"use client";

import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import { useStudents } from "../hooks/useStudents";
import { useClasses } from "../hooks/useClasses";

export default function StudentPage() {
  const { students, loading, addStudent, updateStudent, removeStudent } = useStudents();
  const { classes, loading: classesLoading } = useClasses();

  return (
    <div>

      <h1 className="title-section">Cadastro de Alunos</h1>

      <StudentForm 
        onAdd={addStudent} 
        classes={classes} 
        loading={classesLoading} 
      />

      {loading ? (
        <p className="body-text">Carregando alunos...</p>
      ) : (
        <StudentTable 
          students={students} 
          classes={classes}
          onRemove={removeStudent} 
          onUpdate={updateStudent} 
        />
      )}
    </div>
  );
}
