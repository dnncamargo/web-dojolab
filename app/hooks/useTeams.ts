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
} from "firebase/firestore";
import { team } from "../utils/types";

export function useTeams() {
  const [teams, setTeams] = useState<team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "teams"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setTeams(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as team[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function addTeam(name: string) {
    await addDoc(collection(db, "teams"), {
      name,
      createdAt: serverTimestamp(),
    });
  }

  async function removeTeam(id: string) {
    await deleteDoc(doc(db, "teams", id));
  }

  return { teams, loading, addTeam, removeTeam };
}
