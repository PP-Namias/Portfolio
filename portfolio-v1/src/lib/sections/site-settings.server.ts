import { cache } from 'react';
import { querySanity, CONTENT_TAGS } from '@/lib/cms-content.server';

const maybeCache = <T extends (...args: unknown[]) => Promise<SiteSettingsData>>(fn: T) => {
  return typeof cache === 'function' ? cache(fn) : fn;
};

export type SiteSettingsData = {
  footer: {
    leadText: string;
    linkLabel: string;
    copyright: string;
    backToPortfolioLabel: string;
    contactPrompt: string;
  };
  blog: {
    title: string;
    description: string;
    backLabel: string;
  };
  siteName: string;
  siteTagline: string;
  ownerName: string;
  ownerShortName: string;
  contactEmail: string;
};

async function fetchSiteSettingsDataImpl(): Promise<SiteSettingsData> {
  const siteSettingsDoc = await querySanity<{
    footer?: {
      leadText?: string;
      linkLabel?: string;
      copyright?: string;
      backToPortfolioLabel?: string;
      contactPrompt?: string;
    };
    blog?: {
      title?: string;
      description?: string;
      backLabel?: string;
    };
    siteName?: string;
    siteTagline?: string;
    ownerName?: string;
    ownerShortName?: string;
    contactEmail?: string;
  }>(
    '*[_type == "siteSettings"][0]{footer{leadText,linkLabel,copyright,backToPortfolioLabel,contactPrompt},blog{title,description,backLabel},siteName,siteTagline,ownerName,ownerShortName,contactEmail}',
    { tags: CONTENT_TAGS.siteSettings }
  );

  return {
    footer: {
      leadText: siteSettingsDoc?.footer?.leadText || '',
      linkLabel: siteSettingsDoc?.footer?.linkLabel || '',
      copyright: siteSettingsDoc?.footer?.copyright || '',
      backToPortfolioLabel: siteSettingsDoc?.footer?.backToPortfolioLabel || 'Back to Portfolio',
      contactPrompt: siteSettingsDoc?.footer?.contactPrompt || 'Send a message',
    },
    blog: {
      title: siteSettingsDoc?.blog?.title || 'Blog',
      description: siteSettingsDoc?.blog?.description || 'Thoughts on AI, software engineering, cloud development, and more.',
      backLabel: siteSettingsDoc?.blog?.backLabel || 'Back to Portfolio',
    },
    siteName: siteSettingsDoc?.siteName || '',
    siteTagline: siteSettingsDoc?.siteTagline || '',
    ownerName: siteSettingsDoc?.ownerName || '',
    ownerShortName: siteSettingsDoc?.ownerShortName || '',
    contactEmail: siteSettingsDoc?.contactEmail || '',
  };
}

export const fetchSiteSettingsData = maybeCache(fetchSiteSettingsDataImpl);
