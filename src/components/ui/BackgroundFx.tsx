"use client";

import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export function BackgroundFx() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <DottedGlowBackground
        className="mask-radial-fade"
        opacity={0.45}
        gap={16}
        radius={1.4}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.3}
        speedScale={0.8}
      />
    </div>
  );
}
