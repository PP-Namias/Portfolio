export type MediaType = "image" | "video" | "gif";

export interface GalleryDimensions {
  width: number;
  height: number;
  aspectRatio: string;
}

export interface GalleryItem {
  title: string;
  mediaType: MediaType;
  media: string;
  image?: string; // For backward compatibility
  thumbnail?: string;
  description?: string;
  issuer?: string; // For certifications and credits
  tags: string[];
  createdAt?: string;
  issuedAt?: string; // For backward compatibility
  dimensions?: GalleryDimensions;
}

export interface GalleryFilterState {
  activeFilter: "all" | MediaType;
  searchQuery: string;
}
