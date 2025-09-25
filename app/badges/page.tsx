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
      <p className="body-text mb-4">Aqui você pode gerenciar as insígnias disponíveis no sistema.</p>

      <BadgeForm onAdd={addBadge} />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <BadgeTable badges={badges} onRemove={removeBadge} onUpdate={updateBadge} />
      )}
    </div>
  );
}
