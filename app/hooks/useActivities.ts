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
  deleteField 
} from "firebase/firestore";
import { activity, ActivityStatus, scoringResult } from "../utils/types";
import { calculatePodium, validateAllCriteriaFilled } from "../utils/scoring";

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
    status: (data.status ?? "not_assigned") as ActivityStatus,
    date,
    timed: data.timed ?? false,
    graded: data.graded ?? false,
    assessment: (data.assessment ?? []) as activity["assessment"],
    descriptionType: data.descriptionType ?? "",
    tags: (data.tags ?? []) as string[],
    results: data.results ?? null,
    podium: data.podium ?? undefined,
    createdAt,
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


  /**
   * Duplica uma activity com novos id, date e createdAt.
   * classroomId fica null.
   */
  const duplicateActivity = async (source: activity) => {
    const newData: Omit<activity, "id" | "createdAt"> = {
      title: source.title,
      description: source.description,
      classroomId: undefined,
      status: "not_assigned",
      date: new Date(),
      timed: source.timed,
      graded: source.graded,
      assessment: source.assessment,
      descriptionType: source.descriptionType,
      tags: source.tags, 
    };
    await addActivity(newData);
  };

  async function handleFinalize(activity: activity, results: scoringResult[]) {
    if (!validateAllCriteriaFilled(activity, results)) {
      alert("Preencha todos os critérios antes de finalizar.");
      return;
    }
    setLoading(true);
    try {
      const { studentPodium, teamPodium } = calculatePodium(activity, results);
      await updateDoc(doc(db, "activities", activity.id), {
        status: "completed",
        results,
        podium: { studentPodium, teamPodium },
        finalizedAt: serverTimestamp(),
      });
    } finally {
      setLoading(false);
    }
  }

async function handleCancel(activity: activity) {
  // 1. Exibir Alerta de Confirmação
  const confirmCancel = window.confirm(
    "ATENÇÃO: Ao cancelar esta atividade, o status será alterado para 'cancelled' e todos os dados de resultados (results, podium e finalizedAt) serão apagados permanentemente, caso existam. Deseja continuar?"
  );

  if (!confirmCancel) {
    // Se o usuário clicar em "Cancelar" no alerta, interrompe a função
    setLoading(false); // Garante que o loading seja desligado, se estiver ligado
    return;
  }

  try {
    // 2. Definir os campos a serem removidos
    // O 'deleteField()' é usado para remover campos de um documento
    await updateDoc(doc(db, "activities", activity.id), {
      status: "cancelled", // Define o novo status
      results: deleteField(),
      podium: deleteField(),
      finalizedAt: deleteField(),
    });

    // O restante do seu hook pode ter a lógica para atualizar o estado local,
    // como re-fetch das atividades ou atualização otimista.

    console.log(`Atividade ${activity.id} cancelada e dados de resultado removidos.`);

  } catch (error) {
    console.error("Erro ao cancelar a atividade:", error);
    // Adicionar um tratamento de erro ou alerta para o usuário, se necessário
    alert("Ocorreu um erro ao cancelar a atividade. Tente novamente.");

  } finally {
    // 3. Desativar o estado de carregamento
    setLoading(false);
  }
}

  return {
    activities,
    loading,
    addActivity,
    updateActivity,
    removeActivity,
    duplicateActivity,
    handleFinalize,
    handleCancel
  };
}
