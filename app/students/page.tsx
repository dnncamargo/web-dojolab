// app/students/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import type { student } from "../utils/types"
import { useStudents } from "../hooks/useStudents";
import { useClassroom } from "../hooks/useClassroom";
import { useTeams } from "../hooks/useTeams";
import { useBadges } from "../hooks/useBadges";
import { ArrowDownAZ, Filter } from "lucide-react"
import { getCurrentClassroom, setCurrentClassroom } from "../utils/currentClassroom";

export default function StudentPage() {
  const { students, loading, addStudent, updateStudent, removeStudent, toggleBadge } = useStudents();
  const { classrooms, loading: classroomsLoading } = useClassroom();
  const { teams, toggleMember } = useTeams();
  const { badges } = useBadges();

  // UI states
  const [showSort, setShowSort] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  const [sortKey, setSortKey] = useState<"name" | "classroom">("name")

  const [filterActive, setFilterActive] = useState<"" | "true" | "false">("true")
  const [filterClassroom, setFilterClassroom] = useState<string>(getCurrentClassroom())
  const [filterBadge, setFilterBadge] = useState<string>("")
  const [filterTeam, setFilterTeam] = useState<"" | "included" | "not_included">("")

  useEffect(() => {
    setCurrentClassroom(getCurrentClassroom())
  }, []);

  // apply filters + sort
  const filteredStudents = useMemo(() => {
    let list: student[] = [...students]

    // filtrar por ativo/inativo
    if (filterActive === "true") {
      list = list.filter((s) => s.isActive)
    } else if (filterActive === "false") {
      list = list.filter((s) => !s.isActive)
    }

    // filtrar por turma
    if (filterClassroom) {
      list = list.filter((s) => s.classroomId === filterClassroom)
    }

    // filtrar por badge
    if (filterBadge) {
      list = list.filter((s) => s.badges?.includes(filterBadge))
    }

    // filtrar por time
    if (filterTeam === "included") {
      list = list.filter((s) =>
        teams.some((t) => t.members.includes(s.id))
      )
    } else if (filterTeam === "not_included") {
      list = list.filter((s) =>
        !teams.some((t) => t.members.includes(s.id))
      )
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
  }, [students, sortKey, filterActive, filterClassroom, filterBadge, filterTeam, teams])

  return (
    <div className="bg-gray-100 pl-6 pr-6">

      {/* Header com botões */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="title-section">Cadastro de Alunos</h1>
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
          <label className="block  text-sm font-medium mb-1">Ordenar por:</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
            className="border rounded bg-white p-2 w-full"
          >
            <option value="name">Nome</option>
            <option value="classroom">Turma</option>
          </select>
        </div>
      )}

      {/* Painel de filtros */}
      {showFilter && (
        <div className="mb-4 p-3 bg-gray-100 rounded grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Presença</label>
            <div className="flex border rounded-md border-gray-200 divide-x divide-gray-200">

              {/* Botão PRESENTES (Ativo) */}
              <button
                type="button"
                className={`
        flex-1 text-sm py-1 px-4 transition-colors duration-150
        ${filterActive === "true"
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                  }
rounded-l-md
      `}
                onClick={() => setFilterActive("true")}
              >
                Presentes Hoje
              </button>

              {/* Botão AUSENTES (Inativo) */}
              <button
                type="button"
                className={`
        flex-1 text-sm py-1 px-4 transition-colors duration-150
        ${filterActive === "false"
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                  }
      `}
                onClick={() => setFilterActive("false")}
              >
                Ausentes
              </button>


              {/* Botão TODOS */}
              <button
                type="button"
                className={`
        flex-1 text-sm py-1 px-4 transition-colors duration-150
        ${filterActive === ""
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                  }
                    rounded-r-md
      `}
                onClick={() => setFilterActive("")}
              >
                Todos
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Equipe</label>
            <div className="flex border rounded-md border-gray-200 divide-x divide-gray-200">

              {/* Botão Com Equipe */}
              <button
                type="button"
                className={`
        flex-1 text-sm py-1 px-4 transition-colors duration-150
        ${filterTeam === "included"
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                  }
rounded-l-md
      `}
                onClick={() => setFilterTeam("included")}
              >
                Com Equipe
              </button>

              {/* Botão Sem Equipe */}
              <button
                type="button"
                className={`
        flex-1 text-sm py-1 px-4 transition-colors duration-150
        ${filterTeam === "not_included"
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                  }
      `}
                onClick={() => setFilterTeam("not_included")}
              >
                Sem Equipe
              </button>

              {/* Botão Todos */}
              <button
                type="button"
                className={`
        flex-1 text-sm py-1 px-4 rounded-r transition-colors duration-150
        ${filterTeam === ""
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                  }
                    rounded-r-md
      `}
                onClick={() => setFilterTeam("")}
              >
                Todos
              </button>
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Turma</label>
            <select
              value={filterClassroom}
              onChange={(e) => {
                const selected = e.target.value;
                setFilterClassroom(selected);
                setCurrentClassroom(selected);
              }}
              className="bg-white border rounded p-1 w-full"
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
            <label className="block text-sm font-medium mb-1">Insígnias</label>
            <select
              value={filterBadge}
              onChange={(e) => setFilterBadge(e.target.value)}
              className="bg-white border rounded p-1 w-full"
            >
              <option value="">Todos</option>
              {badges.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      )}

      <StudentForm
        onAdd={addStudent}
        classrooms={classrooms}
        loading={classroomsLoading}
      />

      {loading ? (
        <p className="body-text">Carregando alunos...</p>
      ) : (
        <StudentTable
          students={filteredStudents}
          classrooms={classrooms}
          teams={teams}
          badges={badges}
          onUpdate={updateStudent}
          onRemove={removeStudent}
          onToggleTeam={async (teamId, studentId) => await toggleMember(teamId, studentId)}
          onToggleBadge={async (studentId, badgeId) => await toggleBadge(studentId, badgeId)}
        />
      )}
    </div>
  );
}
