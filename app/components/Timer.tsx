// app/components/Timer.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";

type Mode = "chronometer" | "alarm";

interface TimerProps {
  initialMode?: Mode;
}

const Timer: React.FC<TimerProps> = ({ initialMode = "chronometer" }) => {
  const [mode, setMode] = useState<Mode>(initialMode);

  // --- Cronômetro ---
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Marcações (laps)
  const [laps, setLaps] = useState<number[]>([]);

  // --- Alarme ---
  const [alarmTime, setAlarmTime] = useState("");
  const [now, setNow] = useState(new Date());

  // Atualiza o relógio do "alarme"
  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  // Lógica do cronômetro
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // Checa alarme
  useEffect(() => {
    if (mode === "alarm" && alarmTime) {
      const [h, m] = alarmTime.split(":").map(Number);
      if (
        h === now.getHours() &&
        m === now.getMinutes() &&
        now.getSeconds() === 0
      ) {
        alert("⏰ Alarme disparado!");
      }
    }
  }, [now, mode, alarmTime]);

  // Formatar segundos -> mm:ss
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleMark = () => {
    setLaps((prev) => [...prev, seconds]);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow w-full">
      {/* Controle de modos */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-3 py-1 rounded mr-2 ${
            mode === "chronometer" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("chronometer")}
        >
          Cronômetro
        </button>
        <button
          className={`px-3 py-1 rounded ml-2 ${
            mode === "alarm" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("alarm")}
        >
          Alarme
        </button>
      </div>

      {/* Exibição do modo */}
      {mode === "chronometer" && (
        <div className="text-center">
          <p className="text-5xl clock-digital text-gray-500 mb-4">
            {now.toLocaleTimeString("pt-BR")}
          </p>
          <p className="text-[12rem] clock-digital tracking-widest [font-variant-numeric: tabular-nums] font-bold mb-10">
            {formatTime(seconds)}
          </p>
          <div className="flex justify-center gap-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => setRunning(true)}
              disabled={running}
            >
              Iniciar
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded"
              onClick={() => setRunning(false)}
              disabled={!running}
            >
              Pausar
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={() => {
                setRunning(false);
                setSeconds(0);
                setLaps([]);
              }}
            >
              Resetar
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleMark}
              disabled={!running}
            >
              Marcar
            </button>
          </div>

          {/* Lista de marcações */}
          {laps.length > 0 && (
            <div className="mt-8 text-left max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">Marcações:</h3>
              <ul className="space-y-1">
                {laps.map((lap, index) => {
                  const prev = index === 0 ? 0 : laps[index - 1];
                  const diff = lap - prev;
                  return (
                    <li
                      key={index}
                      className="flex justify-between border-b pb-1 text-sm"
                    >
                      <span>
                        #{index + 1} - {formatTime(lap)}
                      </span>
                      <span className="text-gray-500">
                        (+{formatTime(diff)})
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {mode === "alarm" && (
        <div className="text-center">
          <p className="text-[1076426
          7´9754es '  -r+
          
          
       /   '   em] clock-digital mb-10">
            {now.toLocaleTimeString("pt-BR")}
          </p>
          <input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <p className="mt-2 text-gray-500">
            {alarmTime
              ? `Alarme definido para ${alarmTime}`
              : "Nenhum alarme definido"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Timer;
