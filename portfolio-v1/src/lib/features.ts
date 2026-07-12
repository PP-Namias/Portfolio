// Temporary feature toggles for sections that should remain in code but hidden in production UI.
export const IS_BLOG_VISIBLE = true;
export const IS_MAGIC_CURSOR_VISIBLE = true;
export const IS_PROJECTS_REVAMP_ENABLED = true;

// Streaming SSR: per-section data fetching with React Suspense for progressive rendering.
// When true, the homepage streams HTML as each section's data resolves independently.
// When false, the homepage uses the monolithic getCmsContent() pattern.
export const IS_STREAMING_SSR_ENABLED = true;