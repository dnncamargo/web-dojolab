// app/hooks/useStudents.ts
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
  updateDoc,
} from "firebase/firestore";

export function useStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function addStudent(name: string, classId: string) {
    await addDoc(collection(db, "students"), {
      name,
      classId,
      createdAt: serverTimestamp(),
    });
  }

  async function updateStudent(id: string, data: any) {
    const studentRef = doc(db, "students", id);
    await updateDoc(studentRef, data);
  }

  async function removeStudent(id: string) {
    await deleteDoc(doc(db, "students", id));
  }

  // novo: upload CSV simplificado
  async function addStudentsFromCSV(file: File, classId: string) {
    const text = await file.text();
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    for (const name of lines) {
      await addStudent(name, classId);
    }
  }

  return { students, loading, addStudent, updateStudent, removeStudent, addStudentsFromCSV };
}
