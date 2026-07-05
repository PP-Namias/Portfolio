import { sanityFetch } from "./fetch";
import { QUERIES } from "./queries";

export interface AwardData {
  title: string;
  prize: string;
  date: string;
  category: string;
  description: string;
  url: string;
  image: { asset: { url: string } } | null;
}

export async function getAwards() {
  return sanityFetch<AwardData[]>(QUERIES.awards, undefined, {
    tags: ["cms:awards"],
  });
}
