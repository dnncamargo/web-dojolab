// app/students/page.tsx
"use client";

import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import { useStudents } from "../hooks/useStudents";
import { useClassroom } from "../hooks/useClassroom";
import { useTeams } from "../hooks/useTeams";
import { useBadges } from "../hooks/useBadges";

export default function StudentPage() {
  const { students, loading, addStudent, updateStudent, removeStudent, toggleBadge } = useStudents();
  const { classrooms, loading: classroomsLoading } = useClassroom();
  const { teams, toggleMember } = useTeams();
  const { badges } = useBadges();

  return (
    <div>

      <h1 className="title-section">Cadastro de Alunos</h1>

      <StudentForm
        onAdd={addStudent}
        classrooms={classrooms}
        loading={classroomsLoading}
      />

      {loading ? (
        <p className="body-text">Carregando alunos...</p>
      ) : (
        <StudentTable
          students={students}
          classrooms={classrooms}
          teams={teams}
          badges={badges}
          onRemove={removeStudent}
          onUpdate={updateStudent}
          onToggleTeam={async (teamId, studentId) => await toggleMember(teamId, studentId)}
          onToggleBadge={async (studentId, badgeId) => await toggleBadge(studentId, badgeId)}
        />
      )}
    </div>
  );
}
