"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

interface MobileGalleryProps {
  projects: Project[];
  activeIdx: number;
  onActivate: (idx: number) => void;
  onOpenModal: (project: Project) => void;
  carouselRef: React.RefObject<HTMLDivElement>;
}

export const MobileGallery: React.FC<MobileGalleryProps> = ({
  projects,
  activeIdx,
  onActivate,
  onOpenModal,
  carouselRef,
}) => {
  const isScrollingFromCode = useRef(false);

  // Synchronize scroll position with activeIdx when user swipes or clicks chevron
  const handleScroll = useCallback(() => {
    if (isScrollingFromCode.current || !carouselRef.current) return;

    const container = carouselRef.current;
    const cards = container.children;
    if (!cards || cards.length === 0) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      // Skip non-card elements (like spacers if any)
      if (!card.offsetLeft && card.offsetLeft !== 0) continue;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = i;
      }
    }

    if (closestIdx !== activeIdx && closestIdx >= 0 && closestIdx < projects.length) {
      onActivate(closestIdx);
    }
  }, [activeIdx, onActivate, projects.length, carouselRef]);

  // Scroll to index programmatically when activeIdx is updated externally (e.g. from chevron buttons or dots)
  const scrollToIndex = useCallback(
    (index: number) => {
      if (!carouselRef.current) return;
      const container = carouselRef.current;
      const targetCard = container.children[index] as HTMLElement;
      if (targetCard) {
        isScrollingFromCode.current = true;
        targetCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
        setTimeout(() => {
          isScrollingFromCode.current = false;
        }, 400);
      }
    },
    [carouselRef]
  );

  return (
    <div className="flex md:hidden flex-col h-full w-full justify-between">
      {/* Mobile Horizontal Snap Carousel */}
      <div
        ref={carouselRef as any}
        onScroll={handleScroll}
        className="flex items-stretch gap-3.5 h-[calc(100%-28px)] w-full overflow-x-auto snap-x snap-mandatory no-scrollbar px-3 py-1 scroll-smooth overscroll-x-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {projects.map((project, idx) => (
          <ProjectCard
            key={`mobile-${project.id}`}
            project={project}
            idx={idx}
            isActive={activeIdx === idx}
            onActivate={() => onActivate(idx)}
            onDeactivate={() => {}}
            onOpenModal={onOpenModal}
            isMobile={true}
          />
        ))}
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center justify-center gap-1.5 py-1.5 shrink-0">
        {projects.map((p, idx) => (
          <button
            key={`dot-${p.id}`}
            type="button"
            onClick={() => {
              onActivate(idx);
              scrollToIndex(idx);
            }}
            aria-label={`Go to project ${idx + 1}: ${p.title}`}
            className={`transition-all duration-300 rounded-full ${
              activeIdx === idx
                ? "w-6 h-1.5 bg-brand"
                : "w-1.5 h-1.5 bg-neutral-700 hover:bg-neutral-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
