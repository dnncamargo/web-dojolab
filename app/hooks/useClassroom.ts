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
  getDocs,
  where,
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
      setClassrooms(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as classroom[]
      );
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /**
   * Cria ou retorna turma existente pelo nome.
   */
  async function addClassroom(name: string) {
    const normalized = name.trim();

    // procura no Firestore por turma já existente
    const q = query(collection(db, "classrooms"), where("name", "==", normalized));
    const existing = await getDocs(q);

    if (!existing.empty) {
      // retorna o doc existente
      const docSnap = existing.docs[0];
      return {...(docSnap.data() as classroom) };
      //return {id: docSnap.id, ...(docSnap.data() as classroom) };
    }

    // cria nova turma
    const docRef = await addDoc(collection(db, "classrooms"), {
      name: normalized,
      active: true,
      createdAt: serverTimestamp(),
    });

    return { id: docRef.id, name: normalized, active: true, createdAt: new Date() };
  }

  /**
   * Upload CSV → cria alunos em turma já existente ou cria nova turma e adiciona.
   */
  async function handleUpload(studentLines: { name: string }[], classroomName: string) {
    const classroom = await addClassroom(classroomName); // já resolve existente ou cria
    const classroomId = classroom.id;

    // garante inserção de todos os alunos
    await Promise.all(
      studentLines.map((student) => addStudent(student.name, classroomId))
    );
  }

  async function updateClassroom(id: string, data: Partial<classroom>) {
    await updateDoc(doc(db, "classrooms", id), data);
  }

  async function removeClassroom(id: string) {
    await deleteDoc(doc(db, "classrooms", id));
  }

  return {
    classrooms,
    loading,
    addClassroom,
    updateClassroom,
    removeClassroom,
    handleUpload,
  };
}
