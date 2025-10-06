// app/activities/components/CalendarActivityCard.tsx
import React from 'react';
import { activity } from '../../utils/types'; // Importando o tipo activity
import StatusIcon from './StatusIcon';

// O react-big-calendar (RBC) passa o objeto da atividade como 'event'
type CalendarActivityCardProps = {
  event: activity;
  title: string; // O RBC também passa o título já formatado
};

export default function CalendarActivityCard({ event }: CalendarActivityCardProps) {
  const { title, status } = event;

  // Estilização do card da aula, compacta para a visão mensal
  return (
    <div
      // Estilização condicional baseada no status para feedback visual
      className={`p-1 text-[10px] sm:text-xs font-medium rounded-md truncate cursor-pointer shadow-sm mb-0.5 
        ${status === 'completed' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
         status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500' :
         status === 'assigned' ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' :
         'bg-gray-100 text-gray-800 border-l-4 border-gray-400'
      }`}
      title={title}
    >
      <div className="flex items-center gap-1">
        <StatusIcon status={status} />
        <span className="truncate">{title}</span>
      </div>
    </div>
  );
}