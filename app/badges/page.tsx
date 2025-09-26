// app/badges/page.tsx
"use client";

import { useBadges } from "../hooks/useBadges";
import BadgeForm from "./components/BadgeForm";
import BadgeTable from "./components/BadgeTable";

export default function BadgesPage() {
  const { badges, loading, addBadge, updateBadge, removeBadge } = useBadges();

  return (
    <div>
      <h1 className="title-section">Insígnias</h1>

      <BadgeForm onAdd={addBadge} />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <BadgeTable badges={badges} onRemove={removeBadge} onUpdate={updateBadge} />
      )}
    </div>
  );
}
