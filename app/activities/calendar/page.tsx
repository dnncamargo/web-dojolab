// app/activities/page.tsx (Atualizado)
"use client"

import { useEffect, useMemo, useState } from "react"
import ActivityForm from "../components/ActivityForm"
import ActivityCalendar from "../components/ActivityCalendar"
import { useClassroom } from "../../hooks/useClassroom"
import { useActivities } from "../../hooks/useActivities"
import type { activity, ActivityStatus } from "../../utils/types"
import { Filter, Search, ArrowDownAZ } from "lucide-react" 
import { getCurrentClassroom, setCurrentClassroom } from "../../utils/currentClassroom";

export default function CalendarPage() {
  const { activities, addActivity } = useActivities()
  const { classrooms, loading } = useClassroom()

  // UI states
  const [showSort, setShowSort] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [sortKey, setSortKey] = useState<"title" | "classroom" | "date" | "status">("date")
  const [filterStatus, setFilterStatus] = useState<ActivityStatus | "">("")
  const [filterClassroom, setFilterClassroom] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("") 

  useEffect(() => {
    setCurrentClassroom(getCurrentClassroom())
  }, []);

  // Aplica filtros, busca e ordenação
  const filteredActivities = useMemo(() => {
    let list: activity[] = [...activities]

    // 1. Filtrar por status
    if (filterStatus) {
      list = list.filter((a) => a.status === filterStatus)
    }

    // 2. Filtrar por turma (classroom)
    if (filterClassroom) {
      list = list.filter((a) => a.classroomId === filterClassroom)
    }

    // 3. NOVO: Filtro de busca por nome da atividade e nome do aluno
    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        list = list.filter((a) => {
            // Busca por nome da atividade (title)
            const matchesTitle = a.title.toLowerCase().includes(lowerCaseSearchTerm);

            // Nota: Para filtrar por "nome do aluno", seria necessário ter a lista de `student[]`
            // e um mapeamento que linka a atividade aos alunos. Como essa informação
            // não está visível no `activity` ou no contexto, a busca é aplicada primariamente no título.
            // Para ser um filtro mais abrangente, incluímos também a descrição.
            const matchesDescription = a.description?.toLowerCase().includes(lowerCaseSearchTerm);
            const matchTags = (a.tags || []).some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
            return matchesTitle || matchesDescription || matchTags;
        });
    }

    // 4. Ordenar
    list.sort((a, b) => {
      switch (sortKey) {
        case "title":
          return a.title.localeCompare(b.title)
        case "classroom":
          // Comparação por classroomId
          return (a.classroomId ?? "").localeCompare(b.classroomId ?? "")
        case "date":
          return a.date.getTime() - b.date.getTime()
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    return list
  }, [activities, filterStatus, filterClassroom, sortKey, searchTerm]) // Adicionar searchTerm

  return (
    <div className="bg-gray-100 pl-6 pr-6">
      <h1 className="title-section flex justify-between items-center mb-4">
        Calendário de Atividades
      </h1>

      <ActivityForm
        onAdd={addActivity}
      />
      
      {/* Container de Filtros e Busca */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        
        {/* Input de Busca Imediata (Atividade/Aluno) */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome da atividade ou aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // O filtro é aplicado imediatamente no `useMemo`
            className="border rounded-lg pl-10 pr-4 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Botões de Filtro e Ordenação */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-1 p-2 border rounded-lg hover:bg-gray-100"
          >
            <Filter className="h-5 w-5" />
            Filtros
          </button>
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1 p-2 border rounded-lg hover:bg-gray-100"
          >
            <ArrowDownAZ className="h-5 w-5" />
            Ordenar
          </button>
        </div>
      </div>
      
      {/* Controles de Filtro (Mantido) */}
      {(showSort || showFilter) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50 mb-6">
          
          {showSort && (
            <div>
              <label className="block text-sm font-medium mb-1">Ordenar por</label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
                className="border rounded p-1 w-full"
              >
                <option value="date">Data</option>
                <option value="title">Título</option>
                <option value="classroom">Turma</option>
                <option value="status">Status</option>
              </select>
            </div>
          )}
          
          {showFilter && (
            <div>
              <label className="block text-sm font-medium mb-1">Filtrar por Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ActivityStatus | "")}
                className="border rounded p-1 w-full"
              >
                <option value="">Todos</option>
                <option value="not_assigned">Sem atribuição</option>
                <option value="assigned">Atribuída</option>
                <option value="in_progress">Em andamento</option>
                <option value="completed">Concluída</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          )}

          {showFilter && (
            <div>
              <label className="block text-sm font-medium mb-1">Filtrar por Turma</label>
              <select
                value={filterClassroom}
                onChange={(e) => {
                    const selected = e.target.value;
                    setFilterClassroom(selected);
                    setCurrentClassroom(selected);
                  }
                }
                className="border rounded p-1 w-full"
                disabled={loading}
              >
                <option value="">Todas</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* NOVO: Renderiza o componente de Calendário */}
      <ActivityCalendar
        activities={filteredActivities}
      />
      
    </div>
  )
}