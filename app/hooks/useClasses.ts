// app/hooks/useClasses.ts
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

export function useClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "classes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setClasses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function addClass(name: string) {
    return await addDoc(collection(db, "classes"), {
      name,
      createdAt: serverTimestamp(),
    });
  }

  async function removeClass(id: string) {
    await deleteDoc(doc(db, "classes", id));
  }

  return { classes, loading, addClass, removeClass };
}
