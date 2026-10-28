"use client";

import React, { useState, useRef } from "react";
import { PROJECTS } from "@/data/projects";
import { Project } from "@/data/projects";
import { ProjectsHeader } from "./ProjectsHeader";
import { DesktopGallery } from "./DesktopGallery";
import { MobileGallery } from "./MobileGallery";
import { ProjectModal } from "./ProjectModal";

export const Projects: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  // Navigate mobile carousel
  const handleMobileNav = (direction: "left" | "right") => {
    const nextIdx =
      direction === "left"
        ? Math.max(0, activeIdx - 1)
        : Math.min(PROJECTS.length - 1, activeIdx + 1);

    setActiveIdx(nextIdx);

    if (mobileCarouselRef.current) {
      const container = mobileCarouselRef.current;
      const targetCard = container.children[nextIdx] as HTMLElement;
      if (targetCard) {
        targetCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  const currentProject = PROJECTS[activeIdx];

  return (
    <section
      id="projects"
      aria-label="Projects Showcase"
      className="relative w-screen w-[100vw] max-w-[100vw] min-h-[600px] h-[92dvh] md:h-screen max-h-[100dvh] md:max-h-[960px] -mt-16 sm:-mt-24 md:-mt-32 z-20 select-none flex flex-col justify-center px-0 py-2 sm:py-4 scroll-mt-24"
    >
      {/* Black Container matching Figma Rectangle 12 (rounded-48px) spanning 100vw */}
      <div className="w-full h-full bg-black rounded-[24px] sm:rounded-[36px] md:rounded-[48px] p-4 sm:p-6 md:p-8 lg:p-10 text-white overflow-hidden shadow-2xl flex flex-col justify-between border border-neutral-900">
        {/* Header with Title and Nav Controls */}
        <ProjectsHeader
          activeIdx={activeIdx}
          totalProjects={PROJECTS.length}
          onPrev={() => handleMobileNav("left")}
          onNext={() => handleMobileNav("right")}
        />

        {/* Gallery Area: Desktop Accordion & Mobile Swipe Carousel */}
        <div className="flex-1 min-h-0 w-full my-1 sm:my-2 relative overflow-hidden">
          <DesktopGallery
            projects={PROJECTS}
            activeIdx={activeIdx}
            onActivate={setActiveIdx}
            onOpenModal={setSelectedProject}
          />

          <MobileGallery
            projects={PROJECTS}
            activeIdx={activeIdx}
            onActivate={setActiveIdx}
            onOpenModal={setSelectedProject}
            carouselRef={mobileCarouselRef}
          />
        </div>

        {/* Footer Info Ribbon */}
        {currentProject && (
          <div className="shrink-0 pt-2.5 sm:pt-3 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-400 font-mono gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-white font-semibold flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                <span className="truncate">{currentProject.title}</span>
              </span>
              <span className="hidden sm:inline text-neutral-600">•</span>
              <span className="hidden sm:inline text-neutral-400 truncate">
                {currentProject.category}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] sm:text-xs text-neutral-400 font-mono">
                {currentProject.tools.slice(0, 3).join(" / ")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Modal for Expanded Preview */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
