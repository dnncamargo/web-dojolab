// app/hooks/useTeams.ts
"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export function useTeams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "teams"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setTeams(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function addTeam(name: string) {
    await addDoc(collection(db, "teams"), {
      name,
      members: [],
      createdAt: serverTimestamp(),
      active: true,
    });
  }

  async function removeTeam(id: string) {
    await deleteDoc(doc(db, "teams", id));
  }

  // toggle member: adiciona/remove studentId do array members da equipe
  async function toggleMember(teamId: string, studentId: string) {
    const teamRef = doc(db, "teams", teamId);
    const snap = await getDoc(teamRef);
    if (!snap.exists()) return;

    const members: string[] = snap.data()?.members || [];
    if (members.includes(studentId)) {
      await updateDoc(teamRef, { members: arrayRemove(studentId) });
    } else {
      await updateDoc(teamRef, { members: arrayUnion(studentId) });
    }
  }

  return { teams, loading, addTeam, removeTeam, toggleMember };
}
