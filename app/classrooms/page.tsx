"use client";

import { useClassroom } from "../hooks/useClassroom";
import { useStudents } from "../hooks/useStudents";
import ClassroomForm from "./components/ClassroomForm";
import ClassroomTable from "./components/ClassroomTable";

export default function ClassesPage() {
  const { classrooms, loading, addClassroom, updateClassroom, removeClassroom, handleUpload } = useClassroom();
  const { students } = useStudents();

  return (
    <div>
      <h1 className="title-section">Cadastro de Turmas</h1>

      <ClassroomForm 
        onAdd={async (classroomName: string) => { await addClassroom(classroomName); }} 
        onUpload={handleUpload} 
      />

      {loading ? (
        <p className="body-text">Carregando turmas...</p>
      ) : (
        <ClassroomTable 
          students={students} 
          classrooms={classrooms} 
          onUpdate={updateClassroom}
          onRemove={removeClassroom} 
        />
      )}
    </div>
  );
}
