/**
 * SEO Utility Functions
 * Centralized SEO metadata generation for the portfolio
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
}

export interface SchemaOrgData {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

/**
 * Base URL for the portfolio
 */
export const SITE_URL = "https://namias.tech";
export const SITE_NAME = "Jhon Keneth Namias Portfolio";
export const SITE_AUTHOR = "Jhon Keneth Namias";
export const SITE_TWITTER = "@PP_Namias";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Generate full title with site name
 */
export const generateTitle = (pageTitle?: string): string => {
  if (!pageTitle) {
    return `${SITE_AUTHOR} - Full-Stack Developer & Data Analyst | Portfolio`;
  }
  return `${pageTitle} | ${SITE_AUTHOR}`;
};

/**
 * Generate canonical URL
 */
export const generateCanonicalUrl = (path: string = ""): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
};

/**
 * Section-specific SEO metadata
 */
export const sectionMetadata: Record<string, SEOMetadata> = {
  home: {
    title: "Full-Stack Developer & Data Analyst",
    description:
      "Portfolio of Jhon Keneth Namias, a passionate software developer and data analyst specializing in web development, data science, and modern technologies. Expert in React, TypeScript, Python, and Machine Learning.",
    keywords: [
      "Jhon Keneth Namias",
      "PP Namias",
      "portfolio",
      "software developer",
      "data analyst",
      "web development",
      "data science",
      "React",
      "TypeScript",
      "Python",
      "machine learning",
      "full-stack developer",
    ],
    url: SITE_URL,
    type: "website",
    image: DEFAULT_OG_IMAGE,
  },
  projects: {
    title: "Projects - Software Development Portfolio",
    description:
      "Explore my portfolio of software projects including web applications, data science projects, and open-source contributions. Built with React, TypeScript, Python, Node.js, and modern frameworks.",
    keywords: [
      "projects",
      "portfolio",
      "web applications",
      "React projects",
      "TypeScript projects",
      "Python projects",
      "open source",
      "GitHub projects",
    ],
    url: `${SITE_URL}/projects`,
    type: "website",
    section: "Projects",
  },
  career: {
    title: "Career Snapshot - Professional Experience",
    description:
      "Professional experience and career highlights of Jhon Keneth Namias. Full-stack development, data analytics, and software engineering expertise across multiple industries.",
    keywords: [
      "career",
      "experience",
      "work history",
      "professional experience",
      "software engineer",
      "developer career",
    ],
    url: `${SITE_URL}/#career-snapshot`,
    type: "website",
    section: "Career",
  },
  certifications: {
    title: "Certifications - Professional Credentials",
    description:
      "Professional certifications and credentials of Jhon Keneth Namias in software development, data science, cloud computing, and modern technologies.",
    keywords: [
      "certifications",
      "credentials",
      "professional development",
      "certificates",
      "tech certifications",
      "cloud certifications",
    ],
    url: `${SITE_URL}/certifications`,
    type: "website",
    section: "Certifications",
  },
  gallery: {
    title: "Gallery - Photos & Moments",
    description:
      "A visual gallery showcasing moments, events, and achievements from the journey of Jhon Keneth Namias in technology and software development.",
    keywords: [
      "gallery",
      "photos",
      "moments",
      "events",
      "achievements",
      "tech events",
    ],
    url: `${SITE_URL}/gallery`,
    type: "website",
    section: "Gallery",
  },
  contact: {
    title: "Contact - Get In Touch",
    description:
      "Get in touch with Jhon Keneth Namias for software development projects, collaborations, or consulting opportunities. Available for freelance and full-time positions.",
    keywords: [
      "contact",
      "hire developer",
      "freelance developer",
      "collaboration",
      "software consulting",
      "get in touch",
    ],
    url: `${SITE_URL}/#contact`,
    type: "website",
    section: "Contact",
  },
};

/**
 * Generate Person Schema.org markup
 */
export const generatePersonSchema = (): SchemaOrgData => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jhon Keneth Namias",
  alternateName: "PP Namias",
  url: SITE_URL,
  image: `${SITE_URL}/assets/profile-2Km2xmVG.webp`,
  sameAs: [
    "https://github.com/PP-Namias",
    "https://www.linkedin.com/in/pp-namias/",
    "https://x.com/PP_Namias",
    "https://www.facebook.com/jhon.keneth.namias.2024/",
  ],
  jobTitle: "Full-Stack Developer & Data Analyst",
  worksFor: {
    "@type": "Organization",
    name: "Freelance",
  },
  knowsAbout: [
    "Web Development",
    "Data Science",
    "Machine Learning",
    "React",
    "TypeScript",
    "Python",
    "Node.js",
    "API Development",
    "Cloud Computing",
    "Full-Stack Development",
  ],
  email: "pp.namias@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "PH",
  },
});

