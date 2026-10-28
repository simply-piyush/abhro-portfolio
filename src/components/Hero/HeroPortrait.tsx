import React, { forwardRef } from "react";
import Image from "next/image";

export const HeroPortrait = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[980px] h-full flex justify-center items-end z-20 pointer-events-none"
    >
      <div className="relative w-full h-full flex justify-center items-end overflow-hidden sm:overflow-visible">
        <Image
          src="/assets/abhro.png"
          alt="Abhro Saha"
          width={1004}
          height={1004}
          priority
          className="w-auto h-[90%] sm:h-[90%] max-h-[82vh] sm:max-h-[800px] lg:max-h-[890px] max-w-none sm:max-w-[96vw] object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] scale-135 sm:scale-100 origin-bottom transition-transform duration-300"
        />
      </div>
    </div>
  );
});

HeroPortrait.displayName = "HeroPortrait";
