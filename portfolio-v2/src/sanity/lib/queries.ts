export const QUERIES = {
  profile: `*[_type == "profile"][0]{
    firstName,
    lastName,
    displayName,
    username,
    title,
    email,
    phone,
    location,
    website,
    dailyDev,
    avatar{
      asset->{
        url,
        metadata{
          dimensions,
          lqip
        }
      }
    },
    about,
    aboutText,
    socialLinks[]->{
      platform,
      handle,
      url,
      isPrimary
    },
    education[]->{
      institution,
      degree,
      field,
      startYear,
      endYear,
      gpa,
      honors,
      activities
    },
    availability,
    resumeUrl
  }`,

  siteSettings: `*[_type == "siteSettings"][0]{
    siteTitle,
    siteDescription,
    ogImage,
    favicon,
    accentColor,
    footerText,
    ga4Id,
    posthogToken,
    openpanelClientId
  }`,

  projects: `*[_type == "project"] | order(order asc, featured desc, title asc){
    title,
    slug,
    summary,
    description,
    category,
    technologies,
    image{
      asset->{
        url,
        metadata{
          dimensions,
          lqip
        }
      }
    },
    gallery[]{
      asset->{
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      caption,
      alt
    },
    liveUrl,
    repoUrl,
    featured,
    order,
    status
  }`,

  experiences: `*[_type == "experience"] | order(order asc, startDate desc){
    role,
    company,
    location,
    startDate,
    endDate,
    employmentType,
    description,
    skills,
    highlights,
    order
  }`,

  certifications: `*[_type == "certification"] | order(order asc, issuedAt desc){
    title,
    issuer,
    issuedAt,
    expiresAt,
    credentialUrl,
    category->{
      title,
      slug
    },
    image{
      asset->{
        url,
        metadata{
          dimensions,
          lqip
        }
      }
    },
    order
  }`,

  education: `*[_type == "education"] | order(startYear desc){
    institution,
    degree,
    field,
    startYear,
    endYear,
    gpa,
    honors,
    activities
  }`,

  socialLinks: `*[_type == "socialLink"] | order(isPrimary desc, platform asc){
    platform,
    handle,
    url,
    isPrimary
  }`,

  testimonials: `*[_type == "testimonial"] | order(featured desc, _createdAt asc){
    quote,
    author,
    role,
    company,
    avatar,
    rating,
    featured
  }`,

  awards: `*[_type == "award"] | order(date desc){
    title,
    prize,
    date,
    category,
    description,
    url,
    image
  }`,

  bookmarks: `*[_type == "bookmark"] | order(category asc, title asc){
    title,
    url,
    description,
    category,
    favicon
  }`,

  techStack: `*[_type == "techStack"][0]{
    title,
    technologies[]{
      name,
      icon,
      category,
      proficiency,
      url
    }
  }`,

  posts: `*[_type == "post" && published == true && defined(slug.current)] | order(publishedAt desc){
    title,
    slug,
    excerpt,
    mainImage{
      asset->{
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      caption,
      alt
    },
    publishedAt,
    categories[]->{
      title,
      slug
    },
    tags
  }`,

  postBySlug: `*[_type == "post" && slug.current == $slug][0]{
    title,
    slug,
    excerpt,
    body,
    mainImage{
      asset->{
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      caption,
      alt
    },
    publishedAt,
    categories[]->{
      title,
      slug
    },
    tags
  }`,
} as const;
