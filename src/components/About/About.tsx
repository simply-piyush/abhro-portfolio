"use client";

import React from "react";
import { AboutBackground } from "./AboutBackground";
import { AboutCard } from "./AboutCard";

export const About: React.FC = () => {
  return (
    <section
      id="about"
      aria-label="About Me"
      className="relative w-full h-screen h-[100dvh] min-h-[100vh] min-h-[100dvh] bg-white overflow-hidden flex items-center justify-center px-4 select-none"
    >
      {/* Background Kinetic Typography Marquee */}
      <AboutBackground />

      {/* Foreground Centered Frosted Glass About Card */}
      <AboutCard />
    </section>
  );
};
