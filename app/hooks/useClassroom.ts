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
  updateDoc,
} from "firebase/firestore";
import { classroom } from "../utils/types";
import { useStudents } from "../hooks/useStudents";

export function useClassroom() {
  const [classrooms, setClassrooms] = useState<classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const { addStudent } = useStudents();

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
      isActive: true,
      createdAt: serverTimestamp(),
    });
  }

  // Quando CSV é carregado, cria alunos para a turma mais recente
  const handleUpload = async (studentLine: { name: string }[], classroomName: string) => {
    if (!classrooms.length) return;

    // pega a turma mais recente (se essa for a regra)
    const classroomId = classroomName;

    // garante que todas as inserções sejam feitas
    await Promise.all(
      studentLine.map((student) => addStudent(student.name, classroomId))
    );
  };

  async function updateClassroom(id: string, data: Partial<classroom>) {
    await updateDoc(doc(db, "classrooms", id), data);
  }

  async function removeClassroom(id: string) {
    await deleteDoc(doc(db, "classrooms", id));
  }

  return { classrooms, loading, addClassroom, updateClassroom, removeClassroom, handleUpload };
}
