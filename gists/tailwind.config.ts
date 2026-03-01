import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
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
          dark: '#ffffff',
        },
        'text-secondary': {
          light: '#4b5563',
          dark: '#d1d5db',
        },
        'text-muted': {
          light: '#6b7280',
          dark: '#9ca3af',
        },
        border: {
          light: '#e5e7eb',
          dark: '#1f1f1f',
        },
        accent: {
          pink: '#db2777',
          'pink-hover': '#be185d',
          'pink-hover-dark': '#f472b6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '860px',
      },
    },
  },
  plugins: [],
};

export default config;
