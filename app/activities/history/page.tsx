// app/activities/history/page.tsx
"use client"

import { useMemo } from "react";
import ActivityTable from "../components/ActivityTable"
import { useClassroom } from "../../hooks/useClassroom"
import { useActivities } from "../../hooks/useActivities"

export default function HistoryPage() {
    const { activities, updateActivity, removeActivity } = useActivities()
    const { classrooms, loading } = useClassroom()
    const sortedActivities = useMemo(() => {
        return [...activities].sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [activities]);


    return (
        <div>

            <h1 className="title-section">Histórico de Atividades</h1>

            <ActivityTable
                activities={sortedActivities}
                classrooms={classrooms}
                loadingClassrooms={loading}
                onUpdate={updateActivity}
                onDelete={removeActivity}
            />
        </div>
    )
}
