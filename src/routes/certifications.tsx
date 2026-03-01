import { createFileRoute, Link } from "@tanstack/react-router";
import CertificationsSection from "@/sections/certifications";
import { ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { sectionMetadata } from "@/utilities/seo";
import { motion } from "framer-motion";

export const Route = createFileRoute("/certifications")({
  component: CertificationsPage,
});

export function CertificationsPage() {
  useSEO({ metadata: sectionMetadata.certifications });

  return (
    <div className="bg-grid min-h-screen p-2 sm:p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto max-w-6xl space-y-4"
      >
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-foreground/60 hover:text-foreground hover:bg-custom-secondary/80 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            Home
          </Link>
          <span className="text-foreground/20">/</span>
          <h1 className="text-foreground text-xl font-bold sm:text-2xl">
            Certifications
          </h1>
        </div>
        <div className="bg-background/60 border-default rounded-xl border p-4 shadow-sm backdrop-blur-sm">
          <CertificationsSection />
        </div>
      </motion.div>
    </div>
  );
}
