"use client";

import { useEffect, useRef } from "react";

type Position = { x: number; y: number };

const GLOW_RGB = "239 42 201";
const SPARKLE = "\u2726";
const STAR_ANIMATION_DURATION = 1500;
const MINIMUM_TIME_BETWEEN_STARS = 250;
const MINIMUM_DISTANCE_BETWEEN_STARS = 75;
const GLOW_DURATION = 75;
const MAXIMUM_GLOW_POINT_SPACING = 10;
const STAR_COLORS = ["249 146 253", "252 254 255"];
const STAR_SIZES = ["1.4rem", "1rem", "0.6rem"];
const STAR_ANIMATIONS = ["magic-fall-1", "magic-fall-2", "magic-fall-3"];

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const selectRandom = <T,>(items: readonly T[]): T =>
  items[rand(0, items.length - 1)];

const px = (value: number) => `${value}px`;
const ms = (value: number) => `${value}ms`;

const calcDistance = (a: Position, b: Position): number => {
  const diffX = b.x - a.x;
  const diffY = b.y - a.y;
  return Math.sqrt(diffX * diffX + diffY * diffY);
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
    const container = containerRef.current;
    if (!container) return;

    lastRef.current.starTimestamp = Date.now();

    const createStar = (position: Position) => {
      const star = document.createElement("span");
      const color = selectRandom(STAR_COLORS);
      star.className = "magic-star";
      star.textContent = SPARKLE;
      star.style.left = px(position.x);
      star.style.top = px(position.y);
      star.style.fontSize = selectRandom(STAR_SIZES);
      star.style.color = `rgb(${color})`;
      star.style.textShadow = `0px 0px 1.5rem rgb(${color} / 0.5)`;
      star.style.animationName =
        STAR_ANIMATIONS[countRef.current++ % STAR_ANIMATIONS.length];
      star.style.animationDuration = ms(STAR_ANIMATION_DURATION);
      container.appendChild(star);
      setTimeout(() => star.remove(), STAR_ANIMATION_DURATION);
    };

    const createGlowPoint = (position: Position) => {
      const glow = document.createElement("div");
      glow.className = "magic-glow-point";
      glow.style.left = px(position.x);
      glow.style.top = px(position.y);
      container.appendChild(glow);
      setTimeout(() => glow.remove(), GLOW_DURATION);
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
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    />
  );
}
