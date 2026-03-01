import { createFileRoute, Link } from "@tanstack/react-router";
import CertificationsSection from "@/sections/certifications";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { sectionMetadata } from "@/utilities/seo";

export const Route = createFileRoute("/certifications")({
  component: CertificationsPage,
});

export function CertificationsPage() {
  useSEO({ metadata: sectionMetadata.certifications });

  return (
    <div className="bg-custom-background min-h-screen p-2 sm:p-4 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center gap-3">
          <Button
            as={Link}
            to="/"
            size="sm"
            variant="light"
            className="text-foreground gap-1 font-semibold"
            startContent={<ArrowLeft className="size-4" />}
          >
            Back
          </Button>
          <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
            All Certifications
          </h1>
        </div>
        <div className="bg-background rounded-xl p-4">
          <CertificationsSection />
        </div>
      </div>
    </div>
  );
}
