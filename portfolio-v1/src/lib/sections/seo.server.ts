import { cache } from 'react';
import { querySanity, CONTENT_TAGS } from '@/lib/cms-content.server';
import { fallbackCmsContent } from '@/lib/cms-content.shared';

const maybeCache = <T extends (...args: unknown[]) => Promise<SeoData>>(fn: T) => {
  return typeof cache === 'function' ? cache(fn) : fn;
};

export type SeoData = {
  siteTitle: string;
  siteDescription: string;
  canonicalUrl: string;
  ogImageUrl: string;
  twitterImageUrl: string;
  noindex: boolean;
  nofollow: boolean;
};

async function fetchSeoDataImpl(): Promise<SeoData> {
  const fallback = fallbackCmsContent.seoSettings;

  try {
    const siteSettingsDoc = await querySanity<{
      defaultMetaTitle?: string;
      defaultMetaDescription?: string;
      canonicalUrl?: string;
      ogImageUrl?: string;
      ogTitle?: string;
      ogDescription?: string;
      twitterImageUrl?: string;
      robotsNoindex?: boolean;
      robotsNofollow?: boolean;
    }>(
      '*[_type == "siteSettings"][0]{defaultMetaTitle,defaultMetaDescription,canonicalUrl,"ogImageUrl":ogImage.asset->url,ogTitle,ogDescription,"twitterImageUrl":twitterImage.asset->url,robotsNoindex,robotsNofollow}',
      { tags: CONTENT_TAGS.siteSettings }
    );

    if (!siteSettingsDoc) {
      return fallback;
    }

    return {
      siteTitle:
        siteSettingsDoc.ogTitle || siteSettingsDoc.defaultMetaTitle || fallback.siteTitle,
      siteDescription:
        siteSettingsDoc.ogDescription || siteSettingsDoc.defaultMetaDescription || fallback.siteDescription,
      canonicalUrl: siteSettingsDoc.canonicalUrl || fallback.canonicalUrl,
      ogImageUrl: siteSettingsDoc.ogImageUrl || fallback.ogImageUrl,
      twitterImageUrl: siteSettingsDoc.twitterImageUrl || siteSettingsDoc.ogImageUrl || fallback.twitterImageUrl,
      noindex: siteSettingsDoc.robotsNoindex ?? fallback.noindex,
      nofollow: siteSettingsDoc.robotsNofollow ?? fallback.nofollow,
    };
  } catch {
    return fallback;
  }
}

export const fetchSeoData = maybeCache(fetchSeoDataImpl);
