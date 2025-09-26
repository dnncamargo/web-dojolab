// app/hooks/useClassroom.ts
"use client";

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
  orderBy,
} from "firebase/firestore";
import { classroom } from "../utils/types";

export function useClassroom() {
  const [classrooms, setClassrooms] = useState<classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "classrooms"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setClassrooms(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as classroom[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function addClassroom(name: string) {
    return await addDoc(collection(db, "classrooms"), {
      name,
      createdAt: serverTimestamp(),
    });
  }

  async function removeClassroom(id: string) {
    await deleteDoc(doc(db, "classrooms", id));
  }

  return { classrooms, loading, addClassroom, removeClassroom };
}
