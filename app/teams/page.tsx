// app/teams/page.tsx
"use client";

import TeamsForm from "./components/TeamsForm";
import TeamsTable from "./components/TeamsTable";
import { useTeams } from "../hooks/useTeams";
import { useClassroom } from "../hooks/useClassroom";
import { useStudents } from "../hooks/useStudents";

export default function TeamsPage() {
  const { teams, loading: teamsLoading, addTeam, updateTeam, removeTeam } = useTeams();
  const { classrooms, loading: classroomsLoading } = useClassroom();
  const { students, loading: studentsLoading } = useStudents();

  return (
    <div>
      <h1 className="title-section">Cadastro de Equipes</h1>

      <TeamsForm 
        onAdd={addTeam}  
        classrooms={classrooms} 
        loading={classroomsLoading} 
      />

      {teamsLoading ? (
        <p className="body-text">Carregando equipes...</p>
      ) : (
        <TeamsTable 
          teams={teams} 
          students={students} 
          classrooms={classrooms}
          onUpdate={updateTeam}
          onRemove={removeTeam} 
        />
      )}

      {studentsLoading && <p className="body-text">Carregando alunos...</p>}
    </div>
  );
}
