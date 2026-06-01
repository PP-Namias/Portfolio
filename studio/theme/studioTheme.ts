/**
 * Studio theme tokens. Applied to the studio shell via the `theme` config
 * key in `sanity.config.ts`. Pairs with the portfolio's accent palette.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const studioTheme = {
  color: {
    dark: {
      '--card-bg': '#0e0e10',
      '--card-fg': '#f5f5f7',
      '--card-border': 'rgba(255,255,255,0.08)',
      '--accent': '#ff63a5',
      '--accent-fg': '#ffffff',
      '--positive': '#22c55e',
      '--caution': '#f59e0b',
      '--critical': '#ef4444',
    },
  },
  font: {
    family: 'Inter, ui-sans-serif, system-ui, sans-serif',
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  radius: [6, 10, 14],
} as any
