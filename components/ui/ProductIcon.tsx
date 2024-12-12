"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ProductIconProps {
  icon?: string;
  name: string;
}

export function ProductIcon({ icon, name }: ProductIconProps) {
  if (!icon) return null;

  return (
    <motion.div
      className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-4"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Image
        src={icon}
        alt={`${name} icon`}
        width={96}
        height={96}
        className="rounded-xl shadow-md"
      />
    </motion.div>
  );
}