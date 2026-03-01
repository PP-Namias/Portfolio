import { Footer } from "@/components/partials/footer";
import { FloatingActionButton } from "@/components/common/floating-action-button";
import { HomeCard } from "@/components/features/profile/home-card";
import { createFileRoute } from "@tanstack/react-router";
import { useSEO } from "@/hooks/use-seo";
import {
  sectionMetadata,
  generatePersonSchema,
  generateWebsiteSchema,
  generateProfileSchema,
} from "@/utilities/seo";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  useSEO({
    metadata: sectionMetadata.home,
    schema: [
      generatePersonSchema(),
      generateWebsiteSchema(),
      generateProfileSchema(),
    ],
  });

  return (
    <div className="bg-grid min-h-screen">
      <FloatingActionButton />
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <HomeCard />
        <div className="mt-6 w-full max-w-sm">
          <Footer />
        </div>
      </div>
    </div>
  );
}
