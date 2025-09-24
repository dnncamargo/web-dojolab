// app/teams/page.tsx
"use client";

import TeamsForm from "./components/TeamsForm";
import TeamsTable from "./components/TeamsTable";
import { useTeams } from "../hooks/useTeams";
import { useStudents } from "../hooks/useStudents";

export default function TeamsPage() {
  const { teams, loading, addTeam, removeTeam } = useTeams();
  const { students, loading: studentsLoading } = useStudents();

  return (
    <div>
      <h1 className="title-section">Cadastro de Equipes</h1>

      <TeamsForm onAdd={addTeam} />

      {loading ? (
        <p className="body-text">Carregando equipes...</p>
      ) : (
        <TeamsTable teams={teams} students={students} onRemove={removeTeam} />
      )}

      {studentsLoading && <p className="body-text">Carregando alunos...</p>}
    </div>
  );
}
