import Script from 'next/script';

const DEFAULT_UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js';

export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!websiteId) {
    return null;
  }

  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || DEFAULT_UMAMI_SCRIPT_URL;
  const domains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;

  return (
    <Script
      src={scriptUrl}
      strategy="afterInteractive"
      defer
      data-website-id={websiteId}
      data-domains={domains}
    />
  );
}