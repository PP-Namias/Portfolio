import { sanityFetch } from "./fetch";
import { QUERIES } from "./queries";

export interface BookmarkData {
  title: string;
  url: string;
  description: string;
  category: string;
  favicon: string;
}

export async function getBookmarks() {
  return sanityFetch<BookmarkData[]>(QUERIES.bookmarks, undefined, {
    tags: ["cms:bookmarks"],
  });
}
