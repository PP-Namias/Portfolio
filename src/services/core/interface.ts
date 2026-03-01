import type {
  Certification,
  Experience,
  GalleryItem,
  Project,
  Recommendation,
  Social,
  Technology,
  Profile,
} from "./types";

export interface ICoreService {
  getTechnologies(): Promise<Technology[]>;
  getProjects(): Promise<Project[]>;
  getCertifications(): Promise<Certification[]>;
  getGallery(): Promise<GalleryItem[]>;
  getResumeUrl(): string;
  getExperiences(): Promise<Experience[]>;
  getSocials(): Promise<Social[]>;
  downloadResume(): Promise<void>;
  getProfile(): Promise<Profile>;
  getRecommendations(): Promise<Recommendation[]>;
}
