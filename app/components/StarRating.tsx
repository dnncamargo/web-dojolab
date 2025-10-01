// app/components/StarRating.tsx
"use client";

//import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from 'lucide-react'

type StarRatingProps = {
  value: number;
  onChange: (val: number) => void;
};

export default function StarRating({ value, onChange }: StarRatingProps) {
  const toggle = (index: number) => {
    if (value === index + 1) {
      onChange(index); // apaga a última clicada
    } else {
      onChange(index + 1); // acende até a clicada
    }
  };

  return (
    <div className="flex gap-1">
      {[0, 1, 2, 4, 5].map((i) => (
        <StarSolid
          key={i}
          className={`cursor-pointer ${
            i < value ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => toggle(i)}
          size={20}
        />
      ))}
    </div>
  );
}
