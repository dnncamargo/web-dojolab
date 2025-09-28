// hooks/useActivities.ts
"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { activity } from "../utils/types";

/**
 * remove chaves com valor `undefined` (preserva null/0/false)
 */
function clean<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const copy: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      // key assertion para manter tipagem sem usar `any`
      copy[k as keyof T] = v as T[keyof T];
    }
  }
  return copy;
}

/**
 * Normaliza um QueryDocumentSnapshot do Firestore para o type `activity`,
 * garantindo que `date` e `createdAt` sejam objetos `Date`.
 */
function docToActivity(d: QueryDocumentSnapshot<DocumentData>): activity {
  const data = d.data();

  // date pode ser Timestamp (do Firestore) ou já um string/Date
  const rawDate = data.date;
  let date: Date;
  if (rawDate && typeof (rawDate as { toDate?: unknown }).toDate === "function") {
    // Firestore Timestamp -> Date
    date = (rawDate as { toDate: () => Date }).toDate();
  } else {
    // string/number/Date -> Date
    date = new Date(rawDate);
  }

  // createdAt similar
  const rawCreated = data.createdAt;
  let createdAt: Date;
  if (rawCreated && typeof (rawCreated as { toDate?: unknown }).toDate === "function") {
    createdAt = (rawCreated as { toDate: () => Date }).toDate();
  } else {
    createdAt = new Date(rawCreated);
  }

  // montamos o objeto activity (adapte os campos conforme seu tipo real)
  return {
    id: d.id,
    title: data.title ?? "",
    description: data.description ?? "",
    classroomId: data.classroomId ?? "",
    assessment: (data.assessment ?? []) as activity["assessment"],
    status: (data.status ?? "sem_atribuicao") as activity["status"],
    timeConfig: data.timeConfig ?? undefined,
    date,
    createdAt,
    results: data.results ?? null,
  } as activity;
}

export function useActivities() {
  const [activities, setActivities] = useState<activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ordena por createdAt desc para ter as mais recentes primeiro
    const q = query(collection(db, "activities"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => docToActivity(d));
      setActivities(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Adiciona uma nova activity.
   * Recebe Omit<activity, "id" | "createdAt"> — o hook injeta createdAt com serverTimestamp().
   */
  const addActivity = async (newActivity: Omit<activity, "id" | "createdAt">) => {
    // remove campos undefined (por segurança)
    const sanitized = clean(newActivity);

    // payload: converte Date -> Timestamp para o Firestore quando necessário
    const payload: DocumentData = { ...sanitized };

    if (Object.prototype.hasOwnProperty.call(payload, "date")) {
      const maybeDate = payload.date as unknown;
      if (maybeDate instanceof Date) {
        payload.date = Timestamp.fromDate(maybeDate);
      } else {
        // se por acaso veio string/number, converte para Date então Timestamp
        payload.date = Timestamp.fromDate(new Date(String(maybeDate)));
      }
    }

    // createdAt com serverTimestamp() (provider do Firestore)
    payload.createdAt = serverTimestamp();

    await addDoc(collection(db, "activities"), payload);
  };

  /**
   * Atualiza parcialmente uma activity.
   * Converte `date: Date` para Timestamp quando necessário.
   */
  const updateActivity = async (id: string, dataToUpdate: Partial<activity>) => {
    const sanitized = clean(dataToUpdate as Record<string, unknown>);

    const payload: DocumentData = { ...sanitized };

    if (Object.prototype.hasOwnProperty.call(payload, "date")) {
      const maybeDate = payload.date as unknown;
      if (maybeDate instanceof Date) {
        payload.date = Timestamp.fromDate(maybeDate);
      } else {
        payload.date = Timestamp.fromDate(new Date(String(maybeDate)));
      }
    }

    const ref = doc(db, "activities", id);
    await updateDoc(ref, payload);
  };

  const removeActivity = async (id: string) => {
    const ref = doc(db, "activities", id);
    await deleteDoc(ref);
  };

  return {
    activities,
    loading,
    addActivity,
    updateActivity,
    removeActivity,
  };
}
