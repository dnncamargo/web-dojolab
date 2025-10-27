// app/components/StarRating.tsx
"use client";

//import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from 'lucide-react'
import { useState } from 'react';
import { motion } from "framer-motion";

type StarRatingProps = {
  value: number;
  onChange: (val: number) => void;
};

export default function StarRating({ value, onChange }: StarRatingProps) {

  const [superStarActive, setSuperStarActive] = useState(false);

  const toggle = (index: number) => {
    // Apaga a super estrela se alguma estrela normal for clicada 
    if (superStarActive) setSuperStarActive(false);

    if (value === index + 1) {
      onChange(index); // apaga a última clicada
    } else {
      onChange(index + 1); // acende até a clicada
    }
  };

  const toggleSuperStar = () => {
    const nextState = !superStarActive;
    setSuperStarActive(nextState);
    onChange(nextState ? 10 : 6); // super destaque = 10 pontos
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarSolid
          key={i}
          className={`cursor-pointer transition-transform ${
            i < value ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => toggle(i)}
          size={20}
        />
      ))}

      
      {/* ⭐ Sexta estrela (super destaque) */}
      <motion.div
        className="relative cursor-pointer"
        onClick={toggleSuperStar}
        animate={
          superStarActive
            ? { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1, 1.1, 1] }
            : { scale: 1, rotate: 0 }
        }
        transition={
          superStarActive
            ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
            : { duration: 0.2 }
        }
      >
        <StarSolid
          className={`transition-all duration-300 ${
            superStarActive ? "text-blue-500 drop-shadow-lg" : "text-white"
          }`}
          size={20}
        />
      </motion.div>
    </div>

  );
}
