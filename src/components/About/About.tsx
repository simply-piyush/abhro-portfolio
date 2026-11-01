"use client";

import React from "react";
import { AboutBackground } from "./AboutBackground";
import { AboutCard } from "./AboutCard";

export const About: React.FC = () => {
  return (
    <section
      id="about"
      aria-label="About Me"
      className="relative w-full min-h-[800px] sm:min-h-[960px] lg:min-h-[1024px] bg-white overflow-hidden flex items-center justify-center pt-24 pb-36 sm:pb-48 md:pb-56 px-4 select-none"
    >
      {/* Background Kinetic Typography Marquee */}
      <AboutBackground />

      {/* Foreground Centered Frosted Glass About Card */}
      <AboutCard />
    </section>
  );
};
