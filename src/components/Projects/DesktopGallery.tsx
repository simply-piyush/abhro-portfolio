"use client";

import React from "react";
import { Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

interface DesktopGalleryProps {
  projects: Project[];
  activeIdx: number;
  onActivate: (idx: number) => void;
  onOpenModal: (project: Project) => void;
}

export const DesktopGallery: React.FC<DesktopGalleryProps> = ({
  projects,
  activeIdx,
  onActivate,
  onOpenModal,
}) => {
  return (
    <div className="hidden md:flex items-stretch gap-2 lg:gap-3 h-full w-full">
      {projects.map((project, idx) => (
        <ProjectCard
          key={project.id}
          project={project}
          idx={idx}
          isActive={activeIdx === idx}
          onActivate={() => onActivate(idx)}
          onDeactivate={() => {}}
          onOpenModal={onOpenModal}
          isMobile={false}
        />
      ))}
    </div>
  );
};
