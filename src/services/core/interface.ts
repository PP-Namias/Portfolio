import type {
  Certification,
  Experience,
  Project,
  Social,
  Technology,
} from "./types";

export interface ICoreService {
  getTechnologies(): Promise<Technology[]>;
  getProjects(): Promise<Project[]>;
  getCertifications(): Promise<Certification[]>;
  getResumeUrl(): string;
  getExperiences(): Promise<Experience[]>;
  getSocials(): Promise<Social[]>;
  downloadResume(): Promise<void>;
}
