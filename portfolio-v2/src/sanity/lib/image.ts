import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { projectId, dataset } from "./client";

const builder = imageUrlBuilder({ projectId, dataset });

export function sanityImage(source: SanityImageSource) {
  return builder.image(source);
}

export function sanityImageProxy(source: SanityImageSource, width?: number, quality?: number) {
  let img = builder.image(source);
  if (width) img = img.width(width);
  if (quality) img = img.quality(quality);
  return img.url();
}
