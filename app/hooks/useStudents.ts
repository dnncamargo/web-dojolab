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
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { student } from "../utils/types";

export function useStudents() {
  const [students, setStudents] = useState<student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setStudents(snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<student, "id">),
      })) as student[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function addStudent(name: string, classId: string) {
    await addDoc(collection(db, "students"), {
      name,
      classId,
      createdAt: serverTimestamp(),
      badges: [],
      active: true,
    });
  }

  async function removeStudent(id: string) {
    await deleteDoc(doc(db, "students", id));
  }

  async function updateStudent(id: string, data: Partial<student>) {
    const ref = doc(db, "students", id);
    await updateDoc(ref, data);
  }

  // toggle badge: adiciona/remove badgeId do array badges do aluno
  async function toggleBadge(studentId: string, badgeId: string) {
    const studentRef = doc(db, "students", studentId);
    const snap = await getDoc(studentRef);
    if (!snap.exists()) return;

    const badges: string[] = snap.data()?.badges || [];
    if (badges.includes(badgeId)) {
      await updateDoc(studentRef, { badges: arrayRemove(badgeId) });
    } else {
      await updateDoc(studentRef, { badges: arrayUnion(badgeId) });
    }
  }

  return {
    students,
    loading,
    addStudent,
    removeStudent,
    updateStudent,
    toggleBadge,
  };
}
