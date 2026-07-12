import { cache } from 'react';
import { querySanity, CONTENT_TAGS } from '@/lib/cms-content.server';
import { buildMediaGatewayUrl } from '@/lib/media-gateway';
import type { Certification } from '@/types';

const maybeCache = <T extends (...args: unknown[]) => Promise<CertificationsData>>(fn: T) => {
  return typeof cache === 'function' ? cache(fn) : fn;
};

export type CertificationsData = {
  certifications: Certification[];
};

async function fetchCertificationsDataImpl(): Promise<CertificationsData> {
  const certificationDocs = await querySanity<Array<{
    title?: string;
    issuedAt?: string;
    tags?: string[];
    issuer?: string;
    imageFile?: string;
    imageUrl?: string;
    alt?: string;
    caption?: string;
    credit?: string;
    source?: string;
    license?: string;
  }>>(
    '*[_type == "certification"] | order(order asc, issuedAt desc){title,issuedAt,tags,"issuer":issuer->title,"imageFile":image.asset->originalFilename,"imageUrl":image.asset->url,"alt":image.alt,"caption":image.caption,"credit":image.credit,"source":image.source,"license":image.license}',
    { tags: CONTENT_TAGS.certification }
  );

  const certifications: Certification[] = (certificationDocs ?? []).map((certification) => ({
    title: certification.title || '',
    image: buildMediaGatewayUrl(certification.imageUrl || '', {
      width: 320,
      quality: 85,
      sign: true,
    }) || '',
    imageUrl: certification.imageUrl || '',
    alt: certification.alt || certification.title || '',
    caption: certification.caption || '',
    credit: certification.credit || '',
    source: certification.source || '',
    license: certification.license || '',
    issuer: certification.issuer || '',
    issuedAt: certification.issuedAt || '',
    tags: certification.tags || [],
  }));

  return { certifications };
}

export const fetchCertificationsData = maybeCache(fetchCertificationsDataImpl);
