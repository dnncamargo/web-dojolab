// app/page.tsx
"use client";

import ActivityInProgressTable from "./components/ActivityInProgressTable";
import { useActivities } from "./hooks/useActivities";
import { useClassroom } from "./hooks/useClassroom";

export default function Home() {

  const { activities } = useActivities();
  const { classrooms } = useClassroom();

  return (
    <div className="bg-gray-100">

      <h1 className="title-section">Atividades em Andamento</h1>

      <ActivityInProgressTable 
        activities={activities} 
        classrooms={classrooms}
      />

    </div>
  );
}

