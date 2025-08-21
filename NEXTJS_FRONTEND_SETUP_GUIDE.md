# 🚀 Next.js Frontend Redesign Setup Guide

## 🎯 Project Overview

This document provides comprehensive instructions for setting up a Next.js TypeScript project for the modern minimalist portfolio redesign inspired by Bryl Lim's aesthetic. The new frontend will be a complete reimplementation focusing on resume-style presentation with professional dark/light theme switching.

---

## 📋 Prerequisites & Environment Setup

### System Requirements

- **Node.js**: Version 18.17 or later
- **npm**: Version 9.0 or later (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended IDE with extensions
- **Modern Browser**: Chrome, Firefox, or Edge for testing

### Required VS Code Extensions

```bash
# Essential Extensions for Next.js Development
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Prettier - Code formatter
- GitLens
- Error Lens
- Bracket Pair Colorizer
- Auto Close Tag
- Path Intellisense
```

---

## 🛠️ Step 1: Next.js Project Initialization

### Create Next.js Project with TypeScript

```bash
# Navigate to the frontend directory
cd "c:\Users\Admin\Desktop\PP Namias\Portfolio\frontend"

# Create Next.js project with TypeScript
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Project creation options:
# ✅ TypeScript: Yes
# ✅ ESLint: Yes  
# ✅ Tailwind CSS: Yes
# ✅ src/ directory: Yes
# ✅ App Router: Yes
# ✅ Import alias (@/*): Yes
```

### Alternative Manual Setup (if needed)

```bash
# If automatic setup fails, manual approach:
npm init -y
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/react @types/node @types/react-dom
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint eslint-config-next
```

---

## 📦 Step 2: Essential Dependencies Installation

### Core Dependencies for Portfolio Features

```bash
# UI and Animation Libraries
npm install framer-motion
npm install lucide-react
npm install @headlessui/react
npm install clsx
npm install tailwind-merge

# Form Handling and Validation
npm install react-hook-form
npm install @hookform/resolvers
npm install zod

# Content Management (Sanity CMS Integration)
npm install @sanity/client
npm install @sanity/image-url
npm install @portabletext/react

# Utility Libraries
npm install date-fns
npm install react-intersection-observer
npm install use-debounce

# SEO and Meta Management
npm install next-seo
npm install @vercel/analytics
```

### Development Dependencies

```bash
# TypeScript and Code Quality
npm install -D @types/react @types/react-dom
npm install -D prettier prettier-plugin-tailwindcss
npm install -D @typescript-eslint/parser
npm install -D @typescript-eslint/eslint-plugin

# Build and Performance Tools
npm install -D @next/bundle-analyzer
npm install -D cross-env
```

---

## ⚙️ Step 3: Configuration Files Setup

### TypeScript Configuration

**File**: `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/data/*": ["./src/data/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind CSS Configuration

**File**: `frontend/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Light Theme Colors (Bryl Lim inspired)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        // Dark Theme Colors
        dark: {
          bg: '#0a0a0a',
          'bg-secondary': '#1a1a1a',
          surface: '#2a2a2a',
          'surface-hover': '#3a3a3a',
          text: '#ffffff',
          'text-secondary': '#b3b3b3',
          'text-muted': '#6b7280',
          border: '#374151',
          accent: '#4ade80',
          'accent-hover': '#22c55e',
        },
        // Light Theme Colors
        light: {
          bg: '#ffffff',
          'bg-secondary': '#f8fafc',
          surface: '#ffffff',
          'surface-hover': '#f1f5f9',
          text: '#1e293b',
          'text-secondary': '#64748b',
          'text-muted': '#94a3b8',
          border: '#e2e8f0',
          accent: '#3b82f6',
          'accent-hover': '#2563eb',
        },
        // Semantic Colors
        success: {
          light: '#10b981',
          dark: '#22c55e',
        },
        warning: {
          light: '#f59e0b',
          dark: '#fbbf24',
        },
        error: {
          light: '#ef4444',
          dark: '#f87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '128': '32rem',
      },
      boxShadow: {
        'modern': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'modern-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'modern-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'modern-dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-green': '0 0 20px rgba(74, 222, 128, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'slide-left': 'slideLeft 0.6s ease-out',
        'slide-right': 'slideRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

export default config
```

### Next.js Configuration

**File**: `frontend/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'cdn.sanity.io',
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'github.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  env: {
    SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Bundle analyzer (conditional)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer')())({
          enabled: true,
        })
      );
      return config;
    },
  }),
};

