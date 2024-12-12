"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

interface CardLinkProps {
  index: number;
  href: string;
  children: React.ReactNode;
}

export function CardLink({ index, href, children }: CardLinkProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <Link 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block h-full"
    >
      <motion.div
        ref={ref}
        custom={index}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={variants}
        whileHover={{ scale: 1.02 }}
        className="h-full"
      >
        {children}
      </motion.div>
    </Link>
  );
}