import { sanityFetch } from "./fetch";
import { QUERIES } from "./queries";

export interface TestimonialData {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: { asset: { url: string } } | null;
  rating: number;
  featured: boolean;
}

export async function getTestimonials() {
  return sanityFetch<TestimonialData[]>(QUERIES.testimonials, undefined, {
    tags: ["cms:testimonials"],
  });
}
