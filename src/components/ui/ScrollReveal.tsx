"use client";

import React from "react";
import { motion } from "motion/react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  /** Pixels to translate from */
  distance?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Delay in seconds */
  delay?: number;
  /** Viewport amount visible before triggering (0–1) */
  threshold?: number;
  /** Only animate once */
  once?: boolean;
  className?: string;
}

const getInitial = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up":
      return { opacity: 0, y: distance };
    case "down":
      return { opacity: 0, y: -distance };
    case "left":
      return { opacity: 0, x: -distance };
    case "right":
      return { opacity: 0, x: distance };
    case "none":
      return { opacity: 0 };
  }
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = "up",
  distance = 60,
  duration = 0.7,
  delay = 0,
  threshold = 0.15,
  once = true,
  className,
}) => {
  return (
    <motion.div
      initial={getInitial(direction, distance)}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