module.exports = nextConfig;
```

### ESLint Configuration

**File**: `frontend/.eslintrc.json`

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  },
  "ignorePatterns": ["node_modules/", ".next/", "out/"]
}
```

### Prettier Configuration

**File**: `frontend/.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## 📁 Step 4: Project Structure Setup

### Create Directory Structure

```bash
# Create the complete directory structure
mkdir -p src/app
mkdir -p src/components/layout
mkdir -p src/components/sections
mkdir -p src/components/ui
mkdir -p src/components/common
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/utils
mkdir -p src/types
mkdir -p src/data
mkdir -p src/styles
mkdir -p public/images
mkdir -p public/icons
```

### Project Structure Overview

```
frontend/
├── public/
│   ├── images/
│   │   ├── profile.jpg
│   │   ├── projects/
│   │   └── gallery/
│   ├── icons/
│   │   ├── favicon.ico
│   │   └── apple-touch-icon.png
│   ├── resume.pdf
│   └── sitemap.xml
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── blog/
│   │       ├── page.tsx
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── BlogSection.tsx
│   │   │   └── ContactSection.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── common/
│   │       ├── SEO.tsx
│   │       ├── StructuredData.tsx
│   │       └── ScrollProgress.tsx
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useScrollAnimation.ts
│   │   ├── useIntersectionObserver.ts
│   │   └── useLocalStorage.ts
│   ├── lib/
│   │   ├── sanity.ts
│   │   ├── constants.ts
│   │   └── validations.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── animations.ts
│   │   └── formatters.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── sanity.ts
│   │   └── blog.ts
│   ├── data/
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   └── social.ts
│   └── styles/
│       └── components.css
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── .eslintrc.json
├── .prettierrc
└── README.md
```

---

## 🎨 Step 5: Base Configuration and Utilities

### Global Styles Setup

**File**: `frontend/src/app/globals.css`

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Custom CSS Properties for Theme System */
:root {
  /* Light Theme Variables */
  --color-bg: theme('colors.light.bg');
  --color-bg-secondary: theme('colors.light.bg-secondary');
  --color-surface: theme('colors.light.surface');
  --color-surface-hover: theme('colors.light.surface-hover');
  --color-text: theme('colors.light.text');
  --color-text-secondary: theme('colors.light.text-secondary');
  --color-text-muted: theme('colors.light.text-muted');
  --color-border: theme('colors.light.border');
  --color-accent: theme('colors.light.accent');
  --color-accent-hover: theme('colors.light.accent-hover');
  --shadow-modern: theme('boxShadow.modern');
  --shadow-modern-lg: theme('boxShadow.modern-lg');
}

[data-theme='dark'] {
  /* Dark Theme Variables */
  --color-bg: theme('colors.dark.bg');
  --color-bg-secondary: theme('colors.dark.bg-secondary');
  --color-surface: theme('colors.dark.surface');
  --color-surface-hover: theme('colors.dark.surface-hover');
  --color-text: theme('colors.dark.text');
  --color-text-secondary: theme('colors.dark.text-secondary');
  --color-text-muted: theme('colors.dark.text-muted');
  --color-border: theme('colors.dark.border');
  --color-accent: theme('colors.dark.accent');
  --color-accent-hover: theme('colors.dark.accent-hover');
  --shadow-modern: theme('boxShadow.modern-dark');
  --shadow-modern-lg: theme('boxShadow.modern-dark-lg');
}

/* Base Styles */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent);
}

/* Selection */
::selection {
  background-color: var(--color-accent);
  color: white;
}

/* Focus Styles */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Animation Classes */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.animate-slide-up {
  opacity: 1;
  transform: translateY(0);
}

/* Loading States */
.loading-skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface) 0%,
    var(--color-surface-hover) 50%,
    var(--color-surface) 100%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Typography Enhancements */
.prose-custom {
  @apply leading-relaxed;
}

.prose-custom h1,
.prose-custom h2,
.prose-custom h3 {
  @apply font-semibold tracking-tight;
}

.prose-custom p {
  @apply mb-4;
}

.prose-custom a {
  @apply text-accent hover:text-accent-hover transition-colors;
}

/* Component Base Classes */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: var(--shadow-modern);
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-modern-lg);
}

.glass-morphism {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

[data-theme='dark'] .glass-morphism {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Utility Classes */
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.section-padding {
  @apply py-16 md:py-24;
}

.text-gradient {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Utility Functions

**File**: `frontend/src/utils/cn.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Theme Hook

