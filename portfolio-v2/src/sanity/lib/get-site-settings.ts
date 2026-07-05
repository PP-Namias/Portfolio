import { sanityFetch } from "./fetch";
import { QUERIES } from "./queries";

export interface SiteSettingsData {
  siteTitle: string;
  siteDescription: string;
  ogImage: { asset: { url: string } } | null;
  favicon: { asset: { url: string } } | null;
  accentColor: string;
  footerText: string;
  ga4Id: string;
  posthogToken: string;
  openpanelClientId: string;
}

export async function getSiteSettings() {
  return sanityFetch<SiteSettingsData>(QUERIES.siteSettings, undefined, {
    tags: ["cms:siteSettings"],
  });
}
