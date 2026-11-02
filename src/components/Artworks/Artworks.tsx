"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ARTWORKS } from "@/data/artworks";
import { InstagramArtworkCard } from "./InstagramArtworkCard";
import { TopographyBackground } from "./TopographyBackground";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const Artworks: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven opacity: the bg slowly shows up when scrolled from projects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 25%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const bgOpacity = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Previous & Next navigation handlers (keyboard arrow support)
  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => Math.min(ARTWORKS.length - 1, prev + 1));
  }, []);

  // Keyboard navigation (Left / Right Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <section
      ref={sectionRef}
      id="artworks"
      aria-label="Artworks Showcase"
      className="relative w-full bg-black text-white select-none pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-24 md:pb-32 rounded-b-[24px] sm:rounded-b-[36px] md:rounded-b-[48px] border-b border-neutral-900 shadow-2xl z-20 overflow-hidden"
    >
      {/* Interactive Topography Background - slowly shows up when scrolled from projects */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 z-0 pointer-events-auto"
        aria-hidden="true"
      >
        <TopographyBackground
          className="size-full"
          lineColor="#888888"
          levels={16}
          speed={0.8}
          scale={1}
          peak={1}
          interactive={true}
        />
      </motion.div>

      {/* 100vw Container with Inner Content aligned to match Projects */}
      <div className="relative z-10 w-full max-w-[1380px] mx-auto px-3 sm:px-6 md:px-10 pointer-events-none">
        {/* Section Header: Centered Section Title */}
        <ScrollReveal direction="down" distance={30} duration={0.6} className="flex justify-center items-center mb-8 sm:mb-12 md:mb-14 pointer-events-auto">
          <h2 className="font-narina text-3xl sm:text-4xl md:text-[42px] lg:text-5xl text-brand tracking-[0.04em] leading-none text-center">
            ARTWORKS
          </h2>
        </ScrollReveal>

        {/* Single Instagram Post Frame with horizontally scrollable artworks */}
        <ScrollReveal direction="up" distance={50} duration={0.8} delay={0.15} className="w-full flex justify-center pointer-events-auto">
          <InstagramArtworkCard
            artworks={ARTWORKS}
            currentIdx={activeIdx}
            onSlideChange={setActiveIdx}
          />
        </ScrollReveal>
      </div>
    </section>
  );
};
