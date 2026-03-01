import resume from "@/assets/portfolio-resources/assets/documents/resume.pdf";
import experiences from "@/assets/portfolio-resources/data/experiences.json";
import certifications from "@/assets/portfolio-resources/data/certifications.json";
import gallery from "@/assets/portfolio-resources/data/gallery.json";
import projects from "@/assets/portfolio-resources/data/projects.json";
import socials from "@/assets/portfolio-resources/data/socials.json";
import technologies from "@/assets/portfolio-resources/data/technologies.json";
import profile from "@/assets/portfolio-resources/data/profile.json";
import recommendations from "@/assets/portfolio-resources/data/recommendations.json";
import memberships from "@/assets/portfolio-resources/data/memberships.json";
import JsFileDownloader from "js-file-downloader";
import type { ICoreService } from "./interface";
import type {
  Certification,
  Experience,
  GalleryItem,
  Membership,
  Project,
  Recommendation,
  Social,
  Technology,
  Profile,
} from "./types";

export class CoreService implements ICoreService {
  constructor() {
    this.getTechnologies = this.getTechnologies.bind(this);
    this.getProjects = this.getProjects.bind(this);
    this.getCertifications = this.getCertifications.bind(this);
    this.getGallery = this.getGallery.bind(this);
    this.getResumeUrl = this.getResumeUrl.bind(this);
    this.getSocials = this.getSocials.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getRecommendations = this.getRecommendations.bind(this);
    this.getMemberships = this.getMemberships.bind(this);
  }

  async getTechnologies(): ReturnType<ICoreService["getTechnologies"]> {
    return technologies as Technology[];
  }

  async getSocials(): ReturnType<ICoreService["getSocials"]> {
    return socials as Social[];
  }

  getResumeUrl(): ReturnType<ICoreService["getResumeUrl"]> {
    return resume;
  }

  async downloadResume(): ReturnType<ICoreService["downloadResume"]> {
    return await new JsFileDownloader({
      url: resume,
      filename: "RESUME_NAMIAS-JHON-KENETH.pdf",
      method: "GET",
    });
  }

  async getProjects(): ReturnType<ICoreService["getProjects"]> {
    return projects as Project[];
  }

  async getExperiences(): ReturnType<ICoreService["getExperiences"]> {
    return experiences as Experience[];
  }

  async getCertifications(): ReturnType<ICoreService["getCertifications"]> {
    return certifications as Certification[];
  }

  async getGallery(): ReturnType<ICoreService["getGallery"]> {
    return gallery as GalleryItem[];
  }

  async getProfile(): ReturnType<ICoreService["getProfile"]> {
    return profile as Profile;
  }

  async getRecommendations(): ReturnType<ICoreService["getRecommendations"]> {
    return recommendations as Recommendation[];
  }

  async getMemberships(): ReturnType<ICoreService["getMemberships"]> {
    return memberships as Membership[];
  }
}
