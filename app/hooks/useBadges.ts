// app/hooks/useBadges.ts
"use client";

import { useState, useEffect } from "react";
import { badge } from "../utils/types";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export function useBadges() {
  const [badges, setBadges] = useState<badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "badges"), (snapshot) => {
      const list: badge[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<badge, "id">),
      }));
      setBadges(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addBadge = async (newBadge: Omit<badge, "id" | "createdAt">) => {
    await addDoc(collection(db, "badges"), {
      ...newBadge,
      createdAt: serverTimestamp(),
      isActive: true,
    });
  };

  const updateBadge = async (id: string, updated: Partial<badge>) => {
    await updateDoc(doc(db, "badges", id), updated);
  };

  const removeBadge = async (id: string) => {
    await deleteDoc(doc(db, "badges", id));
  };

  return { badges, loading, addBadge, updateBadge, removeBadge };
}
