import { GalleryItem } from '@/types';
import galleryData from '../../portfolio-resources/data/gallery.json';
import { safeFetchSanity } from '@/lib/sanity';

export const galleryImages: GalleryItem[] = galleryData;

export async function getGalleryImages(): Promise<GalleryItem[]> {
  const query = '*[_type == "galleryItem"] | order(order asc) {..., "media": media.asset->url}';
  return safeFetchSanity<GalleryItem[]>(query, galleryData);
}
