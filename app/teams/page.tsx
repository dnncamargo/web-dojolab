// app/teams/page.tsx
"use client";

import { useMemo, useState } from "react"
import TeamsForm from "./components/TeamsForm";
import TeamsTable from "./components/TeamsTable";
import { useTeams } from "../hooks/useTeams";
import { useClassroom } from "../hooks/useClassroom";
import { useStudents } from "../hooks/useStudents";
import { ArrowDownAZ, Filter } from "lucide-react"
import { team } from "../utils/types";

export default function TeamsPage() {
  const { teams, loading: teamsLoading, addTeam, updateTeam, removeTeam } = useTeams();
  const { classrooms, loading: classroomsLoading } = useClassroom();
  const { students, loading: studentsLoading } = useStudents();

  // UI states
  const [showSort, setShowSort] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  const [sortKey, setSortKey] = useState<"name" | "classroom">("name")

  const [filterActive, setFilterActive] = useState<"" | "true" | "false">("")
  const [filterClassroom, setFilterClassroom] = useState<string>("")
  const [filterWithMembers, setFilterWithMembers] = useState<"" | "withMembers" | "withoutMembers">("")

  // apply filters + sort
  const filteredTeams = useMemo(() => {
    let list: team[] = [...teams]

    // filtrar por ativo/inativo
    if (filterActive === "true") {
      list = list.filter((t) => t.isActive)
    } else if (filterActive === "false") {
      list = list.filter((t) => !t.isActive)
    }

    // filtrar por turma
    if (filterClassroom) {
      list = list.filter((s) => s.classroomId === filterClassroom)
    }

    // filtrar por time
    if (filterWithMembers === "withMembers") {
      list = list.filter((t) =>
        t.members && t.members.length > 0);
    } else if (filterWithMembers === "withoutMembers") {
      list = list.filter((t) =>
        !t.members || t.members.length === 0)
    }

    // ordenação
    list.sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name)
        case "classroom":
          return (a.classroomId || "").localeCompare(b.classroomId || "")
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return list
  }, [teams, sortKey, filterActive, filterClassroom, filterWithMembers])

  return (
    <div>
      {/* Header com botões */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="title-section">Cadastro de Equipes</h1>
        <div className="flex">
          {/* Botão Ordenar */}
          <button
            onClick={() => setShowSort((s) => !s)}
            className={`p-2 ml-2 rounded transition ${showSort ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"}`}
            title="Ordenar"
          >
            <ArrowDownAZ className="w-5 h-5" />
          </button>

          {/* Botão Filtrar */}
          <button
            onClick={() => setShowFilter((f) => !f)}
            className={`p-2 ml-2 rounded transition ${showFilter ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"}`}
            title="Filtrar"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Painel de ordenação */}
      {showSort && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <label className="block text-sm font-medium mb-1">Ordenar por:</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
            className="border rounded p-2 w-full"
          >
            <option value="name">Nome</option>
            <option value="classroom">Turma</option>
          </select>
        </div>
      )}

      {/* Painel de filtros */}
      {showFilter && (
        <div className="mb-4 p-3 bg-gray-100 rounded grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Equipe Ativa</label>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as typeof filterActive)}
              className="border rounded p-2 w-full"
            >
              <option value="">Todos</option>
              <option value="true">Ativados</option>
              <option value="false">Desativados</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Turma</label>
            <select
              value={filterClassroom}
              onChange={(e) => setFilterClassroom(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="">Todas</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Com membros</label>
            <select
              value={filterWithMembers}
              onChange={(e) => setFilterWithMembers(e.target.value as typeof filterWithMembers)}
              className="border rounded p-2 w-full"
            >
              <option value="">Todos</option>
              <option value="with">Com membros</option>
              <option value="without">Sem membros</option>
            </select>
          </div>
        </div>
      )}

      <TeamsForm
        onAdd={addTeam}
        classrooms={classrooms}
        loading={classroomsLoading}
      />

      {teamsLoading ? (
        <p className="body-text">Carregando equipes...</p>
      ) : (
        <TeamsTable
          teams={filteredTeams}
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
