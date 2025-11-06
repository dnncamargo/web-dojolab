"use client";
import { useRef, useState } from "react";

export default function TouchDragTest() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX - pos.x, y: touch.clientY - pos.y };
    setDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || !touchStart.current) return;
    const touch = e.touches[0];
    setPos({
      x: touch.clientX - touchStart.current.x,
      y: touch.clientY - touchStart.current.y,
    });
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  return (
    <div
      className="w-screen h-screen bg-gray-100 overflow-hidden relative touch-none"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={boxRef}
        onTouchStart={handleTouchStart}
        className="absolute w-24 h-24 bg-blue-500 rounded-lg shadow-md text-white flex items-center justify-center select-none"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: dragging ? "none" : "transform 0.2s ease-out",
        }}
      >
        👆 Arraste
      </div>
    </div>
  );
}
