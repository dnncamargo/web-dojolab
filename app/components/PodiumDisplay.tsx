// app/components/DisplayPodium.tsx
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export type PodiumEntry = { id: string; score: number };
export type EntityMap = Record<string, { name: string; avatarUrl?: string }>;

type DisplayPodiumProps = {
  title?: string;
  entries: PodiumEntry[];
  entityMap: EntityMap;
};

const COLORS = {
  1: "bg-yellow-300 text-yellow-900",
  2: "bg-gray-200 text-gray-800",
  3: "bg-amber-600 text-white",
  other: "bg-slate-200 text-slate-800",
};

function getAvatarGradient(seed: string) {
  const colors = [
    ["#fbbf24", "#f59e0b"],
    ["#60a5fa", "#3b82f6"],
    ["#34d399", "#10b981"],
    ["#f472b6", "#ec4899"],
    ["#a78bfa", "#8b5cf6"],
    ["#f87171", "#ef4444"],
  ];
  const idx = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return `linear-gradient(135deg, ${colors[idx][0]}, ${colors[idx][1]})`;
}

// Quebra o nome em até duas linhas
function splitName(name: string): string[] {
  if (name.length <= 12) return [name];
  const mid = Math.floor(name.length / 2);
  const before = name.lastIndexOf(" ", mid);
  const after = name.indexOf(" ", mid);
  let splitIndex = before > 0 ? before : after > 0 ? after : mid;
  return [name.slice(0, splitIndex).trim(), name.slice(splitIndex).trim()];
}

export default function DisplayPodium({
  title = "Pódio",
  entries,
  entityMap,
}: DisplayPodiumProps) {
  // Agrupa por score
  const grouped = useMemo(() => {
    const map = new Map<number, PodiumEntry[]>();
    for (const e of entries) {
      if (!map.has(e.score)) map.set(e.score, []);
      map.get(e.score)!.push(e);
    }
    const scores = Array.from(map.keys()).sort((a, b) => b - a);
    return scores.map((score, idx) => ({
      score,
      placement: idx + 1,
      items: map.get(score)!,
    }));
  }, [entries]);

  if (!entries?.length) {
    return (
      <div className="p-6 bg-white shadow rounded-xl text-center text-gray-500">
        {title}: nenhum resultado.
      </div>
    );
  }

  // largura dinâmica pelo maior nome
  const maxChars = Math.max(
    ...entries.map((e) => (entityMap[e.id]?.name || "").length)
  );
  const minWidth = Math.min(150, maxChars * 9); // limite inferior
  const maxWidth = Math.max(200, maxChars * 12); // limite superior

  return (
    <div className="p-6 mb-14 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold mb-8 text-center">{title}</h2>

      <div className="flex items-end justify-center gap-6 flex-wrap">
        {grouped.map(({ score, placement, items }, idx) => {
          const color =
            COLORS[placement as 1 | 2 | 3] ?? COLORS.other;

          const heightBase = 240;
          const height = Math.max(120, heightBase - idx * 24);

          return (
            <motion.div
              key={placement}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 * (grouped.length - idx) }}
              className="flex flex-col items-center"
            >
              {/* Número acima do degrau */}
              <div className="text-5xl font-extrabold">#{placement}</div>

              {/* Degrau */}
              <div
                className={`rounded-t-xl p-4 flex flex-col items-center shadow-md ${color}`}
                style={{
                  minWidth,
                  maxWidth,
                  height,
                }}
              >
                <div className="text-lg font-bold mb-2">{score} pts</div>

                {/* Lava Lamp - animação dos nomes */}
                <div className="flex flex-wrap justify-center gap-2 relative">
                  {items.map((ent, i) => {
                    const name = entityMap[ent.id]?.name ?? ent.id;
                    const parts = splitName(name);
                    const gradient = getAvatarGradient(ent.id);

                    return (
                      <motion.div
                        key={ent.id}
                        className="px-3 py-1 rounded-lg shadow text-sm font-semibold bg-white/90 text-slate-800 text-center"
                        style={{ background: gradient, color: "white" }}
                        animate={{
                          y: [0, -6, 6, 0],
                          x: [0, 4, -4, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 4 + i,
                          delay: i * 0.3,
                        }}
                      >
                        {parts.map((p, idx) => (
                          <div key={idx}>{p}</div>
                        ))}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
