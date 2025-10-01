// app/hooks/useClassroom.ts
"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  where,
  deleteDoc,
} from "firebase/firestore";
import { classroom } from "../utils/types";

export function useClassroom() {
  const [classrooms, setClassrooms] = useState<classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "classrooms"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name ?? "",
          createdAt: data.createdAt?.toDate() ?? new Date(),
          isActive: data.active ?? true,
        } as classroom;
      });
      setClassrooms(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
  * Adiciona uma turma. Se já existir com mesmo nome, retorna a existente.
  */
  async function addClassroom(classroomName: string) {

    // Normaliza o nome (para evitar duplicados com maiúsculas/minúsculas diferentes)
    const normalizedName = classroomName.trim();

    // Verifica se já existe no Firestore
    const q = query(
      collection(db, "classrooms"),
      where("name", "==", normalizedName)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Já existe, retorna a primeira encontrada
      const docData = snapshot.docs[0];
      return {
        id: docData.id,
        name: docData.data().name,
        createdAt: docData.data().createdAt?.toDate() ?? new Date(),
        isActive: docData.data().active ?? true,
      };
    }

    // Caso não exista, cria uma nova
    const newClassroom = {
      name: normalizedName,
      createdAt: serverTimestamp(),
      active: true,
    };

    const docRef = await addDoc(collection(db, "classrooms"), newClassroom);

    return {
      id: docRef.id,
      name: normalizedName,
      createdAt: new Date(),
      isActive: true,
    };
  }

  async function updateClassroom(id: string, data: Partial<classroom>) {
    await updateDoc(doc(db, "classrooms", id), data);
  }

  async function removeClassroom(id: string) {
    await deleteDoc(doc(db, "classrooms", id));
  }

  return { classrooms, loading, addClassroom, updateClassroom, removeClassroom };
}
