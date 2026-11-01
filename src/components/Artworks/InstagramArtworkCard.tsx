"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Heart,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Check,
  ExternalLink,
} from "lucide-react";
import { Artwork } from "@/data/artworks";

interface InstagramArtworkCardProps {
  artworks: Artwork[];
  currentIdx: number;
  onSlideChange: (index: number) => void;
}

export const InstagramArtworkCard: React.FC<InstagramArtworkCardProps> = ({
  artworks,
  currentIdx,
  onSlideChange,
}) => {
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<number, boolean>>({});
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [expandedCaption, setExpandedCaption] = useState(false);

  const slidesTrackRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);

  // Desktop mouse drag refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const currentArtwork = artworks[currentIdx] || artworks[0];
  const isLiked = !!likedMap[currentIdx];
  const isSaved = !!savedMap[currentIdx];
  const total = artworks.length;

  // Scroll to slide smoothly when requested by UI interaction (chevrons, dots)
  const scrollToSlide = useCallback(
    (index: number) => {
      if (!slidesTrackRef.current) return;
      const container = slidesTrackRef.current;
      const width = container.clientWidth;
      if (!width) return;

      isProgrammaticScrollRef.current = true;
      if (programmaticTimerRef.current) {
        clearTimeout(programmaticTimerRef.current);
      }

      container.scrollTo({
        left: index * width,
        behavior: "smooth",
      });

      onSlideChange(index);

      programmaticTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 450);
    },
    [onSlideChange]
  );

  // Sync scroll position when currentIdx is updated from parent (keyboard / external)
  useEffect(() => {
    if (!slidesTrackRef.current) return;
    const container = slidesTrackRef.current;
    const width = container.clientWidth;
    if (!width) return;

    // Check if the container is already scrolled to this index
    const currentScrollIdx = Math.round(container.scrollLeft / width);
    if (
      currentScrollIdx !== currentIdx &&
      !isProgrammaticScrollRef.current &&
      !isDraggingRef.current
    ) {
      isProgrammaticScrollRef.current = true;
      if (programmaticTimerRef.current) {
        clearTimeout(programmaticTimerRef.current);
      }
      container.scrollTo({
        left: currentIdx * width,
        behavior: "smooth",
      });
      programmaticTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 450);
    }
  }, [currentIdx]);

  // Keep active slide centered on window resize
  useEffect(() => {
    const handleResize = () => {
      if (slidesTrackRef.current) {
        const container = slidesTrackRef.current;
        const width = container.clientWidth;
        if (width) {
          container.scrollTo({
            left: currentIdx * width,
            behavior: "instant" as ScrollBehavior,
          });
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIdx]);

  // Track slide index smoothly during manual swipe / touch scroll (O(1), zero layout thrashing)
  const handleTrackScroll = () => {
    if (isProgrammaticScrollRef.current || !slidesTrackRef.current) return;
    const container = slidesTrackRef.current;
    const width = container.clientWidth;
    if (!width) return;

    const newIndex = Math.round(container.scrollLeft / width);
    const clampedIndex = Math.max(0, Math.min(total - 1, newIndex));

    if (clampedIndex !== currentIdx) {
      onSlideChange(clampedIndex);
    }
  };

  // Desktop mouse drag to scroll smoothly
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!slidesTrackRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    scrollStartLeftRef.current = slidesTrackRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !slidesTrackRef.current) return;
    const deltaX = e.pageX - startXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
    }
    slidesTrackRef.current.scrollLeft = scrollStartLeftRef.current - deltaX;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (!slidesTrackRef.current) return;
    const container = slidesTrackRef.current;
    const width = container.clientWidth;
    if (width && hasDraggedRef.current) {
      const nearestIdx = Math.max(
        0,
        Math.min(total - 1, Math.round(container.scrollLeft / width))
      );
      scrollToSlide(nearestIdx);
    }
  };

  // Previous & Next navigation overlay chevrons
  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIdx > 0) {
      scrollToSlide(currentIdx - 1);
    }
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIdx < total - 1) {
      scrollToSlide(currentIdx + 1);
    }
  };

  // Toggle Like button
  const handleLikeToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedMap((prev) => ({
      ...prev,
      [currentIdx]: !prev[currentIdx],
    }));
  };

  // Double tap / double click to like animation
  const handleMediaClick = () => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!isLiked) {
        setLikedMap((prev) => ({
          ...prev,
          [currentIdx]: true,
        }));
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 800);
    }
    lastTapRef.current = now;
  };

  // Share action (copies profile link & shows toast)
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    try {
      await navigator.clipboard.writeText(
        "https://www.instagram.com/_abhro___?rpxt=MWF0cml0dmRiMXcwbQ=="
      );
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2400);
    } catch {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2400);
    }
  };

  // Toggle bookmark save
  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedMap((prev) => ({
      ...prev,
      [currentIdx]: !prev[currentIdx],
    }));
  };

  const captionText = currentArtwork.desc;
  const isLongCaption = captionText.length > 95;
  const currentLikes = currentArtwork.likes + (isLiked ? 1 : 0);

  return (
    <article className="relative w-full max-w-[480px] sm:max-w-[500px] bg-white rounded-[24px] sm:rounded-[28px] p-3.5 sm:p-4.5 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5),0_0_50px_rgba(255,255,255,0.06)] border border-neutral-200 text-neutral-900 select-none mx-auto transition-all duration-300">
      {/* Toast Notification */}
      {showCopiedToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 backdrop-blur-md text-white text-xs font-medium py-1.5 px-3.5 rounded-full shadow-xl border border-neutral-700 flex items-center gap-1.5 animate-in fade-in duration-200">
          <Check size={14} className="text-emerald-400" />
          <span>Profile link copied to clipboard</span>
        </div>
      )}

      {/* 1. Header (Avatar, Username, Follow, Options) - Light Theme */}
      <header className="flex items-center justify-between px-1 py-1 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar with colorful Instagram Story Gradient Ring */}
          <a
            href="https://www.instagram.com/_abhro___?rpxt=MWF0cml0dmRiMXcwbQ=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Abhro's Instagram Profile"
            className="relative shrink-0 p-[2px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-600 hover:scale-105 transition-transform"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white p-[1.5px]">
              <Image
                src="/assets/abhro.png"
                alt="_abhro___"
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </a>

          {/* User Handle & Location */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <a
                href="https://www.instagram.com/_abhro___?rpxt=MWF0cml0dmRiMXcwbQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sm text-neutral-900 hover:underline tracking-tight truncate leading-tight"
              >
                _abhro___
              </a>
              {/* Blue Verified Badge */}
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-[#0095f6] shrink-0 fill-current"
                aria-label="Verified"
              >
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-4.1-4.1 1.4-1.4 2.7 2.7 7.3-7.3 1.4 1.4-8.7 8.7z" />
              </svg>
            </div>
            <span className="text-[11px] text-neutral-500 truncate font-normal leading-tight">
              {currentArtwork.location}
            </span>
          </div>
        </div>

        {/* Right side: Follow button + 3 Dots */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://www.instagram.com/_abhro___?rpxt=MWF0cml0dmRiMXcwbQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#0095f6] hover:text-[#1877f2] px-2 py-1 rounded transition-colors"
          >
            Follow
          </a>
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="More options"
            className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* Options Dropdown Menu */}
      {showMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-4 top-14 z-40 bg-white rounded-xl shadow-2xl border border-neutral-200 py-1 w-44 text-xs font-medium text-neutral-700 animate-in fade-in zoom-in-95 duration-150"
        >
          <a
            href="https://www.instagram.com/_abhro___?rpxt=MWF0cml0dmRiMXcwbQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 hover:bg-neutral-100 transition-colors text-neutral-900"
          >
            <ExternalLink size={14} />
            <span>Open in Instagram</span>
          </a>
          <button
            type="button"
            onClick={handleShare}
            className="w-full text-left flex items-center gap-2 px-3.5 py-2 hover:bg-neutral-100 transition-colors text-neutral-900"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 stroke-current fill-none stroke-2"
            >
              <line x1="22" y1="3" x2="9.218" y2="10.083" />
              <polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" />
            </svg>
            <span>Share Profile</span>
          </button>
        </div>
      )}

      {/* 2. Media Area (Square 1:1 format with horizontally scrollable slides) */}
      <div
        onClick={handleMediaClick}
        className="relative w-full aspect-square rounded-[18px] sm:rounded-[20px] overflow-hidden bg-neutral-100 flex items-center justify-center cursor-pointer group shadow-xs border border-neutral-200/90"
      >
        {/* Horizontal scrollable slides track with smooth hardware-accelerated snap */}
        <div
          ref={slidesTrackRef}
          onScroll={handleTrackScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none cursor-grab active:cursor-grabbing select-none overscroll-x-contain"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {artworks.map((art, idx) => (
            <div
              key={art.id}
              className="w-full h-full shrink-0 snap-center relative flex items-center justify-center bg-neutral-100 select-none"
            >
              <Image
                src={art.url}
                alt={art.title}
                fill
                draggable={false}
                sizes="(max-width: 640px) 100vw, 500px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02] pointer-events-none select-none"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>

        {/* Slide Counter badge (e.g. 1/8) in top-right corner */}
        <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm pointer-events-none border border-white/20">
          {currentIdx + 1}/{total}
        </div>

        {/* Carousel Prev/Next overlay chevrons */}
        {currentIdx > 0 && (
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous artwork"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-neutral-900 flex items-center justify-center shadow-md transition-transform active:scale-90 border border-neutral-200/60"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {currentIdx < total - 1 && (
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next artwork"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-neutral-900 flex items-center justify-center shadow-md transition-transform active:scale-90 border border-neutral-200/60"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Double-tap popping heart animation */}
        {showHeartPop && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Heart
              size={96}
              className="fill-red-500 text-red-500 drop-shadow-[0_10px_20px_rgba(237,73,86,0.6)] animate-in zoom-in-50 fade-out-0 duration-700"
            />
          </div>
        )}
      </div>

      {/* 3. Action Bar (Heart, Share, Center Dots, Bookmark - Light Theme) */}
      <div className="relative flex items-center justify-between px-1 pt-3 pb-1">
        {/* Left Actions: Heart and Share icons */}
        <div className="flex items-center gap-2">
          {/* Like Heart */}
          <button
            type="button"
            onClick={handleLikeToggle}
            aria-label={isLiked ? "Unlike post" : "Like post"}
            className="w-8 h-8 flex items-center justify-center transition-transform active:scale-75 focus-visible:outline-hidden"
          >
            <Heart
              size={24}
              strokeWidth={1.8}
              className={`transition-colors duration-150 ${
                isLiked
                  ? "fill-[#ed4956] text-[#ed4956] animate-in zoom-in-75 duration-200"
                  : "text-neutral-900 hover:text-neutral-500"
              }`}
            />
          </button>

          {/* Share Paper-Plane (Properly placed directly next to Heart) */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share post"
            className="w-8 h-8 flex items-center justify-center text-neutral-900 hover:text-neutral-500 transition-transform active:scale-75 focus-visible:outline-hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[22px] h-[22px] stroke-current fill-none stroke-[1.8]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="3" x2="9.218" y2="10.083" />
              <polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" />
            </svg>
          </button>
        </div>

        {/* Center: Absolute center pagination dots */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 py-1"
          aria-label={`Slide ${currentIdx + 1} of ${total}`}
        >
          {artworks.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === currentIdx
                  ? "w-1.5 h-1.5 bg-[#0095f6]"
                  : "w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>

        {/* Right Action: Bookmark Save */}
        <button
          type="button"
          onClick={handleBookmarkToggle}
          aria-label={isSaved ? "Unsave post" : "Save post"}
          className="w-8 h-8 flex items-center justify-center text-neutral-900 hover:text-neutral-500 transition-transform active:scale-75 focus-visible:outline-hidden"
        >
          <Bookmark
            size={23}
            strokeWidth={1.8}
            className={isSaved ? "fill-black text-black" : ""}
          />
        </button>
      </div>

      {/* 4. Engagement & Caption Section - Light Theme */}
      <div className="px-1 pt-1 text-left">
        {/* Likes Count */}
        <p className="font-semibold text-sm text-neutral-900 leading-tight">
          {currentLikes.toLocaleString()} likes
        </p>

        {/* Caption */}
        <div className="mt-1 text-sm text-neutral-900 leading-snug break-words">
          <a
            href="https://www.instagram.com/_abhro___?rpxt=MWF0cml0dmRiMXcwbQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-neutral-900 mr-1.5 hover:underline"
          >
            _abhro___
          </a>
          <span className="font-semibold text-neutral-900 mr-1">
            {currentArtwork.title}
          </span>
          <span className="text-neutral-700">
            —{" "}
            {expandedCaption || !isLongCaption
              ? captionText
              : `${captionText.slice(0, 95)}... `}
          </span>
          {isLongCaption && (
            <button
              type="button"
              onClick={() => setExpandedCaption(!expandedCaption)}
              className="text-xs text-neutral-500 font-normal hover:text-neutral-900 ml-1 inline-block"
            >
              {expandedCaption ? "less" : "more"}
            </button>
          )}

          {/* Hashtags in Instagram Blue */}
          <div className="mt-1 flex flex-wrap gap-x-1.5 gap-y-0.5 text-xs text-[#00376b] font-normal">
            {currentArtwork.tags.map((tag) => (
              <span key={tag} className="hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Timestamp */}
        <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium mt-1.5">
          {currentArtwork.timeAgo}
        </p>
      </div>
    </article>
  );
};
