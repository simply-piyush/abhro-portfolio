"use client";

import React from "react";
import Image from "next/image";

export const AboutCard: React.FC = () => {
  return (
    <div className="relative z-10 w-full max-w-[928px] mx-auto">
      <div className="relative bg-[#D9D9D9]/95 backdrop-blur-xl rounded-[28px] p-6 sm:p-10 md:p-14 lg:p-16 shadow-[0_8px_90px_rgba(0,0,0,0.85)] border border-white/50 transition-transform duration-300 hover:scale-[1.01]">
        {/* Card Title */}
        <div className="flex items-center justify-center mb-6 sm:mb-8 md:mb-10">
          <h3 className="font-narina text-3xl sm:text-4xl md:text-[44px] text-black tracking-[0.04em] leading-none text-center">
            ABOUT ME
          </h3>
        </div>

        {/* Bio Quote Content */}
        <div className="relative px-2 sm:px-6 md:px-10">
          <p className="text-neutral-900 text-base sm:text-xl md:text-2xl leading-[1.6] sm:leading-[1.65] font-normal tracking-wide text-left sm:text-justify font-sans">
            <span className="inline-block align-top mr-2 mt-1 sm:mt-1.5 select-none">
              <Image
                src="/assets/quote-open.svg"
                alt="“"
                width={22}
                height={16}
                className="w-3.5 sm:w-4 md:w-5 h-auto inline-block"
              />
            </span>
            I’m passionate about drawing, graphic design, and visual storytelling.
            I enjoy exploring creativity through animation, digital art, and graphic design,
            while drawing inspiration from stories, characters, and human emotions. I’m currently
            learning Blender to expand my skills in 3D modelling and animation. I love combining
            imagination with technique to bring ideas to life through compelling visuals.
            <span className="inline-block align-top ml-2 mt-1 sm:mt-1.5 select-none">
              <Image
                src="/assets/quote-close.svg"
                alt="”"
                width={22}
                height={16}
                className="w-3.5 sm:w-4 md:w-5 h-auto inline-block"
              />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
