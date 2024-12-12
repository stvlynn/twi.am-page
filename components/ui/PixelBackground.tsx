"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function PixelBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20 -z-10" />
      <motion.div
        className="absolute -inset-[100px] bg-gradient-radial from-twitter-blue/20 to-transparent blur-3xl"
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 200,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 50,
          mass: 0.5,
        }}
      />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
    </div>
  );
}
