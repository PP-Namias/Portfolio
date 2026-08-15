import { fetchSanity } from './client';
import type {
  AboutSectionDoc,
  CertificationDoc,
  ExperienceDoc,
  MembershipDoc,
  PostDoc,
  ProfileDoc,
  ProjectDoc,
  RecommendationDoc,
  TechStackDoc,
} from './types';

export async function fetchProfile(): Promise<ProfileDoc | null> {
  const docs = await fetchSanity<ProfileDoc>(
    '*[_type == "profile"][0]{_id,_updatedAt,fullName,title,email,phone,location,github,linkedin,summary,availabilityLabel,heroRoles,resumeUrl,highlights,education}',
  );
  return docs[0] ?? null;
}

export async function fetchAboutSection(): Promise<AboutSectionDoc | null> {
  const docs = await fetchSanity<AboutSectionDoc>(
    '*[_type == "aboutSection"][0]{_id,_updatedAt,aboutContent,aboutParagraphs}',
  );
  return docs[0] ?? null;
}

export async function fetchTechStack(): Promise<TechStackDoc | null> {
  const docs = await fetchSanity<TechStackDoc>(
    '*[_type == "techStack"][0]{_id,_updatedAt,technologies[]{name,category,proficiency}}',
  );
  return docs[0] ?? null;
}

export async function fetchExperiences(): Promise<ExperienceDoc[]> {
  return fetchSanity<ExperienceDoc>(
    '*[_type == "experience"] | order(order asc, startDate desc){_id,_updatedAt,role,company,location,startDate,endDate,employmentType,workModel,summary,featuredStory,highlights,tags,achievements}',
  );
}

export async function fetchProjects(): Promise<ProjectDoc[]> {
  return fetchSanity<ProjectDoc>(
    '*[_type == "project"] | order(order asc, featuredRank asc, title asc){_id,_updatedAt,title,"slug":slug.current,summary,challenge,solution,result,year,category,featured,role,technologies,achievements,featuredRank,status,liveUrl,repositoryUrl,tier,showcaseDetail,shortDescription,highlights,githubRepo}',
  );
}

export async function fetchCertifications(): Promise<CertificationDoc[]> {
  return fetchSanity<CertificationDoc>(
    '*[_type == "certification"] | order(order asc, issuedAt desc){_id,_updatedAt,title,issuedAt,tags,"issuer":issuer->title}',
  );
}

export async function fetchPosts(): Promise<PostDoc[]> {
  return fetchSanity<PostDoc>(
    '*[_type == "post" && published == true && defined(slug.current)] | order(publishedAt desc){_id,_updatedAt,title,"slug":slug.current,excerpt,readTime,body,tags,publishedAt,featured,metaTitle,metaDescription,"author":author->name,"categories":categories[]->title}',
  );
}

export async function fetchMemberships(): Promise<MembershipDoc[]> {
  return fetchSanity<MembershipDoc>(
    '*[_type == "membership"] | order(joinedAt desc){_id,_updatedAt,name,url,joinedAt}',
  );
}

export async function fetchRecommendations(): Promise<RecommendationDoc[]> {
  return fetchSanity<RecommendationDoc>(
    '*[_type == "recommendation"] | order(_createdAt asc){_id,_updatedAt,quote,name,title,company,featured,relationship,companyUrl}',
  );
}
