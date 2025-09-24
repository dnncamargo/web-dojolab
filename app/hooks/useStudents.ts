"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    const snap = await getDocs(collection(db, "students"));
    setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  async function addStudent(name, classId) {
    await addDoc(collection(db, "students"), {
      name,
      classId,
      badge: null,
      createdAt: serverTimestamp(),
      historico: [],
    });
    fetchStudents();
  }

  async function removeStudent(id) {
    await deleteDoc(doc(db, "students", id));
    fetchStudents();
  }

  return {
    students,
    loading,
    addStudent,
    removeStudent,
  };
}
