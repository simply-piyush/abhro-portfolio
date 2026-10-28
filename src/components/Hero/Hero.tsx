"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { HeroPortrait } from "./HeroPortrait";

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const hiRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initialize GSAP positions for bottom-to-up entry
      gsap.set(
        [hiRef.current, nameRef.current, portraitRef.current, taglineRef.current],
        {
          opacity: 0,
          y: 90,
        }
      );

      // Master intro timeline: elements appear sequentially from bottom to up
      const tl = gsap.timeline({
        delay: 0.15,
        defaults: {
          ease: "power3.out",
        },
      });

      // 1. "Hi, i'm" appears
      tl.to(hiRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.85,
      })
        // 2. Giant ABHRO appears behind
        .to(
          nameRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
          },
          "-=0.45"
        )
        // 3. Cutout portrait rises
        .to(
          portraitRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1.25,
          },
          "-=0.7"
        )
        // 4. Tagline appears in bottom-right
        .to(
          taglineRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
          },
          "-=0.6"
        );

      // Interactive mouse parallax depth
      const handleMouseMove = (e: MouseEvent) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
        const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(portraitRef.current, {
          x: xPercent * 28,
          y: yPercent * 16,
          duration: 1.1,
          ease: "power1.out",
          overwrite: "auto",
        });

        gsap.to(nameRef.current, {
          x: xPercent * -14,
          y: yPercent * -8,
          duration: 1.3,
          ease: "power1.out",
          overwrite: "auto",
        });
      };

      const heroEl = heroRef.current;
      if (heroEl) {
        heroEl.addEventListener("mousemove", handleMouseMove);
      }

      return () => {
        if (heroEl) {
          heroEl.removeEventListener("mousemove", handleMouseMove);
        }
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Hero"
      className="relative w-full h-[100vh] h-[100dvh] min-h-[100vh] min-h-[100dvh] max-h-[100vh] max-h-[100dvh] bg-portfolio-bg flex justify-center items-end overflow-hidden pt-20 pb-0 select-none"
    >
      <div className="relative w-full max-w-[1440px] h-full mx-auto flex flex-col justify-end">
        {/* Step 1: "Hi, i'm" */}
        <div
          ref={hiRef}
          className="absolute top-12 sm:top-24 md:top-16 left-[6%] sm:left-[8%] z-10 pointer-events-none"
        >
          <span className="font-narina text-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide leading-none drop-shadow-xs select-none">
            Hi, i’m
          </span>
        </div>

        {/* Step 2: Giant "ABHRO" Text behind the portrait */}
        <div
          ref={nameRef}
          aria-hidden="true"
          className="absolute top-20 sm:top-28 md:top-32 lg:top-36 left-0 w-full flex justify-center items-center z-0 pointer-events-none px-2 sm:px-4"
        >
          <h1 className="font-narina text-brand text-[clamp(115px,34.5vw,500px)] leading-none tracking-[0.05em] text-center select-none whitespace-nowrap">
            ABHRO
          </h1>
        </div>

        {/* Step 3: Abhro's Cutout Portrait */}
        <HeroPortrait ref={portraitRef} />

        {/* Step 4: Tagline in bottom-right */}
        <div
          ref={taglineRef}
          className="absolute bottom-4 sm:bottom-8 md:bottom-10 right-[5%] sm:right-[7%] z-30 text-right pointer-events-auto"
        >
          <p className="font-anton text-xl sm:text-3xl md:text-4xl lg:text-[40px] leading-[1.12] tracking-wider sm:tracking-[3px] text-brand-bright uppercase">
            <span className="block">BRINGING CREATIONS TO LIFE</span>
            <span className="block text-brand">ONE CREATION AT A TIME</span>
          </p>
        </div>
      </div>
    </section>
  );
};
