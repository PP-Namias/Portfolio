import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2026-02-19";

function getClient(perspective: "published" | "previewDrafts" = "published") {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: perspective === "published",
    perspective,
    stega:
      perspective === "previewDrafts"
        ? { studioUrl: "/studio" }
        : false,
  });
}

export const sanityClient = getClient("published");
export const previewClient = getClient("previewDrafts");
export const client = sanityClient;

export function pickClient(isPreview = false) {
  return isPreview ? previewClient : sanityClient;
}

const builder = imageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function urlForPreview(source: SanityImageSource) {
  return builder.image(source).width(800).quality(80);
}

export type { SanityImageSource };
export { projectId, dataset, apiVersion };
