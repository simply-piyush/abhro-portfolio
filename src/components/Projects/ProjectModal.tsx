"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles } from "lucide-react";
import { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for Escape key and lock body scroll while modal is open
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  if (!mounted || !project) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${project.title}`}
      className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-800/80 shrink-0 bg-neutral-950/80 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-brand font-semibold uppercase tracking-wider">
                {project.category}
              </span>
              <span className="text-xs font-mono text-neutral-500">•</span>
              <span className="text-xs font-mono text-neutral-400">
                {project.year}
              </span>
            </div>
            <h3 className="font-anton text-2xl sm:text-3xl text-white tracking-wide leading-tight">
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Project Preview"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-neutral-900 hover:bg-brand text-white border border-neutral-800 transition-colors active:scale-95 shadow-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Container for Media and Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Media Player / Viewer */}
          <div className="w-full bg-black flex items-center justify-center overflow-hidden relative min-h-[220px] sm:min-h-[360px]">
            {project.type === "video" ? (
              <video
                src={project.src}
                poster={project.poster}
                controls
                autoPlay
                playsInline
                className="w-full h-auto max-h-[50vh] sm:max-h-[55vh] object-contain"
              />
            ) : (
              <img
                src={project.src}
                alt={project.title}
                className="w-full h-auto max-h-[50vh] sm:max-h-[55vh] object-contain"
              />
            )}
          </div>

          {/* Modal Details Section */}
          <div className="p-4 sm:p-6 md:p-8 bg-neutral-950 flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-t border-neutral-800/60">
            <div className="max-w-xl">
              <h4 className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider mb-2">
                Project Overview
              </h4>
              <p className="text-sm sm:text-base text-neutral-200 font-sans leading-relaxed mb-4">
                {project.description}
              </p>

              <h4 className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider mb-2">
                Tools & Technologies
              </h4>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {project.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono bg-neutral-900 px-2.5 py-1 rounded-md text-neutral-300 border border-neutral-800"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Technical Specifications */}
            {project.stats && project.stats.length > 0 && (
              <div className="shrink-0 border-t sm:border-t-0 sm:border-l border-neutral-800/80 pt-4 sm:pt-0 sm:pl-6 min-w-[200px]">
                <div className="flex items-center gap-1.5 text-xs font-mono text-brand font-semibold mb-3 uppercase tracking-wider">
                  <Sparkles size={13} />
                  <span>Technical Specs</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                  {project.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800/50">
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider mb-0.5">
                        {stat.label}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-white">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
