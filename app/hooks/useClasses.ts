"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export interface Class {
  id: string;
  name: string;
}

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const snap = await getDocs(collection(db, "classes"));
        setClasses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Class[]);
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, []);

  return { classes, loading };
}