/**
 * Generate WebSite Schema.org markup
 */
export const generateWebsiteSchema = (): SchemaOrgData => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Portfolio showcasing projects, skills, and experience of Jhon Keneth Namias",
  author: {
    "@type": "Person",
    name: SITE_AUTHOR,
  },
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/#search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

/**
 * Generate ProfilePage Schema.org markup
 */
export const generateProfileSchema = (): SchemaOrgData => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Jhon Keneth Namias",
    alternateName: "PP Namias",
    identifier: "pp-namias",
    description:
      "Full-Stack Developer & Data Analyst specializing in modern web technologies and data science",
    image: `${SITE_URL}/assets/profile-2Km2xmVG.webp`,
    sameAs: [
      "https://github.com/PP-Namias",
      "https://www.linkedin.com/in/pp-namias/",
      "https://x.com/PP_Namias",
    ],
  },
});

/**
 * Generate BreadcrumbList Schema.org markup
 */
export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
): SchemaOrgData => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Generate CreativeWork Schema.org markup for projects
 */
export const generateProjectSchema = (project: {
  name: string;
  description: string;
  url?: string;
  image?: string;
  dateCreated?: string;
  author?: string;
}): SchemaOrgData => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: project.name,
  description: project.description,
  url: project.url || SITE_URL,
  image: project.image || DEFAULT_OG_IMAGE,
  author: {
    "@type": "Person",
    name: project.author || SITE_AUTHOR,
  },
  dateCreated: project.dateCreated,
  inLanguage: "en-US",
});

/**
 * Generate ItemList Schema.org markup for project galleries
 */
export const generateItemListSchema = (
  items: Array<{ name: string; description: string; url?: string }>,
  listName: string = "Projects"
): SchemaOrgData => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: listName,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    description: item.description,
    url: item.url || SITE_URL,
  })),
});

/**
 * Generate meta tags array for dynamic insertion
 */
export const generateMetaTags = (metadata: SEOMetadata): Array<{
  name?: string;
  property?: string;
  content: string;
}> => {
  const fullTitle = generateTitle(metadata.title);
  const canonicalUrl = metadata.url || SITE_URL;
  const image = metadata.image || DEFAULT_OG_IMAGE;

  return [
    // Primary Meta Tags
    { name: "title", content: fullTitle },
    { name: "description", content: metadata.description },
    ...(metadata.keywords
      ? [{ name: "keywords", content: metadata.keywords.join(", ") }]
      : []),
    { name: "author", content: metadata.author || SITE_AUTHOR },

    // Open Graph
    { property: "og:type", content: metadata.type || "website" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: metadata.description },
    { property: "og:image", content: image },
    { property: "og:site_name", content: SITE_NAME },
    ...(metadata.publishedTime
      ? [{ property: "og:published_time", content: metadata.publishedTime }]
      : []),
    ...(metadata.modifiedTime
      ? [{ property: "og:modified_time", content: metadata.modifiedTime }]
      : []),
    ...(metadata.section
      ? [{ property: "og:section", content: metadata.section }]
      : []),

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:url", content: canonicalUrl },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: metadata.description },
    { name: "twitter:image", content: image },
    { name: "twitter:site", content: SITE_TWITTER },
    { name: "twitter:creator", content: SITE_TWITTER },
  ];
};

/**
 * Update document meta tags dynamically
 */
export const updateMetaTags = (metadata: SEOMetadata): void => {
  const metaTags = generateMetaTags(metadata);

  // Update title
  document.title = generateTitle(metadata.title);

  // Update or create meta tags
  metaTags.forEach(({ name, property, content }) => {
    const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
    let element = document.querySelector(selector);

    if (!element) {
      element = document.createElement("meta");
      if (name) element.setAttribute("name", name);
      if (property) element.setAttribute("property", property);
      document.head.appendChild(element);
    }

    element.setAttribute("content", content);
  });

  // Update canonical link
  const canonicalUrl = metadata.url || SITE_URL;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", canonicalUrl);
};

/**
 * Insert JSON-LD structured data
 */
export const insertStructuredData = (
  schema: SchemaOrgData,
  id: string = "structured-data"
): void => {
  // Remove existing script if present
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Create new script element
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * Remove structured data by id
 */
export const removeStructuredData = (id: string): void => {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
};
