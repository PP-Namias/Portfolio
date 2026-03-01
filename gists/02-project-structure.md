# Project Structure Reference — Cloud-Native Portfolio

## Root Configuration Files

```
cloud-native-portfolio/
├── .devcontainer/
│   └── devcontainer.json        # Codespaces environment config
├── .env.local.example           # Environment variable template (S3 bucket URL)
├── .eslintrc.json               # ESLint config (extends next/core-web-vitals)
├── .gitignore                   # Node-specific ignores
├── amplify.yml                  # AWS Amplify build settings (used in Part 3)
├── next.config.js               # Next.js config (output, image domains)
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS plugins (Tailwind + Autoprefixer)
├── tailwind.config.ts           # Tailwind design system tokens
├── tsconfig.json                # TypeScript compiler options
└── public/
    └── site.webmanifest         # PWA manifest
```

## Source Directory (`src/`)

```
src/
├── app/                          # Next.js App Router pages
│   ├── globals.css               # Global styles, CSS variables, theme transitions
│   ├── layout.tsx                # Root layout (metadata, fonts, Providers wrapper)
│   ├── page.tsx                  # Home page (assembles all sections)
│   ├── providers.tsx             # ThemeProvider setup (next-themes)
│   └── blog/
│       ├── page.tsx              # Blog listing page
│       └── [slug]/
│           ├── page.tsx          # Dynamic blog post route (generateStaticParams)
│           └── BlogPostContent.tsx  # Blog post renderer (client component)
│
├── components/
│   ├── layout/                   # Page structure components
│   │   ├── Header.tsx            # Top-level header (theme toggle slot)
│   │   ├── Footer.tsx            # Copyright footer with animation
│   │   ├── MainContent.tsx       # Left column wrapper (hero → projects)
│   │   └── Sidebar.tsx           # Right column wrapper (experience → contact)
│   │
│   ├── sections/                 # Major content block components
│   │   ├── HeroSection.tsx       # Profile photo, name, roles, CTA buttons
│   │   ├── AboutSection.tsx      # Bio paragraphs
│   │   ├── TechStackSection.tsx  # Categorized technology list
│   │   ├── ProjectsSection.tsx   # Project cards grid
│   │   ├── CertificationsSection.tsx  # Certification list
│   │   ├── ExperienceTimeline.tsx     # Work/education timeline
│   │   ├── RecommendationsCarousel.tsx # Auto-advancing testimonial carousel
│   │   ├── MembershipsSection.tsx     # Professional memberships
│   │   ├── SpeakingSection.tsx        # Speaking availability CTA
│   │   ├── ConnectSection.tsx         # Social links + contact + latest blog post
│   │   ├── GallerySection.tsx         # Paginated image gallery with animation
│   │   ├── ContactSection.tsx         # Email, schedule, blog links
│   │   └── SocialLinksSection.tsx     # Social platform links
│   │
│   └── ui/                       # Reusable UI primitives
│       ├── Badge.tsx             # Styled badge (teal, sky, default variants)
│       ├── Button.tsx            # Button with variant/size/link support
│       ├── Card.tsx              # Bordered card container with optional hover
│       ├── ProjectCard.tsx       # Project-specific card with name/description/url
│       ├── SocialLink.tsx        # Social platform link with icon mapping
│       ├── TestimonialCard.tsx   # Animated testimonial display
│       ├── ThemeToggle.tsx       # Light/dark mode toggle button
│       ├── TimelineItem.tsx      # Timeline entry with indicator and connector
│       └── VerifiedBadge.tsx     # Verified checkmark icon
│
├── data/                         # Editable portfolio content (no layout logic)
│   ├── profile.ts                # Name, title, location, bio, links
│   ├── experience.ts             # Work history and education entries
│   ├── projects.ts               # Project name, description, URL, thumbnail
│   ├── certifications.ts         # Certification name and issuer
│   ├── techStack.ts              # Technology categories and items
│   ├── recommendations.ts        # Testimonial quotes and attribution
│   ├── memberships.ts            # Professional organization memberships
│   ├── gallery.ts                # Gallery image URLs and alt text
│   └── blogPosts.ts              # Blog post content (title, slug, body, tags)
│
├── hooks/                        # Custom React hooks
│   ├── useCarousel.ts            # Auto-advancing carousel with pause-on-hover
│   └── useTheme.ts               # Theme state wrapper around next-themes
│
├── lib/                          # Helpers and utilities
│   ├── utils.ts                  # Class name merger (cn), URL formatter
│   └── s3-urls.ts                # S3 asset URL builders (profile, resume, gallery)
│
└── types/
    └── index.ts                  # TypeScript interfaces (Profile, Project, etc.)
```

## Directory Purpose Summary

| Directory | Responsibility |
|-----------|---------------|
| `app/` | Next.js pages and routing |
| `components/layout/` | Page-level structure (header, footer, columns) |
| `components/sections/` | Content blocks that form the portfolio |
| `components/ui/` | Small, reusable UI primitives |
| `data/` | All editable content — update here, not in components |
| `hooks/` | Stateful logic extracted from components |
| `lib/` | Pure utility functions |
| `types/` | Shared TypeScript type definitions |
