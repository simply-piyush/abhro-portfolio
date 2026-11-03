"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { PROJECTS } from "@/data/projects";
import { Project } from "@/data/projects";
import { ProjectsHeader } from "./ProjectsHeader";
import { DesktopGallery } from "./DesktopGallery";
import { MobileGallery } from "./MobileGallery";

const ProjectModal = dynamic(
  () => import("./ProjectModal").then((mod) => mod.ProjectModal),
  { ssr: false }
);

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
      className="relative w-full min-h-[680px] sm:min-h-[740px] md:min-h-[800px] h-[94dvh] md:h-screen max-h-[1040px] mt-0 z-20 select-none flex flex-col justify-center bg-black rounded-t-[24px] sm:rounded-t-[36px] md:rounded-t-[48px] rounded-b-none overflow-hidden shadow-2xl border-t border-neutral-900 content-auto"
    >
      {/* 100vw Black Container with Inner Content aligned to page max-width and generous top spacing */}
      <div className="w-full max-w-[1380px] h-full mx-auto px-3 sm:px-6 md:px-10 pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-4 sm:pb-6 md:pb-8 text-white flex flex-col justify-between overflow-hidden">
        {/* Header with Title and Nav Controls */}
        <ProjectsHeader
          activeIdx={activeIdx}
          totalProjects={PROJECTS.length}
          onPrev={() => handleMobileNav("left")}
          onNext={() => handleMobileNav("right")}
        />

        {/* Gallery Area: Desktop Accordion & Mobile Swipe Carousel */}
        <div className="flex-1 min-h-0 w-full my-2 sm:my-3 relative overflow-hidden">
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
      </div>

      {/* Lightbox / Modal for Expanded Preview */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
