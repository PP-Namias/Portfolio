export type Project = {
  title: string;
  image: string;
  description: string;
  repositoryURL: string;
  liveURL: string | null;
  processURL: string | null;
  tags: string[];
  year: number;
};

export type Certification = {
  title: string;
  image: string;
  issuer: string;
  issuedAt: string;
  tags: string[];
};

export type FieldInterest = {
  name: string;
  bits: string[];
  former?: boolean;
};

export type Social = {
  name: string;
  label: string;
  link: string;
};

export type Technology = {
  name: string;
  logo: string;
  category: string;
};

export type Experience = {
  company: string;
  position: string;
  summary: string;
  country: string;
  modality: string;
  type: string;
  startedAt: string;
  endedAt: string | null;
  technologies: string[];
  highlights: string[];
};
