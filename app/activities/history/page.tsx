// app/activities/history/page.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import ActivityTable from "../components/ActivityTable"
import { useClassroom } from "../../hooks/useClassroom"
import { useActivities } from "../../hooks/useActivities"
import type { activity, ActivityStatus } from "../../utils/types"
import { ArrowDownAZ, Filter } from "lucide-react"
import { getCurrentClassroom, setCurrentClassroom } from "../../utils/currentClassroom";

export default function HistoryPage() {
  const { activities, updateActivity, removeActivity, duplicateActivity } = useActivities()
  const { classrooms, loading } = useClassroom()


  // UI states
  const [showSort, setShowSort] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [sortKey, setSortKey] = useState<"title" | "classroom" | "date" | "status">("date")
  const [filterStatus, setFilterStatus] = useState<ActivityStatus | "">("")
  const [filterClassroom, setFilterClassroom] = useState<string>(getCurrentClassroom)

  useEffect(() => {
    setCurrentClassroom(getCurrentClassroom())
  }, []);

  // apply filters + sort
  const filteredActivities = useMemo(() => {
    let list: activity[] = [...activities]

    // filter by status
    if (filterStatus) {
      list = list.filter((a) => a.status === filterStatus)
    }

    // filter by classroom
    if (filterClassroom) {
      list = list.filter((a) => a.classroomId === filterClassroom)
    }

    // sort
    list.sort((a, b) => {
      switch (sortKey) {
        case "title":
          return a.title.localeCompare(b.title)
        case "classroom":
          return (a.classroomId || "").localeCompare(b.classroomId || "")
        case "status":
          return a.status.localeCompare(b.status)
        case "date":
        default:
          return a.date.getTime() - b.date.getTime()
      }
    })

    return list
  }, [activities, sortKey, filterStatus, filterClassroom])


  return (
    <div className="bg-gray-100 pl-6 pr-6">

      {/* Header com botões */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="title-section">Histórico de Atividades</h1>
        <div className="flex">
          {/* Botão Ordenar */}
          <button
            onClick={() => setShowSort((s) => !s)}
            className={`p-2 ml-2 rounded transition ${showSort ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"
              }`}
            title="Ordenar"
          >
            <ArrowDownAZ className="w-5 h-5" />
          </button>

          {/* Botão Filtrar */}
          <button
            onClick={() => setShowFilter((f) => !f)}
            className={`p-2 ml-2 rounded transition ${showFilter ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"
              }`}
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
            <option value="title">Título</option>
            <option value="classroom">Turma</option>
            <option value="date">Data</option>
            <option value="status">Status</option>
          </select>
        </div>
      )}

      {/* Painel de filtros */}
      {showFilter && (
        <div className="mb-4 p-3 bg-gray-100 rounded grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Filtrar por Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ActivityStatus | "")}
              className="border rounded p-2 w-full"
            >
              <option value="">Todos</option>
              <option value="not_assigned">Sem atribuição</option>
              <option value="assigned">Atribuída</option>
              <option value="in_progress">Em andamento</option>
              <option value="completed">Concluída</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Filtrar por Turma</label>
            <select
              value={filterClassroom}
              onChange={(e) => {
                setFilterClassroom(e.target.value)
                setCurrentClassroom(filterClassroom)
              }
              }
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
        </div>
      )}

      <ActivityTable
        activities={filteredActivities}
        classrooms={classrooms}
        loadingClassrooms={loading}
        onUpdate={updateActivity}
        onDelete={removeActivity}
        onCopy={duplicateActivity}
      />
    </div>
  )
}
