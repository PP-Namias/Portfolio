"use client";

import { useLivePreview } from "@sanity/preview-kit";
import { client } from "@/sanity/lib/client";
import { QUERIES } from "@/sanity/lib/queries";

export function SanityLive() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        right: 8,
        background: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "4px 8px",
        borderRadius: 4,
        fontSize: 11,
        zIndex: 9999,
      }}
    >
      Sanity Live
    </div>
  );
}

interface LivePreviewProviderProps {
  children: React.ReactNode;
}

export function LivePreviewProvider({ children }: LivePreviewProviderProps) {
  const { data, isLoading } = useLivePreview({
    preview: true,
    query: QUERIES.profile,
    params: {},
  });

  if (isLoading) {
    return <div style={{ opacity: 0.5 }}>{children}</div>;
  }

  return <>{children}</>;
}
