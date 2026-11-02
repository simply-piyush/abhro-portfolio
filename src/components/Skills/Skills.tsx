"use client";

import React from "react";
import MarqueeAlongSvgPath from "@/components/ui/marquee-along-svg-path";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

// Official vector icon source with authentic brand colors and sleek containers
const SKILLS = [
  { name: "Adobe Photoshop", icon: "/icons/skills/ps.svg", color: "#31A8FF", bg: "#001E36" },
  { name: "Adobe InDesign", icon: "/icons/skills/id.svg", color: "#FF3366", bg: "#49021F" },
  { name: "Adobe Illustrator", icon: "/icons/skills/ai.svg", color: "#FF9A00", bg: "#330000" },
  { name: "Adobe Premiere Pro", icon: "/icons/skills/pr.svg", color: "#9999FF", bg: "#00005B" },
  { name: "Adobe Lightroom", icon: "/icons/skills/lr.svg", color: "#31A8FF", bg: "#001E36" },
  { name: "Canva", icon: "/icons/skills/canva.svg", color: "#00C4CC", bg: "#003135" },
  { name: "MS Word", icon: "/icons/skills/word.svg", color: "#2B579A", bg: "#10233F" },
  { name: "MS PowerPoint", icon: "/icons/skills/powerpoint.svg", color: "#D24726", bg: "#3C140A" },
];

// Path with loop shifted to the right, raised bottom dips (maxY = 318.35, 111px+ bottom clearance),
// and extended by 180px beyond both edges of the screen (~2-3 apps buffer)
// so icons never pop in or out visibly at the screen boundaries.
const path =
  "M-180 160C-120 190 -60 225 0 260C64.446 305 485.926 365 622.583 260C740.905 125 665.516 25 567.332 85C469.149 145 492.902 295 655.041 315C728.752 330 943.56 235 996 210C1056 185 1120 165 1180 155";

export const Skills: React.FC = () => {
  return (
    <section
      id="skills"
      aria-label="What I Use"
      className="relative w-full bg-portfolio-bg min-h-[500px] sm:min-h-[580px] md:min-h-[660px] lg:min-h-[740px] xl:min-h-[800px] py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden select-none flex items-center justify-center"
    >
      {/* Background typography: relative to the page, vertically centered via align-items: center (items-center) */}
      <div className="relative z-0 w-full max-w-[1380px] mx-auto px-3 sm:px-6 md:px-10 pointer-events-none select-none flex items-center">
        <ScrollReveal
          direction="left"
          distance={80}
          duration={0.9}
          threshold={0.1}
          className="w-full"
        >
          <h2 className="pt-0 lg:pt-24 pb-0 sm:pb-20 md:pb-32 lg:pb-48 flex flex-col font-narina text-5xl sm:text-6xl md:text-9xl lg:text-10xl xl:text-[160px] 2xl:text-[190px] text-black tracking-[0.02em] leading-[0.82] uppercase">
            <span>WHAT</span>
            <span>I USE</span>
          </h2>
        </ScrollReveal>
      </div>

      {/* Edge-to-edge Marquee on top of the typography (z-10) with loop shifted to the right, tight app spacing, and off-screen buffers */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none w-full overflow-hidden">
        <ScrollReveal
          direction="up"
          distance={40}
          duration={0.8}
          delay={0.2}
          threshold={0.1}
          className="w-full pointer-events-auto"
        >
          <MarqueeAlongSvgPath
            path={path}
            viewBox="0 0 996 430"
            baseVelocity={3.75}
            slowdownOnHover={true}
            draggable={false}
            repeat={4}
            className="w-full"
            responsive
            stretchWidth
          >
            {SKILLS.map((item, i) => (
              <div
                key={i}
                className="group relative cursor-pointer select-none"
                aria-label={item.name}
              >
                {/* Custom Hover Tooltip: Instantly visible on hover without dot */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out z-50 transform group-hover:-translate-y-1">
                  <div className="px-2.5 py-1 rounded-md bg-zinc-900/95 backdrop-blur-md text-white text-[11px] font-medium tracking-wide whitespace-nowrap shadow-xl border border-white/15">
                    {item.name}
                  </div>
                  {/* Downward triangle pointer pointing to icon */}
                  <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-900/95 mx-auto" />
                </div>

                {/* Icon Squircle: Sized to 58.5px to maintain an exact 5px gap between consecutive icons */}
                <div
                  className="w-[58.5px] h-[58.5px] rounded-2xl flex items-center justify-center p-2 sm:p-2.5 transition-transform duration-300 ease-out group-hover:scale-135 shadow-md"
                  style={{
                    backgroundColor: item.bg,
                    border: `1.5px solid ${item.color}55`,
                  }}
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />
                </div>
              </div>
            ))}
          </MarqueeAlongSvgPath>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Skills;
