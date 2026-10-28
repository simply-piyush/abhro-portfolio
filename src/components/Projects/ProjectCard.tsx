"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import { Project } from "@/data/projects";

export interface ProjectCardProps {
  project: Project;
  idx: number;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onOpenModal: (project: Project) => void;
  isMobile?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  idx,
  isActive,
  onActivate,
  onDeactivate,
  onOpenModal,
  isMobile = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // If card becomes inactive, pause video automatically to save resources
  useEffect(() => {
    if (!isActive && videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  // Desktop Hover Handlers
  const handleMouseEnter = () => {
    if (isMobile) return;
    onActivate();
    if (project.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay may be restricted if unmuted
          });
      }
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    onDeactivate();
    if (project.type === "video" && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Click / Tap Handler (touch-friendly for mobile)
  const handleClick = (e: React.MouseEvent) => {
    // If clicking on specific action buttons (mute/expand), ignore card toggle
    if ((e.target as HTMLElement).closest("button")) return;

    onActivate();

    if (project.type === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((err) => console.log("Playback error:", err));
        }
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border border-neutral-800/90 shadow-xl transition-all duration-500 ease-out flex flex-col justify-end select-none ${
        isMobile
          ? "w-[82vw] sm:w-[320px] max-w-[340px] h-full shrink-0 snap-center touch-manipulation"
          : `h-full ${
              isActive
                ? "flex-[3.5] lg:flex-[4] border-brand/50 shadow-brand/10 ring-1 ring-brand/30"
                : "flex-1 hover:flex-[1.2] opacity-80 hover:opacity-100"
            }`
      }`}
    >
      {/* Background Media: Video or Image */}
      <div className="absolute inset-0 w-full h-full bg-neutral-950 overflow-hidden">
        {project.type === "video" ? (
          <video
            ref={videoRef}
            src={project.src}
            poster={project.poster}
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
          />
        ) : (
          <img
            src={project.src}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
      </div>

      {/* Atmospheric Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/25 transition-opacity duration-300 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Top Header Row inside Card */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Number Pill */}
          <span className="font-anton text-base sm:text-xl text-white drop-shadow-md bg-black/65 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/10">
            {project.number}
          </span>

          {/* Media Type Badge */}
          <span
            className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-mono font-medium px-2 py-0.5 rounded-md backdrop-blur-md border ${
              project.type === "video"
                ? "bg-brand/85 text-white border-brand/40 shadow-sm shadow-brand/20"
                : "bg-white/10 text-neutral-300 border-white/15"
            }`}
          >
            {project.type === "video" ? (
              <>
                <Film size={11} />
                <span>3D VIDEO</span>
              </>
            ) : (
              <>
                <ImageIcon size={11} />
                <span>ARTWORK</span>
              </>
            )}
          </span>
        </div>

        {/* Video Audio Control & Full View Button (with touch-accessible target sizing) */}
        <div className="flex items-center gap-1.5">
          {project.type === "video" && isPlaying && (
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              className="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center rounded-full bg-black/75 hover:bg-brand text-white border border-white/15 backdrop-blur-md transition-all shadow-md active:scale-95"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(project);
            }}
            aria-label={`Expand Preview for ${project.title}`}
            className="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center rounded-full bg-black/65 hover:bg-brand text-white border border-white/15 backdrop-blur-md transition-all shadow-md active:scale-95"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Video Play/Pause Floating Overlay Badge */}
      {project.type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            className={`transition-all duration-300 px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 border shadow-lg ${
              isPlaying
                ? "bg-brand/80 text-white border-brand/40 opacity-0 group-hover:opacity-95"
                : "bg-black/70 text-white/95 border-white/20 opacity-90 scale-100"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={14} className="animate-pulse" />
                <span className="text-[11px] sm:text-xs font-mono tracking-wider">
                  {isMobile ? "TAP TO PAUSE" : "PLAYING"}
                </span>
              </>
            ) : (
              <>
                <Play size={14} className="fill-white" />
                <span className="text-[11px] sm:text-xs font-mono tracking-wider">
                  {isMobile ? "TAP TO PLAY" : "HOVER TO PLAY"}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Content Area */}
      <div className="relative z-20 p-3.5 sm:p-5 flex flex-col justify-end">
        {/* Category & Year */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[11px] sm:text-xs font-mono text-brand font-semibold uppercase tracking-wider">
            {project.category}
          </span>
          <span className="text-[10px] font-mono text-neutral-400">
            • {project.year}
          </span>
        </div>

        {/* Project Title */}
        <h3 className="font-anton text-lg sm:text-xl lg:text-2xl text-white tracking-wide leading-tight line-clamp-1 mb-1">
          {project.title}
        </h3>

        {/* Expanded Description & Tools (always visible on mobile card, expandable on desktop) */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isActive || isMobile
              ? "max-h-28 opacity-100 mt-1"
              : "max-h-0 opacity-0"
          }`}
        >
          <p className="text-xs sm:text-sm text-neutral-300 font-sans line-clamp-2 mb-2 leading-relaxed">
            {project.description}
          </p>

          <div className="flex items-center gap-1.5 flex-wrap">
            {project.tools.slice(0, 3).map((tool, tIdx) => (
              <span
                key={tIdx}
                className="text-[10px] font-mono bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-neutral-300 border border-white/5"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
