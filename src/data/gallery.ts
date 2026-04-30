import { GalleryItem } from '@/types';
import galleryData from '../../portfolio-resources/data/gallery.json';
import { safeFetchSanity } from '@/lib/sanity';

export const galleryImages: GalleryItem[] = galleryData;

export async function getGalleryImages(): Promise<GalleryItem[]> {
  const query = '*[_type == "gallery"] | order(order asc)';
  return safeFetchSanity<GalleryItem[]>(query, galleryData);
}
