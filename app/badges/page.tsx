// app/badges/page.tsx
"use client";

import { useBadges } from "../hooks/useBadges";
import { useClassroom } from "../hooks/useClassroom";
import { useStudents } from "../hooks/useStudents";
import BadgeForm from "./components/BadgeForm";
import BadgeTable from "./components/BadgeTable";

export default function BadgesPage() {
  const { badges, loading, addBadge, updateBadge, removeBadge } = useBadges();
  const { students } = useStudents();
  const { classrooms } = useClassroom();

  return (
    <div className="bg-gray-100 pl-6 pr-6">
      <h1 className="title-section">Insígnias</h1>

      <BadgeForm onAdd={addBadge} />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <BadgeTable 
          badges={badges} 
          students={students}
          classrooms={classrooms}
          onRemove={removeBadge} 
          onUpdate={updateBadge} />
      )}
      <div className="ml-2 mt-4">Total: {badges.length} insígnias</div>
    </div>
  );
}
