"use client";

// app/teams/page.jsx
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState("");

  useEffect(() => {
    const q = query(collection(db, "teams"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setTeams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  async function addTeam() {
    if (!newTeam) return;
    await addDoc(collection(db, "teams"), {
      name: newTeam,
      badge: newBadge || "⭐",
      createdAt: serverTimestamp(),
      members: [] // lista de IDs de alunos
    });
    setNewTeam("");
  }

  async function removeTeam(id) {
    await deleteDoc(doc(db, "teams", id));
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cadastro de Equipes</h1>

      {/* Formulário */}
      <TeamsForm onAdd={addTeam} />

      {/* Lista */}
      <TeamsTable teams={teams} onRemove={removeTeam} />

    </div>
  );
}
