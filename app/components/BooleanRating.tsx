// app/components/BooleanRating.tsx
"use client";

type BooleanRatingProps = {
  value: boolean | null;
  onChange: (val: boolean) => void;
};

export default function BooleanRating({ value, onChange }: BooleanRatingProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={`px-2 py-1 rounded ${value === true ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        onClick={(e) => { onChange(true) }}
      >
        ✓
      </button>
      <button
        type="button"
        className={`px-2 py-1 rounded ${value === false ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        onClick={() => onChange(false)}
      >
        ✕
      </button>
    </div>
  );
}
