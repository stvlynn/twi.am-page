"use client";

import { motion } from "framer-motion";
import { ProductIcon } from "./ProductIcon";

interface ProductHeaderProps {
  name: string;
  domain: string;
  icon?: string;
}

export function ProductHeader({ name, domain, icon }: ProductHeaderProps) {
  return (
    <div className="p-6 text-center">
      <ProductIcon icon={icon} name={name} />
      <motion.h3
        className="text-2xl font-normal text-twitter-blue tracking-wider font-dotmatrix uppercase"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {name}
      </motion.h3>
    </div>
  );
}