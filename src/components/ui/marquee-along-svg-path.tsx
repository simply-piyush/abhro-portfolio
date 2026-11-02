"use client";

import React, { RefObject, useCallback, useEffect, useRef } from "react";
import {
  SpringOptions,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

// Custom wrap function
const wrap = (min: number, max: number, value: number): number => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

type PreserveAspectRatioAlign =
  | "none"
  | "xMinYMin"
  | "xMidYMin"
  | "xMaxYMin"
  | "xMinYMid"
  | "xMidYMid"
  | "xMaxYMid"
  | "xMinYMax"
  | "xMidYMax"
  | "xMaxYMax";

interface CSSVariableInterpolation {
  property: string;
  from: number | string;
  to: number | string;
}

type PreserveAspectRatioMeetOrSlice = "meet" | "slice";

type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`;

interface MarqueeAlongSvgPathProps {
  children: React.ReactNode;
  className?: string;

  // Path properties
  path: string;
  pathId?: string;
  preserveAspectRatio?: PreserveAspectRatio;
  showPath?: boolean;

  // SVG properties
  width?: string | number;
  height?: string | number;
  viewBox?: string;

  // Marquee properties
  baseVelocity?: number;
  direction?: "normal" | "reverse";
  easing?: (value: number) => number;
  slowdownOnHover?: boolean;
  slowDownFactor?: number;
  slowDownSpringConfig?: SpringOptions;

  // Scroll properties
  useScrollVelocity?: boolean;
  scrollAwareDirection?: boolean;
  scrollSpringConfig?: SpringOptions;
  scrollContainer?: RefObject<HTMLElement | null> | HTMLElement | null;

  // Item repetition
  repeat?: number;

  // Drag properties
  draggable?: boolean;
  dragSensitivity?: number;
  dragVelocityDecay?: number;
  dragAwareDirection?: boolean;
  grabCursor?: boolean;

  // Z-index properties
  enableRollingZIndex?: boolean;
  zIndexBase?: number;
  zIndexRange?: number;

  cssVariableInterpolation?: CSSVariableInterpolation[];

  // Responsive properties
  responsive?: boolean;
  stretchWidth?: boolean;
}

const MarqueeAlongSvgPath = ({
  children,
  className,

  // Path defaults
  path,
  pathId,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,

  // SVG defaults
  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",

  // Marquee defaults
  baseVelocity = 5,
  direction = "normal",
  easing,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },

  // Scroll defaults
  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,

  // Items repetition
  repeat = 3,

  // Drag defaults
  draggable = false,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  grabCursor = false,

  // Z-index defaults
  enableRollingZIndex = true,
  zIndexBase = 1,
  zIndexRange = 10,

  cssVariableInterpolation = [],

  // Responsive defaults
  responsive = false,
  stretchWidth = false,
}: MarqueeAlongSvgPathProps) => {
  const container = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const baseOffset = useMotionValue(0);

  const pathRef = useRef<SVGPathElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Pause animation loop when out of view to eliminate scroll lag
  const inView = useInView(container, { margin: "250px 0px" });

  // Responsive scaling using direct DOM manipulation (no re-renders)
  useEffect(() => {
    if (!responsive) return;

    const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
    const originalWidth = vbWidth || 100;
    const originalHeight = vbHeight || 100;

    const updateScale = () => {
      const wrapper = container.current;
      const marqueeContainer = marqueeContainerRef.current;
      if (!wrapper || !marqueeContainer) return;

      const wrapperWidth = wrapper.clientWidth;
      const wrapperHeight = wrapper.clientHeight;

      const scaleX = wrapperWidth / originalWidth;
      const scaleY = wrapperHeight / originalHeight;
      // On mobile viewports, maintain a minimum scale of 0.85 so icons remain big, prominent, and thumb-friendly
      const minMobileScale = 0.85;
      const scale = stretchWidth ? Math.max(scaleX, minMobileScale) : Math.min(scaleX, scaleY);

      // Calculate the scaled dimensions
      const scaledWidth = originalWidth * scale;
      const scaledHeight = originalHeight * scale;

      // When stretching width, dynamically size the wrapper to exact scaled height to eliminate bottom clipping
      if (stretchWidth) {
        wrapper.style.height = `${scaledHeight}px`;
      }

      // Stretch edge-to-edge horizontally when screen >= scaledWidth, or center smoothly on small mobile viewports
      const offsetX = stretchWidth ? Math.min(0, (wrapperWidth - scaledWidth) / 2) : (wrapperWidth - scaledWidth) / 2;
      // Vertically align at 0 when stretchWidth is true, or center if container is larger
      const offsetY = stretchWidth ? 0 : Math.max(0, (wrapperHeight - scaledHeight) / 2);

      // Set fixed dimensions on the container
      marqueeContainer.style.width = `${originalWidth}px`;
      marqueeContainer.style.height = `${originalHeight}px`;

      // Apply scale and position to center/stretch
      marqueeContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      marqueeContainer.style.transformOrigin = "top left";
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [responsive, stretchWidth, viewBox]);

  // Create an array of items outside of the render function
  const items = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);

    return childrenArray.flatMap((child, childIndex) =>
      Array.from({ length: repeat }, (_, repeatIndex) => {
        const itemIndex = repeatIndex * childrenArray.length + childIndex;
        const key = `${childIndex}-${repeatIndex}`;
        return {
          child,
          childIndex,
          repeatIndex,
          itemIndex,
          key,
        };
      })
    );
  }, [children, repeat]);

  // Function to calculate z-index based on offset distance
  const calculateZIndex = useCallback(
    (offsetDistance: number) => {
      if (!enableRollingZIndex) {
        return undefined;
      }
      const normalizedDistance = offsetDistance / 100;
      return Math.floor(zIndexBase + normalizedDistance * zIndexRange);
    },
    [enableRollingZIndex, zIndexBase, zIndexRange]
  );

  // Generate a random ID for the path if not provided
  const id = pathId || `marquee-path-${Math.random().toString(36).substring(7)}`;

  // Hover and drag state tracking
  const isHovered = useRef(false);
  const isDragging = useRef(false);
  const dragVelocity = useRef(0);

  // Direction factor for changing direction based on scroll or drag
  const directionFactor = useRef(direction === "normal" ? 1 : -1);

  // Motion values for animation
  const hoverFactorValue = useMotionValue(1);
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig);

  // Animation frame handler
  useAnimationFrame((_, delta) => {
    if (!inView) return;

    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocity.current);

      // Add decay to dragVelocity
      dragVelocity.current *= 0.9;

      // Stop completely if velocity is very small
      if (Math.abs(dragVelocity.current) < 0.01) {
        dragVelocity.current = 0;
      }
    } else {
      // Update hover factor
      if (isHovered.current) {
        hoverFactorValue.set(slowdownOnHover ? slowDownFactor : 1);
      } else {
        hoverFactorValue.set(1);
      }

      // Calculate regular movement
      let moveBy =
        directionFactor.current *
        baseVelocity *
        (delta / 1000) *
        smoothHoverFactor.get();

      if (draggable) {
        moveBy += dragVelocity.current;

        // Update direction based on drag direction if dragAwareDirection is true
        if (dragAwareDirection && Math.abs(dragVelocity.current) > 0.1) {
          directionFactor.current = Math.sign(dragVelocity.current);
        }

        // Gradually decay drag velocity back to zero
        if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
          dragVelocity.current *= dragVelocityDecay;
        } else if (!isDragging.current) {
          dragVelocity.current = 0;
        }
      }

      baseOffset.set(baseOffset.get() + moveBy);
    }

    // Direct DOM property assignment (10x faster than 48 reactive useTransform subscriptions)
    const currentOffset = baseOffset.get();
    const totalItems = items.length;
    for (let i = 0; i < totalItems; i++) {
      const item = items[i];
      const el = itemRefs.current.get(item.key);
      if (!el) continue;
      const position = (item.itemIndex * 100) / totalItems;
      const wrappedValue = wrap(0, 100, currentOffset + position);
      const finalOffset = easing ? easing(wrappedValue / 100) * 100 : wrappedValue;
      el.style.offsetDistance = `${finalOffset}%`;
      if (enableRollingZIndex) {
        const z = calculateZIndex(wrappedValue);
        if (z !== undefined) el.style.zIndex = `${z}`;
      }
    }
  });

  // Pointer event handlers for dragging
  const lastPointerPosition = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (grabCursor) {
      (e.currentTarget as HTMLElement).style.cursor = "grabbing";
    }

    isDragging.current = true;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };

    // Pause automatic animation by setting velocity to 0
    dragVelocity.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggable || !isDragging.current) return;

    const currentPosition = { x: e.clientX, y: e.clientY };

    // Calculate movement delta - simplified for path movement
    const deltaX = currentPosition.x - lastPointerPosition.current.x;
    const deltaY = currentPosition.y - lastPointerPosition.current.y;

    // For path following, we use a simple magnitude of movement
    const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const projectedDelta = deltaX > 0 ? delta : -delta;

    // Update drag velocity based on the projected movement
    dragVelocity.current = projectedDelta * dragSensitivity;

    // Update last position
    lastPointerPosition.current = currentPosition;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggable) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    isDragging.current = false;

    if (grabCursor) {
      (e.currentTarget as HTMLElement).style.cursor = "grab";
    }
  };

  return (
    <div
      ref={container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: draggable ? "none" : "pan-y" }}
      className={cn("relative select-none", className)}
    >
      <div
        ref={marqueeContainerRef}
        className="relative"
        style={{ contain: "layout style" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={viewBox}
          preserveAspectRatio={preserveAspectRatio}
          className="w-full h-full"
        >
          <path
            id={id}
            d={path}
            stroke={showPath ? "currentColor" : "none"}
            fill="none"
            ref={pathRef}
          />
        </svg>

        {items.map(({ child, repeatIndex, key }) => {
          return (
            <div
              key={key}
              ref={(el) => {
                if (el) itemRefs.current.set(key, el);
              }}
              className={cn(
                "absolute top-0 left-0 hover:!z-50",
                draggable && grabCursor && "cursor-grab"
              )}
              style={
                {
                  offsetPath: `path('${path}')`,
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                } as any
              }
              aria-hidden={repeatIndex > 0}
              onMouseEnter={() => (isHovered.current = true)}
              onMouseLeave={() => (isHovered.current = false)}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarqueeAlongSvgPath;
