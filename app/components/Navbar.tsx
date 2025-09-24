"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Fecha menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    
      <nav className="bg-white shadow rounded-lg p-1 flex gap-4 mb-6 justify-evenly items-center">
        <div className="text-xl font-bold text-gray-800">
          <h1 className="inline-h1 title-logo-0">the</h1>
          <h1 className="inline-h1 title-logo-1">Dojo</h1>
          <h1 className="inline-h1 title-logo-2">LAB.</h1>
        </div>

        <div className="flex gap-12 relative" ref={menuRef}>
          {/* Sala de Aula */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("classroom")}
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition"
            >
              Sala de Aula <ChevronDown size={16} />
            </button>

            <AnimatePresence>
              {openMenu === "classroom" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg p-3 w-64"
                >
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link href="/students" className="hover:text-indigo-600">
                        Alunos
                      </Link>
                    </li>
                    <li>
                      <Link href="/classes" className="hover:text-indigo-600">
                        Turmas
                      </Link>
                    </li>
                    <li>
                      <Link href="/teams" className="hover:text-indigo-600">
                        Equipes
                      </Link>
                    </li>
                    <li>
                      <Link href="/awards" className="hover:text-indigo-600">
                        Insígnias
                      </Link>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Atividades */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("activities")}
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition"
            >
              Atividades <ChevronDown size={16} />
            </button>

            <AnimatePresence>
              {openMenu === "activities" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg p-3 w-64"
                >
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link
                        href="/activities/new"
                        className="hover:text-indigo-600"
                      >
                        Nova Atividade
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/activities/history"
                        className="hover:text-indigo-600"
                      >
                        Histórico
                      </Link>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

  );
}
