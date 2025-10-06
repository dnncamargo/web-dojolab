// app/activities/components/StatusIcon.tsx

import React from 'react';
import { ActivityStatus } from '../../utils/types'; // Importando o tipo ActivityStatus

type StatusIconProps = {
  status: ActivityStatus;
};

// Mapeamento de status para classe de cor do Tailwind
const statusMap: Record<ActivityStatus, string> = {
  not_assigned: 'bg-gray-400', // Sem atribuição
  assigned: 'bg-blue-500',    // Atribuída
  in_progress: 'bg-yellow-500', // Em andamento
  completed: 'bg-green-500',   // Concluída
  cancelled: 'bg-black',     // Cancelada
};

export default function StatusIcon({ status }: StatusIconProps) {
  const colorClass = statusMap[status] || 'bg-gray-500';

  return (
    // Ícone de bolinha simples feito com CSS/Tailwind
    <div
      className={`h-2 w-2 rounded-full ${colorClass}`}
      title={`Status: ${status.replace('_', ' ')}`}
    />
  );
}