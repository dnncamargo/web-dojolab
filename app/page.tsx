"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "./lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [activities, setActivities] = useState([]);

  return (
    <div className="bg-gray-100">

      <h1 className="title-section">Página Inicial</h1>

    </div>
  );
}
