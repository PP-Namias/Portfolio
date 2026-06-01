/**
 * Studio theme tokens. Pairs with the portfolio's accent palette.
 *
 * Uses `buildLegacyTheme` from sanity - it takes CSS custom properties and
 * returns a fully-formed `StudioTheme` with both `color.light` and
 * `color.dark` variants, so the studio shell never crashes on missing keys.
 *
 * The shell is mostly light by default. The dark color tokens are inferred
 * from the same custom properties by the Sanity UI primitives.
 */
import {buildLegacyTheme} from 'sanity'

export const studioTheme = buildLegacyTheme({
  '--black': '#0e0e10',
  '--white': '#ffffff',
  '--gray-base': '#5e5e5e',
  '--gray': '#8a8a8a',
  '--brand-primary': '#ff63a5',
  '--component-bg': '#ffffff',
  '--component-text-color': '#1f1f1f',
  '--default-button-color': '#5e5e5e',
  '--default-button-primary-color': '#ff63a5',
  '--default-button-success-color': '#22c55e',
  '--default-button-warning-color': '#f59e0b',
  '--default-button-danger-color': '#ef4444',
  '--focus-color': '#ff63a5',
  '--main-navigation-color': '#0e0e10',
  '--main-navigation-color--inverted': '#ffffff',
  '--state-info-color': '#6366f1',
  '--state-success-color': '#22c55e',
  '--state-warning-color': '#f59e0b',
  '--state-danger-color': '#ef4444',
  '--font-family-base': "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
  '--font-family-monospace':
    "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
})
