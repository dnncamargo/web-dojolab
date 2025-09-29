// app/components/PodiumDisplay.tsx
"use client";

import React from 'react';

import type { PodiumEntry } from "../utils/types"; 

interface PodiumDisplayProps {
  title: string;
  entries: PodiumEntry[]; 
  entityMap: Record<string, { name: string }>;
  entityType: 'student' | 'team';
}

const PodiumDisplay: React.FC<PodiumDisplayProps> = ({ title, entries, entityMap, entityType }) => {
  if (!entries || entries.length === 0) {
    return <div className="p-4 bg-white rounded-lg shadow">{title}: Nenhuma pontuação registrada.</div>;
  }

  // Define os ícones para os 3 primeiros
  const medalIcons = ['🥇', '🥈', '🥉'];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-blue-700">{title}</h2>
      <ol className="list-none space-y-3">
        {entries.map((entry, index) => {
          const entity = entityMap[entry.id];
          const name = entity ? entity.name : `[${entityType} ID: ${entry.id}]`;
          const isTop3 = index < 3;

          return (
            <li
              key={entry.id}
              className={`flex justify-between items-center p-3 rounded-lg ${isTop3 ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-50'}`}
            >
              <span className="flex items-center gap-3 font-semibold">
                {isTop3 ? (
                  <span className="text-2xl">{medalIcons[index]}</span>
                ) : (
                  <span className="w-6 text-center text-gray-500">{index + 1}.</span>
                )}
                {name}
              </span>
              <span className={`text-lg font-bold ${isTop3 ? 'text-yellow-700' : 'text-gray-600'}`}>
                {entry.score} pts
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default PodiumDisplay;