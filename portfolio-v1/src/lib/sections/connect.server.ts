import { cache } from 'react';
import { querySanity, CONTENT_TAGS } from '@/lib/cms-content.server';
import type { SocialLink } from '@/types';

const maybeCache = <T extends (...args: unknown[]) => Promise<ConnectData>>(fn: T) => {
  return typeof cache === 'function' ? cache(fn) : fn;
};

function normalizeSocialName(value: string): string {
  return value.toLowerCase();
}

function titleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function mapSocialLink(link: {
  platform?: string;
  icon?: string;
  url?: string;
  placements?: string[];
}): SocialLink | null {
  const platform = String(link.platform || '').toLowerCase();
  const icon = String(link.icon || '').toLowerCase();
  const source = platform === 'message' && icon ? icon : platform || icon;
  const normalizedName = normalizeSocialName(source);
  const url = String(link.url || '').trim();

  if (!normalizedName || !url) {
    return null;
  }

  return {
    name: normalizedName,
    icon: normalizeSocialName(icon || platform || 'message'),
    label: titleCase(source),
    link: url,
    featured: Array.isArray(link.placements) ? link.placements.includes('hero') : false,
  };
}

export type ConnectData = {
  socialLinks: SocialLink[];
};

async function fetchConnectDataImpl(): Promise<ConnectData> {
  const profileDoc = await querySanity<{
    socialLinks?: Array<{ platform?: string; icon?: string; url?: string; placements?: string[] }>;
  }>(
    '*[_type == "profile"][0]{socialLinks[]{platform,icon,url,placements}}',
    { tags: CONTENT_TAGS.profile }
  );

  const socialLinks = (() => {
    const mapped = (profileDoc?.socialLinks ?? []).map(mapSocialLink).filter(Boolean) as SocialLink[];
    const seen = new Set<string>();
    return mapped.filter((link) => {
      if (seen.has(link.name)) return false;
      seen.add(link.name);
      return true;
    });
  })();

  return { socialLinks };
}

export const fetchConnectData = maybeCache(fetchConnectDataImpl);