**File**: `frontend/src/hooks/useTheme.ts`

```typescript
'use client';

import { useState, useEffect, createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
  }, []);

  const updateTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: Theme) => {
    updateTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  const value = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## 📄 Step 6: Package.json Scripts

**File**: `frontend/package.json` (scripts section)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "analyze": "cross-env ANALYZE=true npm run build",
    "clean": "rm -rf .next out node_modules/.cache",
    "prepare": "cd .. && husky install frontend/.husky"
  }
}
```

---

## 🚀 Step 7: Development Workflow

### Initial Setup Commands

```bash
# Navigate to frontend directory
cd "c:\Users\Admin\Desktop\PP Namias\Portfolio\frontend"

# Install all dependencies
npm install

# Run type checking
npm run type-check

# Format code
npm run format

# Run linting
npm run lint

# Start development server
npm run dev
```

### Development Server

After running `npm run dev`, your development server will be available at:
- **Local**: http://localhost:3000
- **Network**: http://[your-ip]:3000

### Build and Production

```bash
# Create production build
npm run build

# Start production server
npm run start

# Analyze bundle size
npm run analyze
```

---

## 🎯 Step 8: Initial Component Setup

### Root Layout

**File**: `frontend/src/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/hooks/useTheme';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PP Namias - Principal AI Engineer & Full Stack Developer',
  description: 'Portfolio of PP Namias, a Principal AI Engineer specializing in AI automation, full-stack development, and team leadership.',
  keywords: ['AI Engineer', 'Full Stack Developer', 'React', 'TypeScript', 'AI Automation'],
  authors: [{ name: 'PP Namias' }],
  creator: 'PP Namias',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ppnamias.vercel.app',
    title: 'PP Namias - Principal AI Engineer',
    description: 'Portfolio showcasing AI automation expertise and full-stack development projects.',
    siteName: 'PP Namias Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PP Namias - Principal AI Engineer',
    description: 'Portfolio showcasing AI automation expertise and full-stack development projects.',
    creator: '@ppnamias',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Home Page

**File**: `frontend/src/app/page.tsx`

```typescript
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { BlogSection } from '@/components/sections/BlogSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <Header />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
```

---

## 📊 Step 9: Performance and SEO Setup

### Environment Variables

**File**: `frontend/.env.local`

```bash
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=gerattrr
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Contact Form (optional)
CONTACT_EMAIL=your-email@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://ppnamias.vercel.app
NEXT_PUBLIC_SITE_NAME=PP Namias Portfolio
```

### Bundle Analysis Setup

```bash
# To analyze your bundle size
npm run analyze

# This will generate a visual report showing:
# - Bundle composition
# - Largest dependencies
# - Optimization opportunities
```

---

## 🧪 Step 10: Testing and Quality Assurance

### Pre-commit Setup (Optional but Recommended)

```bash
# Install Husky for git hooks
npm install -D husky lint-staged

# Setup pre-commit hooks
npx husky install
npx husky add .husky/pre-commit "npm run lint-staged"
```

**File**: `frontend/.lintstagedrc.json`

```json
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{css,md,json}": [
    "prettier --write"
  ]
}
```

### Development Checklist

Before proceeding with component development:

- ✅ **Dependencies installed** correctly
- ✅ **Development server** runs without errors
- ✅ **TypeScript compilation** passes
- ✅ **ESLint** passes without errors
- ✅ **Prettier** formatting applied
- ✅ **Theme system** works correctly
- ✅ **Environment variables** configured

---

## 🎨 Next Steps: Component Development

With the foundation in place, you're ready to start building the components:

1. **Header Component** - Fixed navigation with theme toggle
2. **Hero Section** - Profile, title, and CTA buttons
3. **About Section** - Professional summary and metrics
4. **Experience Timeline** - Work history with cards
5. **Skills Grid** - Technical skills categorization
6. **Projects Showcase** - Portfolio projects display
7. **Blog Integration** - Recent posts from Sanity
8. **Contact Section** - Contact form and information

Each component will follow the Bryl Lim aesthetic with:
- Clean, minimalist design
- Smooth animations
- Responsive layout
- Dark/light theme support
- Professional typography

This setup provides a solid foundation for building a modern, performant portfolio website that showcases your expertise while maintaining professional standards and optimal user experience.
