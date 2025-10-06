// app/activities/components/ActivityCalendar.tsx
"use client";

import React, { useMemo } from 'react';
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'dayjs/locale/pt-br';
import { activity } from '../../utils/types';
import CalendarActivityCard from './CalendarActivityCard';

// Função de utilidade para ajustar o fuso horário (Timezone compensation)
// É crucial para eventos 'allDay' quando a data é salva como UTC (como é comum com o Firebase/Date inputs),
// para garantir que a data não seja deslocada para o dia anterior no fuso horário local.
function localiseDate(date: Date): Date {
  // Cria uma nova instância de Date a partir da original
  const newDate = new Date(date);
  
  // Adiciona o offset do fuso horário local (em milissegundos) ao timestamp da data.
  // Isso "empurra" o tempo para frente, compensando o fuso horário e garantindo
  // que o dia correto seja exibido localmente (como "meia-noite local").
  newDate.setTime(newDate.getTime() + newDate.getTimezoneOffset() * 60 * 1000);
  
  return newDate;
}

// Configuração do localizer para dayjs em português
dayjs.locale('pt-br');
const localizer = dayjsLocalizer(dayjs);

type ActivityCalendarProps = {
  activities: activity[];
};

export default function ActivityCalendar({ activities }: ActivityCalendarProps) {
  // Mapeia as atividades para o formato de evento do react-big-calendar
  const events = useMemo(() => activities.map(act => {
    // 1. Aplica a compensação de fuso horário à data
    const localDate = localiseDate(act.date); 
    
    return {
      ...act,
      // 2. Usa a data ajustada como "start" e "end"
      start: localDate, 
      end: localDate,   
      allDay: true, 
    }
  }), [activities]);

  return (
    <div className="h-[700px] w-full bg-white p-4 rounded-lg shadow-lg">
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={Views.MONTH}
        views={[Views.MONTH]} 
        toolbar={true}
        culture="pt-BR"
        startAccessor="start"
        endAccessor="end"
        components={{
          month: {
            event: CalendarActivityCard,
          },
          event: CalendarActivityCard,
        }}
        messages={{
          allDay: 'Dia todo',
          previous: 'Anterior',
          next: 'Próximo',
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          date: 'Data',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'Não há atividades neste período.',
        }}
      />
    </div>
  );
}