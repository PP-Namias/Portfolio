/**
 * Studio theme. Modern Sanity 4 `buildTheme` with a custom hue palette
 * so the studio shell honors the user's color-mode selection.
 *
 * Why we don't use `buildLegacyTheme`:
 * The legacy helper derives a dark scheme from a single set of CSS vars,
 * which on Windows 10/11 with a light OS theme left the studio stuck in
 * light mode regardless of any in-app toggle. `buildTheme` lets us hand
 * each scheme its own token tree so the shell's `data-ui-color-mode`
 * attribute always maps to a real, distinct palette.
 *
 * Brand palette (mirrors the marketing site):
 *   primary  = magenta (pink)   #ff63a5
 *   accent   = cyan             #06b6d4
 *   highlight= violet           #a78bfa
 *   success  = green            #22c55e
 *   warning  = amber            #f59e0b
 *   danger   = red              #ef4444
 */
import {buildTheme, type ThemeConfig} from '@sanity/ui/theme'

const themeConfig: ThemeConfig = {
  palette: {
    black: {hex: '#0b0d12', title: 'Black'},
    white: {hex: '#fafafa', title: 'White'},
    gray: {
      50: {hex: '#f8fafc', title: 'Gray 50'},
      100: {hex: '#f1f5f9', title: 'Gray 100'},
      200: {hex: '#e2e8f0', title: 'Gray 200'},
      300: {hex: '#cbd5e1', title: 'Gray 300'},
      400: {hex: '#94a3b8', title: 'Gray 400'},
      500: {hex: '#64748b', title: 'Gray 500'},
      600: {hex: '#475569', title: 'Gray 600'},
      700: {hex: '#334155', title: 'Gray 700'},
      800: {hex: '#1e293b', title: 'Gray 800'},
      900: {hex: '#0f172a', title: 'Gray 900'},
      950: {hex: '#020617', title: 'Gray 950'},
    },
    red: {
      50: {hex: '#fef2f2', title: 'Red 50'},
      100: {hex: '#fee2e2', title: 'Red 100'},
      200: {hex: '#fecaca', title: 'Red 200'},
      300: {hex: '#fca5a5', title: 'Red 300'},
      400: {hex: '#f87171', title: 'Red 400'},
      500: {hex: '#ef4444', title: 'Red 500'},
      600: {hex: '#dc2626', title: 'Red 600'},
      700: {hex: '#b91c1c', title: 'Red 700'},
      800: {hex: '#991b1b', title: 'Red 800'},
      900: {hex: '#7f1d1d', title: 'Red 900'},
      950: {hex: '#450a0a', title: 'Red 950'},
    },
    orange: {
      50: {hex: '#fff7ed', title: 'Orange 50'},
      100: {hex: '#ffedd5', title: 'Orange 100'},
      200: {hex: '#fed7aa', title: 'Orange 200'},
      300: {hex: '#fdba74', title: 'Orange 300'},
      400: {hex: '#fb923c', title: 'Orange 400'},
      500: {hex: '#f97316', title: 'Orange 500'},
      600: {hex: '#ea580c', title: 'Orange 600'},
      700: {hex: '#c2410c', title: 'Orange 700'},
      800: {hex: '#9a3412', title: 'Orange 800'},
      900: {hex: '#7c2d12', title: 'Orange 900'},
      950: {hex: '#431407', title: 'Orange 950'},
    },
    yellow: {
      50: {hex: '#fefce8', title: 'Yellow 50'},
      100: {hex: '#fef9c3', title: 'Yellow 100'},
      200: {hex: '#fef08a', title: 'Yellow 200'},
      300: {hex: '#fde047', title: 'Yellow 300'},
      400: {hex: '#facc15', title: 'Yellow 400'},
      500: {hex: '#eab308', title: 'Yellow 500'},
      600: {hex: '#ca8a04', title: 'Yellow 600'},
      700: {hex: '#a16207', title: 'Yellow 700'},
      800: {hex: '#854d0e', title: 'Yellow 800'},
      900: {hex: '#713f12', title: 'Yellow 900'},
      950: {hex: '#422006', title: 'Yellow 950'},
    },
    green: {
      50: {hex: '#f0fdf4', title: 'Green 50'},
      100: {hex: '#dcfce7', title: 'Green 100'},
      200: {hex: '#bbf7d0', title: 'Green 200'},
      300: {hex: '#86efac', title: 'Green 300'},
      400: {hex: '#4ade80', title: 'Green 400'},
      500: {hex: '#22c55e', title: 'Green 500'},
      600: {hex: '#16a34a', title: 'Green 600'},
      700: {hex: '#15803d', title: 'Green 700'},
      800: {hex: '#166534', title: 'Green 800'},
      900: {hex: '#14532d', title: 'Green 900'},
      950: {hex: '#052e16', title: 'Green 950'},
    },
    cyan: {
      50: {hex: '#ecfeff', title: 'Cyan 50'},
      100: {hex: '#cffafe', title: 'Cyan 100'},
      200: {hex: '#a5f3fc', title: 'Cyan 200'},
      300: {hex: '#67e8f9', title: 'Cyan 300'},
      400: {hex: '#22d3ee', title: 'Cyan 400'},
      500: {hex: '#06b6d4', title: 'Cyan 500'},
      600: {hex: '#0891b2', title: 'Cyan 600'},
      700: {hex: '#0e7490', title: 'Cyan 700'},
      800: {hex: '#155e75', title: 'Cyan 800'},
      900: {hex: '#164e63', title: 'Cyan 900'},
      950: {hex: '#083344', title: 'Cyan 950'},
    },
    blue: {
      50: {hex: '#eff6ff', title: 'Blue 50'},
      100: {hex: '#dbeafe', title: 'Blue 100'},
      200: {hex: '#bfdbfe', title: 'Blue 200'},
      300: {hex: '#93c5fd', title: 'Blue 300'},
      400: {hex: '#60a5fa', title: 'Blue 400'},
      500: {hex: '#3b82f6', title: 'Blue 500'},
      600: {hex: '#2563eb', title: 'Blue 600'},
      700: {hex: '#1d4ed8', title: 'Blue 700'},
      800: {hex: '#1e40af', title: 'Blue 800'},
      900: {hex: '#1e3a8a', title: 'Blue 900'},
      950: {hex: '#172554', title: 'Blue 950'},
    },
    purple: {
      50: {hex: '#faf5ff', title: 'Purple 50'},
      100: {hex: '#f3e8ff', title: 'Purple 100'},
      200: {hex: '#e9d5ff', title: 'Purple 200'},
      300: {hex: '#d8b4fe', title: 'Purple 300'},
      400: {hex: '#c4b5fd', title: 'Purple 400'},
      500: {hex: '#a78bfa', title: 'Purple 500'},
      600: {hex: '#8b5cf6', title: 'Purple 600'},
      700: {hex: '#7c3aed', title: 'Purple 700'},
      800: {hex: '#6d28d9', title: 'Purple 800'},
      900: {hex: '#5b21b6', title: 'Purple 900'},
      950: {hex: '#2e1065', title: 'Purple 950'},
    },
    magenta: {
      50: {hex: '#fdf2f8', title: 'Magenta 50'},
      100: {hex: '#fce7f3', title: 'Magenta 100'},
      200: {hex: '#fbcfe8', title: 'Magenta 200'},
      300: {hex: '#f9a8d4', title: 'Magenta 300'},
      400: {hex: '#ff7eb6', title: 'Magenta 400'},
      500: {hex: '#ff63a5', title: 'Magenta 500'},
      600: {hex: '#ec4f93', title: 'Magenta 600'},
      700: {hex: '#be185d', title: 'Magenta 700'},
      800: {hex: '#9d174d', title: 'Magenta 800'},
      900: {hex: '#831843', title: 'Magenta 900'},
      950: {hex: '#500724', title: 'Magenta 950'},
    },
  },
  /**
   * Base tokens. Arrays are [lightValue, darkValue] using palette refs.
   * Anything not listed inherits the default Sanity token tree (which
   * already covers the rest of the studio's UI primitives).
   */
  color: {
    base: {
      '*': {
        accent: {
          fg: ['magenta/500', 'magenta/400'],
        },
        focusRing: ['magenta/500', 'magenta/400'],
      },
      transparent: {
        bg: ['gray/200/0.5', 'black/0.5'],
      },
      default: {
        bg: ['white', 'gray/950'],
        fg: ['gray/800', 'gray/100'],
        muted: {
          fg: ['gray/600', 'gray/400'],
        },
      },
      primary: {_hue: 'magenta'},
      positive: {_hue: 'green'},
      caution: {_hue: 'yellow'},
      critical: {_hue: 'red'},
    },
  },
}

export const studioTheme = buildTheme(themeConfig)

/** Brand accent hex values used by the grid CSS and other raw-CSS paths. */
export const brandAccent = {
  primary: '#ff63a5',
  primaryDark: '#ff7eb6',
  cyan: '#06b6d4',
  cyanDark: '#22d3ee',
  violet: '#a78bfa',
  violetDark: '#c4b5fd',
} as const
