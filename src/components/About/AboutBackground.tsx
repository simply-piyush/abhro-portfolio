"use client";

import React from "react";
import { Marquee } from "./Marquee";
import { cn } from "@/lib/utils";

// 24 items per block to ensure the block height exceeds the viewport,
// allowing the Marquee's translation loop to repeat with 100% seamless continuity
const ITEMS = Array.from({ length: 24 }, () => "ABOUT ME");

// Alternating columns: outline variant vs filled variant, and alternating direction (UP / DOWN)
const COLUMNS = [
  { isFilled: false, reverse: false },
  { isFilled: true, reverse: true },
  { isFilled: false, reverse: false },
  { isFilled: true, reverse: true },
  { isFilled: false, reverse: false },
  { isFilled: true, reverse: true },
  { isFilled: false, reverse: false },
];

export const AboutBackground: React.FC = () => {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220vw] min-w-[1800px] h-[1800px] pointer-events-none select-none flex justify-center items-center gap-8 sm:gap-12 md:gap-16 -rotate-[12deg] overflow-hidden"
      aria-hidden="true"
    >
      {COLUMNS.map((col, colIdx) => (
        <Marquee
          key={`col-${colIdx}`}
          vertical
          reverse={col.reverse}
          repeat={4}
          className="h-full overflow-hidden p-0 [--duration:38s] [--gap:1.5rem]"
        >
          {ITEMS.map((text, idx) => (
            <span
              key={`item-${colIdx}-${idx}`}
              className={cn(
                "font-anton text-6xl sm:text-7xl md:text-8xl lg:text-[96px] tracking-tight leading-none whitespace-nowrap select-none",
                col.isFilled ? "text-brand-bright" : "text-stroke-brand-white"
              )}
            >
              {text}
            </span>
          ))}
        </Marquee>
      ))}
    </div>
  );
};
