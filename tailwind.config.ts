import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f4f6fb',
          dark: '#000000',
        },
        surface: {
          light: '#f8fafc',
          dark: '#0a0a0a',
        },
        'card-bg': {
          light: '#ffffff',
          dark: '#111111',
        },
        'text-primary': {
          light: '#0f172a',
          dark: '#f5f5f5',
        },
        'text-secondary': {
          light: '#334155',
          dark: '#d4d4d4',
        },
        'text-muted': {
          light: '#64748b',
          dark: '#a3a3a3',
        },
        border: {
          light: '#d8dee9',
          dark: '#1f1f1f',
        },
        accent: {
          pink: 'rgb(var(--accent) / <alpha-value>)',
          'pink-hover': 'rgb(var(--accent-hover) / <alpha-value>)',
          'pink-hover-dark': 'rgb(var(--accent-hover-dark) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '860px',
      },
      spacing: {
        '13': '3.25rem',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
