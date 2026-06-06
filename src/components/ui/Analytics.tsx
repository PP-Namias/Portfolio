import Script from 'next/script';

const DEFAULT_UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js';
const DEFAULT_UMAMI_HOST_URL = 'https://api-gateway.umami.dev';

const isSecureUrl = (value: string) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!websiteId) {
    return null;
  }

  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || DEFAULT_UMAMI_SCRIPT_URL;
  const hostUrl = process.env.NEXT_PUBLIC_UMAMI_HOST_URL || DEFAULT_UMAMI_HOST_URL;
  const domains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;

  if (!isSecureUrl(scriptUrl) || !isSecureUrl(hostUrl)) {
    return null;
  }

  return (
    <Script
      src={scriptUrl}
      strategy="afterInteractive"
      data-website-id={websiteId}
      data-host-url={hostUrl}
      data-domains={domains}
      data-do-not-track="true"
    />
  );
}
