// Temporary feature toggles for sections that should remain in code but hidden in production UI.
export const IS_BLOG_VISIBLE = true;
export const IS_MAGIC_CURSOR_VISIBLE = true;
export const IS_PROJECTS_REVAMP_ENABLED = true;

// Streaming SSR: per-section data fetching with React Suspense for progressive rendering.
// When true, the homepage streams HTML as each section's data resolves independently.
// When false, the homepage uses the monolithic getCmsContent() pattern.
export const IS_STREAMING_SSR_ENABLED = true;

// PWA feature flags
export const IS_PWA_ENABLED = true;
export const IS_OFFLINE_BANNER_VISIBLE = true;

// Chat feature flags — gate new LangGraph, streaming, and threading features
// When disabled, the existing linear chat flow and UI are used (backward compatible).
export const IS_LANGGRAPH_ENABLED = true;
export const IS_CHAT_STREAMING_ENABLED = true;
export const IS_CHAT_THREADING_ENABLED = true;