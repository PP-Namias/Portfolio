"use client";

import { useEffect, useRef } from "react";

type Position = { x: number; y: number };

const SPARKLE = "\u2726";
const STAR_ANIMATION_DURATION = 1500;
const MINIMUM_TIME_BETWEEN_STARS = 250;
const MINIMUM_DISTANCE_BETWEEN_STARS = 75;
const GLOW_DURATION = 75;
const MAXIMUM_GLOW_POINT_SPACING = 10;
const STAR_COLORS = ["249 146 253", "252 254 255"];
const STAR_SIZES = ["1.4rem", "1rem", "0.6rem"];
const STAR_ANIMATIONS = ["magic-fall-1", "magic-fall-2", "magic-fall-3"];

const KEYFRAMES_CSS = `
@keyframes magic-fall-1 {
  0% { transform: translate(-50%, -50%) rotateX(45deg) rotateY(30deg) rotateZ(0deg) scale(0.25); opacity: 0; }
  5% { transform: translate(calc(-50% + 10px), calc(-50% - 10px)) rotateX(45deg) rotateY(30deg) rotateZ(0deg) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% + 25px), calc(-50% + 200px)) rotateX(180deg) rotateY(270deg) rotateZ(90deg) scale(1); opacity: 0; }
}
@keyframes magic-fall-2 {
  0% { transform: translate(-50%, -50%) rotateX(-20deg) rotateY(10deg) scale(0.25); opacity: 0; }
  10% { transform: translate(calc(-50% - 10px), calc(-50% - 5px)) rotateX(-20deg) rotateY(10deg) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% - 10px), calc(-50% + 160px)) rotateX(-90deg) rotateY(45deg) scale(0.25); opacity: 0; }
}
@keyframes magic-fall-3 {
  0% { transform: translate(-50%, -50%) rotateX(0deg) rotateY(45deg) scale(0.5); opacity: 0; }
  15% { transform: translate(calc(-50% + 7px), calc(-50% + 5px)) rotateX(0deg) rotateY(45deg) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% + 20px), calc(-50% + 120px)) rotateX(-180deg) rotateY(-90deg) scale(0.5); opacity: 0; }
}
`;

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const selectRandom = <T,>(items: readonly T[]): T =>
  items[rand(0, items.length - 1)];

const calcDistance = (a: Position, b: Position): number => {
  const diffX = b.x - a.x;
  const diffY = b.y - a.y;
  return Math.sqrt(diffX * diffX + diffY * diffY);
};

const getAccentRgb = (): string => {
  if (typeof window === "undefined") return "239 42 201";
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim();
  if (!raw) return "239 42 201";
  return raw.replace(/\s+/g, " ");
};

export function MagicCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const countRef = useRef(0);
  const lastRef = useRef<{
    starTimestamp: number;
    starPosition: Position;
    mousePosition: Position;
  }>({
    starTimestamp: 0,
    starPosition: { x: 0, y: 0 },
    mousePosition: { x: 0, y: 0 },
  });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    const container = containerRef.current;
    if (!container) return;

    lastRef.current.starTimestamp = Date.now();

    const styleEl = document.createElement("style");
    styleEl.textContent = KEYFRAMES_CSS;
    document.head.appendChild(styleEl);

    const createStar = (position: Position) => {
      const star = document.createElement("span");
      const color = selectRandom(STAR_COLORS);
      const animationIndex = countRef.current++ % STAR_ANIMATIONS.length;
      star.style.cssText = [
        "position: absolute",
        "left: 0",
        "top: 0",
        "z-index: 2",
        "pointer-events: none",
        "color: white",
        "line-height: 1",
        "transform: translate(-50%, -50%)",
        "animation-fill-mode: forwards",
        "animation-timing-function: ease-out",
        `left: ${position.x}px`,
        `top: ${position.y}px`,
        `font-size: ${selectRandom(STAR_SIZES)}`,
        `color: rgb(${color})`,
        `text-shadow: 0px 0px 1.5rem rgb(${color} / 0.5)`,
        `animation-name: ${STAR_ANIMATIONS[animationIndex]}`,
        `animation-duration: ${STAR_ANIMATION_DURATION}ms`,
      ].join("; ");
      star.textContent = SPARKLE;
      container.appendChild(star);
      window.setTimeout(() => star.remove(), STAR_ANIMATION_DURATION);
    };

    const createGlowPoint = (position: Position) => {
      const glow = document.createElement("div");
      const accentRgb = getAccentRgb();
      glow.style.cssText = [
        "position: absolute",
        "left: 0",
        "top: 0",
        "width: 0.6rem",
        "height: 0.6rem",
        "border-radius: 9999px",
        `background: rgb(${accentRgb})`,
        `box-shadow: 0rem 0rem 1.2rem 0.6rem rgb(${accentRgb})`,
        "pointer-events: none",
        "transform: translate(-50%, -50%)",
        `left: ${position.x}px`,
        `top: ${position.y}px`,
      ].join("; ");
      container.appendChild(glow);
      window.setTimeout(() => glow.remove(), GLOW_DURATION);
    };

    const determinePointQuantity = (distance: number) =>
      Math.max(Math.floor(distance / MAXIMUM_GLOW_POINT_SPACING), 1);

    const createGlow = (last: Position, current: Position) => {
      const distance = calcDistance(last, current);
      const quantity = determinePointQuantity(distance);
      const dx = (current.x - last.x) / quantity;
      const dy = (current.y - last.y) / quantity;
      for (let index = 0; index < quantity; index += 1) {
        createGlowPoint({
          x: last.x + dx * index,
          y: last.y + dy * index,
        });
      }
    };

    const handleOnMove = (event: MouseEvent | TouchEvent) => {
      const mousePosition: Position =
        "touches" in event
          ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
          : { x: event.clientX, y: event.clientY };

      const last = lastRef.current;
      if (last.mousePosition.x === 0 && last.mousePosition.y === 0) {
        last.mousePosition = mousePosition;
      }

      const now = Date.now();
      const hasMovedFarEnough =
        calcDistance(last.starPosition, mousePosition) >=
        MINIMUM_DISTANCE_BETWEEN_STARS;
      const hasBeenLongEnough =
        now - last.starTimestamp > MINIMUM_TIME_BETWEEN_STARS;

      if (hasMovedFarEnough || hasBeenLongEnough) {
        createStar(mousePosition);
        last.starTimestamp = now;
        last.starPosition = mousePosition;
      }

      createGlow(last.mousePosition, mousePosition);
      last.mousePosition = mousePosition;
    };

    const handleMouseLeave = () => {
      lastRef.current.mousePosition = { x: 0, y: 0 };
    };

    window.addEventListener("mousemove", handleOnMove);
    window.addEventListener("touchmove", handleOnMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleOnMove);
      window.removeEventListener("touchmove", handleOnMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      styleEl.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
