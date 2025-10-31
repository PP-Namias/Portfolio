import resume from "@/assets/portfolio-resources/assets/documents/resume.pdf";
import experiences from "@/assets/portfolio-resources/data/experiences.json";
import certifications from "@/assets/portfolio-resources/data/certifications.json";
import projects from "@/assets/portfolio-resources/data/projects.json";
import socials from "@/assets/portfolio-resources/data/socials.json";
import technologies from "@/assets/portfolio-resources/data/technologies.json";
import JsFileDownloader from "js-file-downloader";
import type { ICoreService } from "./interface";
import type {
  Certification,
  Experience,
  Project,
  Social,
  Technology,
} from "./types";

export class CoreService implements ICoreService {
  constructor() {
    this.getTechnologies = this.getTechnologies.bind(this);
    this.getProjects = this.getProjects.bind(this);
    this.getCertifications = this.getCertifications.bind(this);
    this.getResumeUrl = this.getResumeUrl.bind(this);
    this.getSocials = this.getSocials.bind(this);
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
      filename: "RESUME_CABRERA-JENJADE.pdf",
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
}
