"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { TwitterIcon } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
}

export function HeroSection({ title, subtitle, description }: HeroSectionProps) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.section
      ref={ref}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-twitter-blue/5 to-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y, opacity }}
      >
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </motion.div>

      <div className="container relative z-10 px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center text-center space-y-8"
        >
          <motion.div
            className="rounded-full p-3 bg-twitter-blue/10 text-twitter-blue"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <TwitterIcon className="w-8 h-8" />
          </motion.div>

          <motion.div
            className="relative h-32"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <AnimatePresence>
              {!isHovered ? (
                <motion.h1
                  key="compact"
                  className="text-6xl md:text-8xl font-normal font-dotmatrix tracking-wider absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Twi.am
                </motion.h1>
              ) : (
                <motion.div
                  key="expanded"
                  className="flex items-center gap-6 absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span 
                    className="text-6xl md:text-8xl font-normal font-dotmatrix tracking-wider inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm"
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    Twitter
                  </motion.span>
                  <motion.span 
                    className="text-6xl md:text-8xl font-normal font-dotmatrix tracking-wider inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm"
                    initial={{ x: 20 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    I&nbsp;am
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.h2
            className="text-xl md:text-2xl font-silkscreen tracking-wide text-twitter-blue/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.h2>
        </motion.div>
      </div>
    </motion.section>
  );
}