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
            if (h === now.getHours() && m === now.getMinutes() && now.getSeconds() === 0) {
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

    return (
        <div className="p-4 bg-white rounded-xl shadow w-full">
            {/* Controle de modos */}
            <div className="flex justify-center gap-4 mb-4">
                <button
                    className={`px-3 py-1 rounded ${mode === "chronometer" ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                    onClick={() => setMode("chronometer")}
                >
                    Cronômetro
                </button>
                <button
                    className={`px-3 py-1 rounded ${mode === "alarm" ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                    onClick={() => setMode("alarm")}
                >
                    Alarme
                </button>
            </div>

            {/* Exibição do modo */}
            {mode === "chronometer" && (
                <div className="text-center">
                    <p className="text-4xl font-mono text-gray-400 mb-2">
                        {now.toLocaleTimeString("pt-BR")}
                    </p>
                    <p className="text-9xl font-mono  mb-4">{formatTime(seconds)}</p>
                    <div className="flex justify-center gap-2">
                        <button
                            className="px-3 py-1 bg-green-600 text-white rounded"
                            onClick={() => setRunning(true)}
                            disabled={running}
                        >
                            Iniciar
                        </button>
                        <button
                            className="px-3 py-1 bg-yellow-500 text-white rounded"
                            onClick={() => setRunning(false)}
                            disabled={!running}
                        >
                            Pausar
                        </button>
                        <button
                            className="px-3 py-1 bg-red-600 text-white rounded"
                            onClick={() => {
                                setRunning(false);
                                setSeconds(0);
                            }}
                        >
                            Resetar
                        </button>
                    </div>
                </div>
            )}

            {mode === "alarm" && (
                <div className="text-center">
                    <p className="text-9xl font-mono mb-2">
                        {now.toLocaleTimeString("pt-BR")}
                    </p>
                    <input
                        type="time"
                        value={alarmTime}
                        onChange={(e) => setAlarmTime(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <p className="mt-2 text-gray-500">
                        {alarmTime ? `Alarme definido para ${alarmTime}` : "Nenhum alarme definido"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Timer;
