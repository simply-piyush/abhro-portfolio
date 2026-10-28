"use client";

import React from "react";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectsHeaderProps {
  activeIdx: number;
  totalProjects: number;
  onPrev: () => void;
  onNext: () => void;
}

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  activeIdx,
  totalProjects,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 shrink-0 mb-3 sm:mb-4">
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <h2 className="font-narina text-3xl sm:text-4xl md:text-[42px] text-white tracking-[0.04em] leading-none">
            PROJECTS
          </h2>
          
        </div>
        
      </div>

      {/* Interactive Desktop Badges & Mobile Carousel Navigation Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Desktop Hint */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span>Hover card to expand & play video</span>
        </div>

        {/* Mobile Navigation Controls (accessible touch targets) */}
        <div className="flex md:hidden items-center gap-1 bg-neutral-900/90 border border-neutral-800 p-1 rounded-full shadow-md backdrop-blur-md">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous Project"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white active:bg-neutral-800 transition-colors active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-mono font-medium px-2 text-brand min-w-[42px] text-center">
            {activeIdx + 1} / {totalProjects}
          </span>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next Project"
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-300 hover:text-white active:bg-neutral-800 transition-colors active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
