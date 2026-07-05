import { sanityFetch } from "./fetch";
import { QUERIES } from "./queries";

export interface CertificationData {
  title: string;
  issuer: string;
  issuedAt: string;
  expiresAt: string | null;
  credentialUrl: string;
  category: { title: string; slug: { current: string } } | null;
  image: { asset: { url: string } } | null;
  order: number;
}

export async function getCertifications() {
  return sanityFetch<CertificationData[]>(QUERIES.certifications, undefined, {
    tags: ["cms:certifications"],
  });
}
