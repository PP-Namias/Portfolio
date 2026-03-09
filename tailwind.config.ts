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
          light: '#ffffff',
          dark: '#000000',
        },
        surface: {
          light: '#ffffff',
          dark: '#0a0a0a',
        },
        'card-bg': {
          light: '#ffffff',
          dark: '#111111',
        },
        'text-primary': {
          light: '#111827',
          dark: '#f5f5f5',
        },
        'text-secondary': {
          light: '#4b5563',
          dark: '#d4d4d4',
        },
        'text-muted': {
          light: '#6b7280',
          dark: '#a3a3a3',
        },
        border: {
          light: '#e5e7eb',
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
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
