"use client"

import ActivityForm from "./components/ActivityForm"
import ActivityTable from "./components/ActivityTable"
import { useClassroom } from "../hooks/useClassroom"
import { useActivities } from "../hooks/useActivities"

export default function ActivitiesPage() {
  const { activities, addActivity, updateActivity, removeActivity } = useActivities()
  const { classrooms, loading } = useClassroom()

  return (
    <div>

      <h1 className="title-section">Atividades</h1>

      <ActivityForm
        onAdd={addActivity}
      />

      <ActivityTable
        activities={activities}
        classrooms={classrooms}
        loadingClassrooms={loading}
        onUpdate={updateActivity}
        onDelete={removeActivity}
      />
    </div>
  )
}
