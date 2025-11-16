"use client";
import React, { useEffect } from "react";
import "@/lib/transform.css";

const CursorDots = () => {
  useEffect(() => {
    const container = document.querySelector(".cursor-dots-container");

    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      // Clear existing dots
      container.innerHTML = "";

      // Create new dots based on cursor position
      for (let i = 0; i < 5; i++) {
        const dot = document.createElement("div");
        dot.className = "cursor-dot";
        const size = 10 + i * 5; // Adjust the size based on distance
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        const x = clientX - size / 2;
        const y = clientY - size / 2;
        dot.style.transform = `translate(${x}px, ${y}px)`;
        container.appendChild(dot);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <div className="cursor-dots-container"></div>;
};

export default CursorDots;
