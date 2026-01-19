# 📋 Portfolio → Tech Resume Transformation Plan

> **MASTER IMPLEMENTATION DOCUMENT**  
> This is the single source of truth for the resume redesign project.  
> All progress, technical decisions, and implementation details are tracked here.

## 🎯 Project Overview

**Current State**: Traditional portfolio website with project showcases  
**Target State**: Professional tech resume-style interface with emphasis on experience, skills, and achievements  
**Goal**: Transform the portfolio to look like an interactive, modern technical resume that functions as both a web application and a downloadable PDF

### Core Features
- ✅ **Resume-first design** - Looks like a professional tech resume, not a portfolio
- 📄 **Print-friendly** - Optimized for A4 printing with dedicated print stylesheet
- 📥 **PDF export** - Client-side PDF generation with matching layout
- 📊 **Achievement-focused** - Every bullet point includes metrics and outcomes
- 🎯 **Professional layout** - Clean, scannable, ATS-friendly formatting
- ⏱️ **5-6 week timeline** - Realistic phase-by-phase approach with milestones

---

## 🔍 Current State Analysis

### Existing Structure
```
Portfolio v3 (React 19 + TanStack Router + HeroUI)
├── Main Section (Hero/Introduction)
├── Projects Gallery
├── Gallery/Media Section
├── Certifications
├── Technologies/Skills
├── Experiences
├── Contact Form
└── GitHub Integration
```

### Technical Stack Inventory
```typescript
// Core Framework
React 19.0.0 + TypeScript 5.7.2
Vite 6.0.7 (Build tool)
TanStack Router 1.131.27 (File-based routing)
TanStack Query 5.85.5 (Data fetching)

// UI Framework
@heroui/react 2.8.2
Tailwind CSS v4 (via @tailwindcss/vite 4.0.14)
Framer Motion 12.23.12 (Animations)

// Build & Dev Tools
pnpm 8.x (Package manager)
ESLint + Prettier (Code quality)
vite-imagetools (Image optimization)
```

### Current Design Pattern Analysis
- ✅ Modern stack (React 19, Vite, TanStack Router)
- ✅ Dark theme with HeroUI components
- ✅ Responsive design with Tailwind CSS
- ✅ Animation support (Framer Motion)
- ✅ Image optimization (vite-imagetools)
- ⚠️ Portfolio-focused (projects first) → **NEEDS CHANGE**
- ⚠️ Separated sections without cohesion → **NEEDS IMPROVEMENT**
- ⚠️ No clear resume hierarchy → **CRITICAL FIX**
- ⚠️ No print optimization → **MUST ADD**
- ⚠️ No PDF export → **MUST ADD**

---

## 🎨 Design Goals

### Resume-Style Principles

1. **Professional Layout**
   - Clean, scannable document structure
   - Clear visual hierarchy
   - Print-friendly design option
   - Professional typography

2. **Information Architecture**
   - Experience-first approach
   - Skills prominently displayed
   - Projects as portfolio items within experience
   - Achievements highlighted

3. **Tech Resume Aesthetics**
   - Minimal, professional color scheme
   - PDF-like appearance
   - Structured sections with clear headers
   - Professional spacing and alignment

4. **Interactive Elements**
   - Hover effects for details
   - Expandable sections
   - Modal overlays for deep dives
   - Smooth transitions

---

## 📐 New Information Architecture & Design System

### Resume Layout Structure (Technical Specification)

```
┌─────────────────────────────────────────────────┐
│  HEADER (Fixed 120px height)                   │
│  Container: max-w-[1000px] mx-auto             │
│  ┌───────────────────────────────────────────┐ │
│  │ Name (text-4xl font-bold)                │ │
│  │ Title (text-xl text-muted)               │ │
│  │ Contact: email | phone | location        │ │
│  │ Links: GitHub | LinkedIn | [PDF Export] │ │
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  PROFESSIONAL SUMMARY (py-8)                   │
│  bg-custom-secondary rounded-lg p-6            │
│  ┌───────────────────────────────────────────┐ │
│  │ Elevator pitch (text-base leading-7)     │ │
│  │ Metrics: X years • Y projects • Z tech  │ │
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  TECHNICAL SKILLS (py-8)                       │
│  Grid layout with category grouping            │
│  ┌───────────────────────────────────────────┐ │
│  │ Languages: [Badge] [Badge] [Badge]       │ │
│  │ Proficiency: ████████ 8/10               │ │
│  │ Frameworks: [Badge] [Badge]              │ │
│  │ Tools: [Badge] [Badge] [Badge]           │ │
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  PROFESSIONAL EXPERIENCE (py-8)                │
│  Timeline layout with connectors               │
│  ┌───────────────────────────────────────────┐ │
│  │ ● Company Name      2020-Present  Remote│ │
│  │ │ Senior Developer                       │ │
│  │ │ • Achievement with metrics             │ │
│  │ │ • Impact statement                     │ │
│  │ │ Tech: React • TypeScript • Node.js    │ │
│  │ │ [Expand Projects ▼]                    │ │
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  PROJECTS & PORTFOLIO (py-8)                   │
│  Compact cards: 2-col grid on desktop         │
│  ┌───────────────────────────────────────────┐ │
│  │ 🖼 Project Title          2023          │ │
│  │    React • Node.js • AWS                 │ │
│  │    Brief description (2 lines max)       │ │
│  │    🔗 Live  💻 Code  📊 Stats            │ │
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  EDUCATION & CERTIFICATIONS (py-8)             │
│  Tabular layout with verification links       │
│  ┌───────────────────────────────────────────┐ │
│  │ BS Computer Science   University  2020  │ │
│  │ AWS Certified        Amazon       2023  │ │
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  ACHIEVEMENTS & STATS (py-8)                   │
│  4-column metric cards                         │
│  ┌───────────────────────────────────────────┐ │
│  │  500+      25+       5+       15+       │ │
│  │ Commits  Projects  Years   Certs        │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Design System Configuration

#### globals.css Additions (to be added)
```css
@layer base {
  :root {
    /* Resume-specific colors */
    --resume-primary: 0 0% 9%;           /* Deep black for text */
    --resume-secondary: 0 0% 45%;        /* Medium gray */
    --resume-tertiary: 0 0% 71%;         /* Light gray */
    --resume-accent: 217 91% 60%;        /* Professional blue */
    --resume-accent-hover: 217 91% 50%;
    --resume-border: 0 0% 89%;           /* Subtle borders */
    --resume-background: 0 0% 100%;      /* Pure white */
    --resume-background-alt: 0 0% 98%;   /* Off-white */
    
    /* Spacing scale for resume */
    --resume-space-xs: 0.5rem;   /* 8px */
    --resume-space-sm: 1rem;     /* 16px */
    --resume-space-md: 1.5rem;   /* 24px */
    --resume-space-lg: 2rem;     /* 32px */
    --resume-space-xl: 3rem;     /* 48px */
    --resume-space-2xl: 4rem;    /* 64px */
    
    /* Typography scale */
    --resume-text-xs: 0.75rem;    /* 12px */
    --resume-text-sm: 0.875rem;   /* 14px */
    --resume-text-base: 1rem;     /* 16px */
    --resume-text-lg: 1.125rem;   /* 18px */
    --resume-text-xl: 1.25rem;    /* 20px */
    --resume-text-2xl: 1.5rem;    /* 24px */
    --resume-text-3xl: 2rem;      /* 32px */
    --resume-text-4xl: 2.5rem;    /* 40px */
  }

  .dark {
    /* Dark mode resume colors */
    --resume-primary: 0 0% 98%;          /* Off-white text */
    --resume-secondary: 0 0% 63%;        /* Medium gray */
    --resume-tertiary: 0 0% 45%;         /* Darker gray */
    --resume-accent: 217 91% 65%;        /* Lighter blue */
    --resume-accent-hover: 217 91% 75%;
    --resume-border: 0 0% 20%;           /* Dark borders */
    --resume-background: 240 5% 15.9%;   /* Dark bg */
    --resume-background-alt: 240 6% 10%; /* Darker bg */
  }
}

/* Resume container styling */
.resume-container {
  max-width: 1000px;
  margin: 0 auto;
  background: hsl(var(--resume-background));
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

/* Resume section dividers */
.resume-section {
  padding: var(--resume-space-lg) var(--resume-space-xl);
  border-bottom: 1px solid hsl(var(--resume-border));
}

.resume-section:last-child {
  border-bottom: none;
}

/* Resume section headers */
.resume-section-header {
  font-size: var(--resume-text-2xl);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--resume-space-md);
  color: hsl(var(--resume-primary));
  position: relative;
  padding-bottom: var(--resume-space-sm);
}

.resume-section-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: hsl(var(--resume-accent));
}

/* Print optimization */
@media print {
  .resume-container {
    max-width: 100%;
    box-shadow: none;
    border-radius: 0;
  }
  
  .resume-section {
    page-break-inside: avoid;
    padding: 1rem 0.5rem;
  }
  
  .no-print {
    display: none !important;
  }
  
  /* Force print colors */
  * {
    color-adjust: exact;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

#### Tailwind Configuration Extensions
```typescript
// Add to tailwind.config.js theme extension
{
  colors: {
    resume: {
      primary: 'hsl(var(--resume-primary))',
      secondary: 'hsl(var(--resume-secondary))',
      tertiary: 'hsl(var(--resume-tertiary))',
      accent: 'hsl(var(--resume-accent))',
      'accent-hover': 'hsl(var(--resume-accent-hover))',
      border: 'hsl(var(--resume-border))',
      bg: 'hsl(var(--resume-background))',
      'bg-alt': 'hsl(var(--resume-background-alt))',
    }
  },
  spacing: {
    'resume-xs': 'var(--resume-space-xs)',
    'resume-sm': 'var(--resume-space-sm)',
    'resume-md': 'var(--resume-space-md)',
    'resume-lg': 'var(--resume-space-lg)',
    'resume-xl': 'var(--resume-space-xl)',
    'resume-2xl': 'var(--resume-space-2xl)',
  },
  fontSize: {
    'resume-xs': 'var(--resume-text-xs)',
    'resume-sm': 'var(--resume-text-sm)',
    'resume-base': 'var(--resume-text-base)',
    'resume-lg': 'var(--resume-text-lg)',
    'resume-xl': 'var(--resume-text-xl)',
    'resume-2xl': 'var(--resume-text-2xl)',
    'resume-3xl': 'var(--resume-text-3xl)',
    'resume-4xl': 'var(--resume-text-4xl)',
  }
}
```

## 🚀 Phase-by-Phase Implementation Plan

### **PHASE 1: Foundation & Layout** (Week 1) ⏳
**Goal**: Restructure the main layout to resume format  
**Duration**: 5-7 days  
**Progress**: ⬜ Not Started

#### 1.1 Create Resume Container Component
**File**: `src/components/features/resume/resume-container.tsx` (NEW)  
**Status**: ⬜ Not Started  
**Dependencies**: None  
**Estimated Time**: 2 hours

**Implementation**:
```tsx
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResumeContainerProps {
  children: ReactNode;
  className?: string;
}

export const ResumeContainer = ({ children, className }: ResumeContainerProps) => {
  return (
    <div className={cn(
      "resume-container",
      "max-w-[1000px] mx-auto",
      "bg-resume-bg dark:bg-resume-background-alt",
      "shadow-2xl rounded-lg overflow-hidden",
      "my-8 transition-all duration-300",
      className
    )}>
      {children}
    </div>
  );
};

// Resume Section Wrapper
interface ResumeSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  noBorder?: boolean;
}

export const ResumeSection = ({ 
  children, 
  id, 
  className, 
  noBorder = false 
}: ResumeSectionProps) => {
  return (
    <section 
      id={id}
      className={cn(
        "resume-section",
        "px-8 py-10 md:px-12 md:py-12",
        !noBorder && "border-b border-resume-border",
        "transition-all duration-200",
        "page-break-inside-avoid", // Print optimization
        className
      )}
    >
      {children}
    </section>
  );
};

// Resume Section Header
interface ResumeSectionHeaderProps {
  children: ReactNode;
  className?: string;
}

export const ResumeSectionHeader = ({ 
  children, 
  className 
}: ResumeSectionHeaderProps) => {
  return (
    <h2 className={cn(
      "resume-section-header",
      "text-2xl md:text-3xl font-semibold uppercase",
      "tracking-wide text-resume-primary",
      "mb-6 pb-3 relative",
      "after:content-[''] after:absolute after:bottom-0 after:left-0",
      "after:w-16 after:h-1 after:bg-resume-accent",
      "after:rounded-full",
      className
    )}>
      {children}
    </h2>
  );
};

// Export all components
export const Resume = {
  Container: ResumeContainer,
  Section: ResumeSection,
  Header: ResumeSectionHeader,
};
```

**HeroUI Integration**:
```tsx
// Use HeroUI's Card component as base
import { Card, CardBody } from '@heroui/react';

// Alternative implementation using HeroUI
export const ResumeContainerHeroUI = ({ children }: ResumeContainerProps) => {
  return (
    <Card 
      className="max-w-[1000px] mx-auto my-8"
      shadow="lg"
      radius="lg"
    >
      <CardBody className="p-0">
        {children}
      </CardBody>
    </Card>
  );
};
```

**Tasks**:
- [ ] Create `ResumeContainer` component with max-width 1000px
- [ ] Add `ResumeSection` wrapper with consistent padding
- [ ] Create `ResumeSectionHeader` with underline accent
- [ ] Implement compound component pattern (Resume.Container, Resume.Section, etc.)
- [ ] Add print-friendly CSS classes (page-break-inside-avoid)
- [ ] Add responsive padding (smaller on mobile)
- [ ] Test with HeroUI Card component integration

**Changes Needed**:
1. Update `src/routes/index.tsx`:
   ```tsx
   import { Resume } from '@/components/features/resume/resume-container';
   
   function Index() {
     return (
       <Resume.Container>
         <ResumeHeader />
         <Resume.Section id="summary">
           <ProfessionalSummary />
         </Resume.Section>
         {/* ... other sections */}
       </Resume.Container>
     );
   }
   ```

2. Replace full-width sections with constrained resume layout
3. Remove any max-w-full or w-screen classes
4. Update spacing to use resume-specific tokens

**Acceptance Criteria**:
- ✅ Container has max-width of 1000px
- ✅ Centered on page with auto margins
- ✅ Shadow effect for depth
- ✅ Responsive on mobile (full width with padding)
- ✅ Print-friendly (no shadow, breaks avoided)
- ✅ Dark mode support

---

#### 1.2 Redesign Header Section
**File**: `src/sections/resume-header.tsx` (NEW, replaces `src/sections/header.tsx`)  
**Status**: ⬜ Not Started  
**Dependencies**: 1.1 (Resume Container)  
**Estimated Time**: 3 hours

**Current State**: Traditional hero section with large image  
**Target State**: Compact professional resume header

**Implementation**:
```tsx
import { Link } from '@tanstack/react-router';
import { Mail, Phone, MapPin, Download, Github, Linkedin } from 'lucide-react';
import { Button } from '@heroui/react';
import { motion } from 'framer-motion';

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
}

interface ResumeHeaderProps {
  name: string;
  title: string;
  contact: ContactInfo;
  onDownloadPDF?: () => void;
}

export const ResumeHeader = ({ 
  name, 
  title, 
  contact, 
  onDownloadPDF 
}: ResumeHeaderProps) => {
  return (
    <motion.header 
      className="resume-section noBorder bg-gradient-to-r from-resume-bg to-resume-bg-alt"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Name & Title */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-resume-primary mb-2">
            {name}
          </h1>
          <p className="text-xl md:text-2xl text-resume-secondary font-medium">
            {title}
          </p>
        </div>

        {/* Download Resume Button */}
        <div className="flex-shrink-0 no-print">
          <Button
            color="primary"
            variant="solid"
            startContent={<Download size={18} />}
            onPress={onDownloadPDF}
            className="font-semibold"
          >
            Download Resume
          </Button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-resume-secondary">
        <a 
          href={`mailto:${contact.email}`}
          className="flex items-center gap-2 hover:text-resume-accent transition-colors"
        >
          <Mail size={16} />
          <span>{contact.email}</span>
        </a>
        
        <a 
          href={`tel:${contact.phone}`}
          className="flex items-center gap-2 hover:text-resume-accent transition-colors"
        >
          <Phone size={16} />
          <span>{contact.phone}</span>
        </a>
        
        <span className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{contact.location}</span>
        </span>
        
        <div className="flex items-center gap-4 ml-auto">
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-resume-accent transition-colors"
            aria-label="GitHub Profile"
          >
            <Github size={20} />
          </a>
          
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-resume-accent transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </motion.header>
  );
};
```

**Data Structure** (`src/assets/portfolio-resources/data/profile.json`):
```json
{
  "name": "Your Name",
  "title": "Full Stack Developer",
  "email": "your.email@example.com",
  "phone": "+1 (555) 123-4567",
  "location": "San Francisco, CA",
  "github": "https://github.com/yourusername",
  "linkedin": "https://linkedin.com/in/yourusername",
  "summary": "Passionate Full Stack Developer with 5+ years..."
}
```

**Tasks**:
- [ ] Create compact header component (120px height)
- [ ] Add name with large bold typography (text-4xl)
- [ ] Add title/role with medium weight (text-xl)
- [ ] Add inline contact information with icons
- [ ] Add social links (GitHub, LinkedIn)
- [ ] Add "Download PDF Resume" button (top-right)
- [ ] Remove large hero images/backgrounds
- [ ] Add subtle gradient background
- [ ] Implement Framer Motion entrance animation
- [ ] Add `no-print` class to interactive elements
- [ ] Create `profile.json` data file
- [ ] Update CoreService to fetch profile data

**Responsive Design**:
- Desktop: Flex row with name/title on left, button on right
- Tablet: Same as desktop
- Mobile: Stack vertically, full-width button

**Acceptance Criteria**:
- ✅ Header height ~120-140px
- ✅ Name is prominently displayed (largest text)
- ✅ All contact info clickable (mailto, tel links)
- ✅ Social icons link to profiles
- ✅ Download button triggers PDF export
- ✅ Responsive layout works on all devices
- ✅ Print version hides button and links

---

#### 1.3 Create Professional Summary Section
**File**: `src/sections/professional-summary.tsx` (NEW)  
**Status**: ⬜ Not Started  
**Dependencies**: 1.1, 1.2  
**Estimated Time**: 1.5 hours

**Implementation**:
```tsx
import { motion } from 'framer-motion';
import { Resume } from '@/components/features/resume/resume-container';
import { Chip } from '@heroui/react';

interface ProfessionalSummaryProps {
  summary: string;
  highlights: {
    yearsExperience: number;
    projectsCompleted: number;
    primaryTechnologies: string[];
  };
}

export const ProfessionalSummary = ({ 
  summary, 
  highlights 
}: ProfessionalSummaryProps) => {
  return (
    <Resume.Section id="summary" className="bg-resume-bg-alt">
      <Resume.Header>Professional Summary</Resume.Header>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Summary Text */}
        <p className="text-base leading-7 text-resume-primary mb-6">
          {summary}
        </p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-4 items-center">
          <Chip 
            color="primary" 
            variant="flat"
            className="font-semibold"
          >
            {highlights.yearsExperience}+ Years Experience
          </Chip>
          
          <Chip 
            color="success" 
            variant="flat"
            className="font-semibold"
          >
            {highlights.projectsCompleted}+ Projects Delivered
          </Chip>
          
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-resume-secondary">Focus:</span>
            {highlights.primaryTechnologies.map((tech, index) => (
              <Chip 
                key={index}
                size="sm"
                variant="bordered"
              >
                {tech}
              </Chip>
            ))}
          </div>
        </div>
      </motion.div>
    </Resume.Section>
  );
};
```

**Data Structure Update** (`profile.json`):
```json
{
  "name": "Your Name",
  "title": "Full Stack Developer",
  "summary": "Passionate Full Stack Developer with 5+ years of experience building scalable web applications. Specialized in React, TypeScript, and Node.js with a proven track record of delivering high-impact projects. Strong focus on clean code, performance optimization, and user experience.",
  "highlights": {
    "yearsExperience": 5,
    "projectsCompleted": 25,
    "primaryTechnologies": ["React", "TypeScript", "Node.js"]
  }
}
```

**Tasks**:
- [ ] Create professional summary component
- [ ] Style as 2-3 line paragraph (leading-7 for readability)
- [ ] Add subtle background (bg-resume-bg-alt)
- [ ] Add highlight chips (years, projects, focus)
- [ ] Use HeroUI Chip component for badges
- [ ] Add entrance animation (Framer Motion)
- [ ] Update profile.json with summary content
- [ ] Integrate with CoreService

**Design Specs**:
- Font size: 1rem (16px)
- Line height: 1.75 (28px)
- Max width: None (full section width)
- Padding: Standard resume section padding
- Background: Subtle alt color for distinction

**Acceptance Criteria**:
- ✅ Summary is 2-3 sentences, concise and impactful
- ✅ Highlights are displayed as chips/badges
- ✅ Readable and scannable
- ✅ Subtle background differentiates section
- ✅ Animation on scroll into view
- ✅ Print-friendly styling

---

### **PHASE 2: Technical Skills Showcase** (Week 1-2) ⏳
**Goal**: Transform technologies section into resume-style skills display with proficiency indicators  
**Duration**: 4-6 days  
**Progress**: ⬜ Not Started

#### 2.1 Redesign Skills Section
**File**: `src/sections/technical-skills.tsx` (REDESIGN from `technologies.tsx`)  
**Status**: ⬜ Not Started  
**Dependencies**: Phase 1 complete  
**Estimated Time**: 4 hours

**Current State**: Tech logos in large grid layout  
**Target State**: Categorized skill badges with proficiency bars

**Visual Layout**:
```
TECHNICAL SKILLS
════════════════════════════════════════════
Languages
  TypeScript  ████████░░ 8/10   5 years
  JavaScript  ███████░░░ 7/10   6 years
  Python      █████░░░░░ 5/10   2 years

Frameworks & Libraries
  React       █████████░ 9/10   Expert
  Node.js     ████████░░ 8/10   Advanced
  Next.js     ███████░░░ 7/10   Proficient

Tools & Platform
  Git         █████████░ 9/10   Expert
  Docker      ████████░░ 8/10   Advanced
  AWS         ██████░░░░ 6/10   Intermediate
```

**Implementation**:
```tsx
import { Resume } from '@/components/features/resume/resume-container';
import { Progress, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import type { Technology } from '@/services/core/types';

interface TechnicalSkillsProps {
  skills: TechnologyCategory[];
}

interface TechnologyCategory {
  category: string;
  technologies: Technology[];
}

interface Technology {
  name: string;
  proficiency: number; // 1-10
  yearsExperience: number;
  icon?: string;
  level: 'Beginner' | 'Intermediate' | 'Proficient' | 'Advanced' | 'Expert';
}

export const TechnicalSkills = ({ skills }: TechnicalSkillsProps) => {
  return (
    <Resume.Section id="skills">
      <Resume.Header>Technical Skills</Resume.Header>
      
      <div className="space-y-8">
        {skills.map((category, catIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
          >
            {/* Category Header */}
            <h3 className="text-lg font-semibold text-resume-primary mb-4 uppercase tracking-wide">
              {category.category}
            </h3>
            
            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.technologies.map((tech) => (
                <SkillItem key={tech.name} skill={tech} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Resume.Section>
  );
};

// Skill Item Component
interface SkillItemProps {
  skill: Technology;
}

const SkillItem = ({ skill }: SkillItemProps) => {
  const proficiencyPercent = (skill.proficiency / 10) * 100;
  
  // Color based on level
  const getLevelColor = (level: Technology['level']) => {
    switch (level) {
      case 'Expert': return 'success';
      case 'Advanced': return 'primary';
      case 'Proficient': return 'secondary';
      case 'Intermediate': return 'warning';
      case 'Beginner': return 'default';
    }
  };
  
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-resume-bg-alt hover:bg-resume-border transition-colors">
      {/* Skill Name & Level Badge */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-resume-primary truncate">
            {skill.name}
          </span>
          <Chip 
            size="sm" 
            color={getLevelColor(skill.level)}
            variant="flat"
            className="ml-auto flex-shrink-0"
          >
            {skill.level}
          </Chip>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <Progress 
            value={proficiencyPercent} 
            color={getLevelColor(skill.level)}
            size="sm"
            className="flex-1"
            aria-label={`${skill.name} proficiency`}
          />
          <span className="text-sm text-resume-secondary font-medium flex-shrink-0 w-12 text-right">
            {skill.proficiency}/10
          </span>
        </div>
        
        {/* Years Experience */}
        <div className="mt-1 text-xs text-resume-tertiary">
          {skill.yearsExperience} {skill.yearsExperience === 1 ? 'year' : 'years'} experience
        </div>
      </div>
    </div>
  );
};

// Alternative Compact Badge Layout (for print/mobile)
export const SkillBadgeList = ({ skills }: TechnicalSkillsProps) => {
  return (
    <div className="space-y-4">
      {skills.map((category) => (
        <div key={category.category} className="flex flex-wrap gap-2">
          <span className="w-full text-sm font-semibold text-resume-secondary uppercase mb-1">
            {category.category}:
          </span>
          {category.technologies.map((tech) => (
            <Chip 
              key={tech.name}
              variant="bordered"
              className="font-medium"
            >
              {tech.name} ({tech.proficiency}/10)
            </Chip>
          ))}
        </div>
      ))}
    </div>
  );
};
```

**Data Structure Update** (`technologies.json`):
```json
[
  {
    "category": "Languages",
    "technologies": [
      {
        "name": "TypeScript",
        "proficiency": 8,
        "yearsExperience": 5,
        "level": "Advanced",
        "icon": "typescript-icon.svg"
      },
      {
        "name": "JavaScript",
        "proficiency": 7,
        "yearsExperience": 6,
        "level": "Advanced",
        "icon": "javascript-icon.svg"
      }
    ]
  },
  {
    "category": "Frameworks & Libraries",
    "technologies": [
      {
        "name": "React",
        "proficiency": 9,
        "yearsExperience": 5,
        "level": "Expert",
        "icon": "react-icon.svg"
      }
    ]
  }
]
```

**CoreService Update** (`src/services/core/service.ts`):
```typescript
// Add method to CoreService
async getTechnologiesByCategory(): Promise<TechnologyCategory[]> {
  const technologies = await this.getTechnologies();
  
  // Group by category
  const categorized: Record<string, Technology[]> = {};
  
  technologies.forEach(tech => {
    const category = tech.category || 'Other';
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(tech);
  });
  
  // Convert to array and sort by proficiency
  return Object.entries(categorized).map(([category, techs]) => ({
    category,
    technologies: techs.sort((a, b) => b.proficiency - a.proficiency)
  }));
}
```

**Tasks**:
- [ ] Create categorized skills layout (Languages, Frameworks, Tools)
- [ ] Replace large tech logos with compact badges
- [ ] Implement proficiency progress bars (1-10 scale)
- [ ] Add skill level indicators (Beginner → Expert)
- [ ] Add years of experience for each skill
- [ ] Update technologies.json with proficiency data
- [ ] Add getTechnologiesByCategory to CoreService
- [ ] Create compact badge layout for print/mobile
- [ ] Add hover effects for interactivity
- [ ] Implement stagger animations (Framer Motion)
- [ ] Use HeroUI Progress and Chip components

**Responsive Design**:
- Desktop: 2-column grid for skills
- Tablet: 2-column grid
- Mobile: 1-column stack
- Print: Compact badge list without progress bars

**Acceptance Criteria**:
- ✅ Skills grouped by category (3-5 categories)
- ✅ Each skill shows proficiency (1-10) + level badge
- ✅ Progress bars visually indicate proficiency
- ✅ Years of experience displayed
- ✅ Color-coded by skill level
- ✅ Responsive layout
- ✅ Print-friendly compact version
- ✅ Smooth entrance animations

---

### **PHASE 3: Professional Experience Timeline** (Week 2) ⏳
**Goal**: Create professional experience section with achievement-focused content and timeline  
**Duration**: 5-6 days  
**Progress**: ⬜ Not Started

#### 3.1 Transform Experience Section
**File**: `src/sections/experiences.tsx` (MAJOR REDESIGN)  
**Status**: ⬜ Not Started  
**Dependencies**: Phase 1, Phase 2  
**Estimated Time**: 5 hours

**Current State**: Simple experience cards with basic info  
**Target State**: Resume-style timeline with achievements, metrics, and expandable projects

**Visual Layout**:
```
PROFESSIONAL EXPERIENCE
════════════════════════════════════════════

●───┐ Acme Corp                 2020 - Present
│   │ Senior Full Stack Developer        Remote
│   │
│   │ • Led development of microservices architecture
│   │   reducing API response time by 40% (500ms → 300ms)
│   │ • Mentored team of 5 junior developers, improving
│   │   code quality by 60% (measured by code reviews)
│   │ • Implemented CI/CD pipeline increasing deployment
│   │   frequency by 300% (weekly → daily releases)
│   │
│   │ Technologies: React • TypeScript • Node.js • AWS
│   │ [▼ View 3 Projects]
│   └─────────────────────────────────────────────

●───┐ Tech Startup Inc          2018 - 2020
    │ Full Stack Developer            San Francisco
    ...
```

**Implementation**:
```tsx
import { Resume } from '@/components/features/resume/resume-container';
import { Button, Chip, Accordion, AccordionItem } from '@heroui/react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ChevronDown } from 'lucide-react';
import type { Experience, Project } from '@/services/core/types';

interface ProfessionalExperienceProps {
  experiences: Experience[];
  projects?: Project[];
}

export const ProfessionalExperience = ({ 
  experiences,
  projects = []
}: ProfessionalExperienceProps) => {
  return (
    <Resume.Section id="experience">
      <Resume.Header>Professional Experience</Resume.Header>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-resume-border md:block hidden" />
        
        {/* Experience Items */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <ExperienceItem 
              key={index}
              experience={exp}
              projects={projects.filter(p => 
                exp.relatedProjects?.includes(p.id)
              )}
              index={index}
            />
          ))}
        </div>
      </div>
    </Resume.Section>
  );
};

// Experience Item Component
interface ExperienceItemProps {
  experience: Experience;
  projects: Project[];
  index: number;
}

const ExperienceItem = ({ experience, projects, index }: ExperienceItemProps) => {
  const relatedProjectCount = projects.length;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 md:pl-10"
    >
      {/* Timeline Dot */}
      <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-resume-accent border-4 border-resume-bg hidden md:block" />
      
      {/* Experience Card */}
      <div className="bg-resume-bg-alt rounded-lg p-6 hover:shadow-lg transition-shadow">
        {/* Header: Company, Duration, Location */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-resume-primary mb-1">
              {experience.company}
            </h3>
            <p className="text-lg font-semibold text-resume-accent mb-2">
              {experience.position}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-1 text-sm text-resume-secondary">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span className="font-medium">{experience.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} />
              <span>{experience.location}</span>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="space-y-2 mb-4">
          {experience.achievements.map((achievement, idx) => (
            <div 
              key={idx}
              className="flex gap-3 text-resume-primary leading-relaxed"
            >
              <span className="text-resume-accent font-bold mt-1 flex-shrink-0">•</span>
              <p className="flex-1">{achievement}</p>
            </div>
          ))}
        </div>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {experience.technologies.map((tech) => (
            <Chip 
              key={tech}
              size="sm"
              variant="flat"
              className="font-medium"
            >
              {tech}
            </Chip>
          ))}
        </div>
        
        {/* Related Projects (Expandable) */}
        {relatedProjectCount > 0 && (
          <Accordion className="px-0">
            <AccordionItem
              key="projects"
              aria-label={`View ${relatedProjectCount} related projects`}
              title={
                <div className="flex items-center gap-2 text-resume-accent hover:text-resume-accent-hover transition-colors">
                  <ChevronDown size={16} />
                  <span className="font-semibold">
                    View {relatedProjectCount} Related Project{relatedProjectCount > 1 ? 's' : ''}
                  </span>
                </div>
              }
              className="no-print"
            >
              <div className="grid grid-cols-1 gap-4 pt-4">
                {projects.map((project) => (
                  <ProjectPreviewCard key={project.id} project={project} />
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </motion.div>
  );
};

// Mini Project Preview Card
interface ProjectPreviewCardProps {
  project: Project;
}

const ProjectPreviewCard = ({ project }: ProjectPreviewCardProps) => {
  return (
    <div className="bg-resume-bg rounded-lg p-4 border border-resume-border hover:border-resume-accent transition-colors">
      <h4 className="font-semibold text-resume-primary mb-2">
        {project.title}
      </h4>
      <p className="text-sm text-resume-secondary line-clamp-2 mb-3">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.technologies.slice(0, 4).map((tech) => (
          <Chip key={tech} size="sm" variant="bordered">
            {tech}
          </Chip>
        ))}
      </div>
    </div>
  );
};
```

**Data Structure Update** (`experiences.json`):
```json
[
  {
    "id": "exp-1",
    "company": "Acme Corporation",
    "position": "Senior Full Stack Developer",
    "duration": "Jan 2020 - Present",
    "location": "Remote",
    "achievements": [
      "Led development of microservices architecture reducing API response time by 40% (500ms → 300ms)",
      "Mentored team of 5 junior developers, improving code quality by 60% measured through code review metrics",
      "Implemented comprehensive CI/CD pipeline increasing deployment frequency by 300% (weekly → daily releases)",
      "Architected real-time notification system serving 100K+ daily active users with 99.9% uptime"
    ],
    "technologies": [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "AWS",
      "Docker",
      "Kubernetes"
    ],
    "relatedProjects": ["project-1", "project-3"]
  }
]
```

**CoreService Types Update** (`src/services/core/types.ts`):
```typescript
export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  achievements: string[];  // NEW: Achievement bullet points
  technologies: string[];
  relatedProjects?: string[];  // NEW: Link to project IDs
  description?: string;  // Legacy support
  startDate?: string;  // For sorting
  endDate?: string | 'Present';
}
```

**Content Guidelines for Achievements**:
```
FORMULA: [Action Verb] + [What You Did] + [Result/Metric]

✅ GOOD Examples:
- "Led development of microservices reducing API time by 40%"
- "Mentored 5 developers improving code quality by 60%"
- "Implemented CI/CD increasing deployments by 300%"

❌ BAD Examples:
- "Worked on the website" (no action, no metric)
- "Made improvements" (vague, no result)
- "Responsible for development" (passive, no outcome)

Key Action Verbs:
- Led, Developed, Architected, Implemented
- Reduced, Increased, Improved, Optimized
- Managed, Mentored, Collaborated
```

**Tasks**:
- [ ] Redesign experience cards with timeline connector
- [ ] Add timeline dot and vertical line (desktop only)
- [ ] Update experience layout: company/position/duration/location
- [ ] Implement achievement bullet points with metrics
- [ ] Add technology chips for each experience
- [ ] Create expandable "View Projects" section using Accordion
- [ ] Link related projects to experiences
- [ ] Update experiences.json with achievement-focused content
- [ ] Add CoreService support for relatedProjects linking
- [ ] Create ProjectPreviewCard mini component
- [ ] Implement stagger animations for timeline items
- [ ] Add hover effects for interactivity
- [ ] Make timeline responsive (hide line on mobile)

**Responsive Design**:
- Desktop: Timeline with vertical line, 2-column header
- Tablet: Timeline without line, stacked header
- Mobile: Card layout without timeline, vertical stack
- Print: Remove expandable sections, show all content

**Acceptance Criteria**:
- ✅ Experiences displayed in reverse chronological order
- ✅ Timeline visual on desktop (dot + line)
- ✅ Every achievement includes a metric or outcome
- ✅ Technologies displayed as chips
- ✅ Related projects expandable (Accordion)
- ✅ Smooth animations on scroll
- ✅ Print-friendly (no accordions, flat layout)
- ✅ Responsive on all devices

---

### **PHASE 4: Project Portfolio** (Week 2-3)
**Goal**: Redesign projects as resume-style portfolio items

#### 4.1 Compact Project Cards
**File**: `src/sections/projects.tsx`

**Current**: Large image-heavy project cards  
**Target**: Compact, information-dense project listings

```tsx
┌──────────────────────────────────────────────┐
│ E-Commerce Platform        2023            │
│ React • Node.js • PostgreSQL • AWS         │
│                                             │
│ Full-stack marketplace with real-time      │
│ inventory, payment processing, and         │
│ analytics dashboard.                       │
│                                             │
│ 🌐 Live Demo  💻 Source Code  📊 Case Study│
└──────────────────────────────────────────────┘
```

**Tasks**:
- [ ] Reduce card size (remove large images)
- [ ] Add small thumbnail (left side, 80x80px)
- [ ] Show tech stack as inline badges
- [ ] Keep description to 2-3 lines
- [ ] Add quick action buttons
- [ ] Use list or grid layout (2 columns max)

**Optional**: Modal overlay for project details on click

---

### **PHASE 5: Certifications & Education** (Week 3)
**Goal**: Combine education and certifications in resume format

#### 5.1 Education & Certifications Section
**File**: `src/sections/certifications.tsx` → `src/sections/education-certifications.tsx`

**Layout**:
```tsx
EDUCATION
─────────────────────────────────────────────────
B.S. Computer Science                      2020
University Name                    Location

CERTIFICATIONS
─────────────────────────────────────────────────
AWS Certified Solutions Architect          2023
Amazon Web Services                  [Verify]

Google Cloud Professional                  2022
Google                                [Verify]
```

**Tasks**:
- [ ] Split into Education and Certifications subsections
- [ ] Use tabular layout (degree | institution | year)
- [ ] Add verification links for certifications
- [ ] Remove large certificate images (use icons)
- [ ] Keep it compact and scannable

---

### **PHASE 6: Stats & Achievements** (Week 3)
**Goal**: Add metrics dashboard showcasing achievements

#### 6.1 Achievement Metrics Section
**File**: `src/sections/achievements-stats.tsx` (NEW)

**Content**:
```tsx
┌──────────────────────────────────────────────┐
│  GitHub Stats        Projects       Years  │
│  ─────────────      ─────────      ──────  │
│  500+ Commits         25+            5+    │
│  50 Repositories    Launched      Coding   │
│  100 Stars          Successfully           │
└──────────────────────────────────────────────┘
```

**Tasks**:
- [ ] Create metric cards for key achievements
- [ ] Pull GitHub stats (commits, repos, stars)
- [ ] Show projects count
- [ ] Show years of experience
- [ ] Show certifications count
- [ ] Use grid layout (3-4 columns)

**Data Sources**:
- GitHub API (already integrated)
- Count from projects.json
- Calculate from experience dates

---

### **PHASE 7: UI/UX Polish** (Week 4)
**Goal**: Refine the design to professional standards

#### 7.1 Typography System
**File**: `src/globals.css`

**Resume Font Hierarchy**:
```css
/* Name/Title */
h1: 2.5rem (40px), font-weight: 700, letter-spacing: -0.02em

/* Section Headers */
h2: 1.5rem (24px), font-weight: 600, uppercase, letter-spacing: 0.05em

/* Subsection Headers */
h3: 1.25rem (20px), font-weight: 600

/* Job Titles */
h4: 1.125rem (18px), font-weight: 500

/* Body Text */
p: 1rem (16px), line-height: 1.6

/* Small Text */
small: 0.875rem (14px)
```

**Tasks**:
- [ ] Update typography scale
- [ ] Use professional font (Inter, Roboto, or similar)
- [ ] Ensure consistent spacing
- [ ] Optimize for readability

---

#### 7.2 Color Scheme Refinement
**File**: `src/globals.css`

**Resume Color Palette**:
```css
:root {
  /* Professional grays */
  --resume-text-primary: #1a1a1a;
  --resume-text-secondary: #4a4a4a;
  --resume-text-tertiary: #707070;
  
  /* Accent colors (minimal) */
  --resume-accent: #2563eb; /* Blue for links */
  --resume-accent-hover: #1d4ed8;
  
  /* Backgrounds */
  --resume-bg: #ffffff;
  --resume-bg-alt: #f8f9fa;
  --resume-border: #e5e7eb;
  
  /* Dark mode */
  --resume-dark-bg: #1a1a1a;
  --resume-dark-text: #e5e7eb;
  --resume-dark-border: #374151;
}
```

**Tasks**:
- [ ] Define professional color palette
- [ ] Reduce color usage (minimal is professional)
- [ ] Ensure high contrast for readability
- [ ] Test dark mode for resume style

---

#### 7.3 Print Optimization
**File**: `src/styles/print.css` (NEW)

**Tasks**:
- [ ] Create print-specific stylesheet
- [ ] Hide interactive elements (buttons, animations)
- [ ] Optimize for A4 paper size
- [ ] Add page breaks where appropriate
- [ ] Ensure black & white printing looks good

```css
@media print {
  /* Hide non-essential elements */
  nav, footer, button, .no-print {
    display: none !important;
  }
  
  /* Optimize layout */
  body {
    font-size: 11pt;
    line-height: 1.4;
  }
  
  /* Page breaks */
  .section {
    page-break-inside: avoid;
  }
}
```

---

#### 7.4 Responsive Design
**File**: Component-specific CSS

**Breakpoints**:
```
Desktop (1024px+):  Full resume layout, 2-column where appropriate
Tablet (768px):     Single column, stacked sections
Mobile (< 768px):   Mobile-optimized, vertical timeline
```

**Tasks**:
- [ ] Test on all breakpoints
- [ ] Ensure readability on mobile
- [ ] Optimize touch targets for mobile
- [ ] Maintain professional look on all devices

---

### **PHASE 8: Interactive Features** (Week 4-5)
**Goal**: Add subtle interactive elements without compromising professionalism

#### 8.1 PDF Export Functionality
**File**: `src/components/common/pdf-export-button.tsx`

**Tasks**:
- [ ] Add "Download PDF Resume" button
- [ ] Implement PDF generation (using react-pdf or html2pdf)
- [ ] Ensure PDF matches screen layout
- [ ] Add metadata (title, author, keywords)

**Libraries**:
- `@react-pdf/renderer` or
- `html2canvas` + `jspdf`

---

#### 8.2 Section Navigation
**File**: `src/components/common/resume-navigation.tsx`

**Sticky Side Navigation**:
```tsx
┌──────┐
│ Info │
│ Skills│ ← Highlights current section
│ Exp  │
│ Proj │
│ Cert │
└──────┘
```

**Tasks**:
- [ ] Create sticky sidebar navigation
- [ ] Highlight current section on scroll
- [ ] Smooth scroll to section on click
- [ ] Hide on mobile (use hamburger menu)

---

#### 8.3 Expandable Details
**File**: Component-specific

**Pattern**: Click to expand for more details

**Tasks**:
- [ ] Experience → Show all projects
- [ ] Projects → Show full case study in modal
- [ ] Certifications → Show credential details
- [ ] Use smooth animations (not overwhelming)

---

### **PHASE 9: Content Optimization** (Week 5)
**Goal**: Refine content for resume format

#### 9.1 Content Audit
**Tasks**:
- [ ] Review all text for professional tone
- [ ] Add metrics to achievements (numbers!)
- [ ] Ensure bullet points follow action + result format
- [ ] Remove casual language
- [ ] Add keywords for ATS optimization

**Action + Result Format**:
```
❌ Worked on website
✅ Developed responsive website serving 10K+ daily users
```

---

#### 9.2 Data Structure Updates
**Files**: All JSON in `src/assets/portfolio-resources/data/`

**New/Updated Files**:
1. `profile.json` - Professional summary, bio, contact
2. `experiences.json` - Add achievements array
3. `projects.json` - Add metrics, outcomes
4. `skills.json` - Add proficiency levels
5. `education.json` - New file for education

---

### **PHASE 10: Performance & Accessibility** (Week 5-6)
**Goal**: Ensure fast, accessible resume experience

#### 10.1 Performance Optimization
**Tasks**:
- [ ] Lazy load below-the-fold sections
- [ ] Optimize images (already using vite-imagetools)
- [ ] Code splitting by route
- [ ] Minimize bundle size
- [ ] Achieve 90+ Lighthouse score

---

#### 10.2 Accessibility (A11y)
**Tasks**:
- [ ] Ensure proper heading hierarchy (h1 → h6)
- [ ] Add ARIA labels to interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Test with screen readers
- [ ] Add alt text to all images
- [ ] Ensure color contrast meets WCAG AA

---

#### 10.3 SEO Optimization
**Tasks**:
- [ ] Update meta tags for "tech resume" keywords
- [ ] Add structured data (Person, Resume schema)
- [ ] Optimize for job board crawlers
- [ ] Add Open Graph tags for sharing

```html
<meta property="og:type" content="profile" />
<meta property="og:title" content="John Doe - Full Stack Developer" />
<meta property="profile:first_name" content="John" />
<meta property="profile:last_name" content="Doe" />
```

---

## 📦 Component Inventory

### New Components to Create

```
src/components/
├── features/
│   ├── resume/
│   │   ├── resume-container.tsx          (NEW)
│   │   ├── resume-header.tsx             (NEW)
│   │   ├── professional-summary.tsx      (NEW)
│   │   ├── technical-skills.tsx          (REDESIGN)
│   │   ├── experience-timeline.tsx       (REDESIGN)
│   │   ├── project-list-item.tsx         (REDESIGN)
│   │   ├── education-cert-list.tsx       (REDESIGN)
│   │   ├── achievement-metrics.tsx       (NEW)
│   │   └── resume-navigation.tsx         (NEW)
│   │
│   └── pdf/
│       └── pdf-export-button.tsx         (NEW)
│
└── ui/
    ├── skill-badge.tsx                   (NEW)
    ├── timeline-connector.tsx            (NEW)
    ├── metric-card.tsx                   (UPDATE)
    └── section-divider.tsx               (NEW)
```

### Components to Update

```
src/sections/
├── header.tsx              → resume-header.tsx
├── technologies.tsx        → technical-skills.tsx
├── experiences.tsx         (major redesign)
├── projects.tsx            (major redesign)
├── certifications.tsx      → education-certifications.tsx
└── main.tsx                (layout update)
```

---

## 🎨 Design System

### Spacing Scale
```css
--space-xs: 0.5rem;   /* 8px */
--space-sm: 1rem;     /* 16px */
--space-md: 1.5rem;   /* 24px */
--space-lg: 2rem;     /* 32px */
--space-xl: 3rem;     /* 48px */
```

### Resume Section Spacing
```css
.resume-section {
  padding: var(--space-lg) 0;
  border-bottom: 1px solid var(--resume-border);
}

.resume-section-header {
  margin-bottom: var(--space-md);
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## 📊 Success Metrics

### Key Performance Indicators (KPIs)

**User Experience**:
- [ ] Time to first impression < 1s
- [ ] Time to read full resume < 3 min
- [ ] Easy to find contact info (< 5s)
- [ ] Clear next action (apply, contact, download)

**Technical Metrics**:
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 100
- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3s

**Content Quality**:
- [ ] All experience bullets have metrics
- [ ] Professional tone throughout
- [ ] No spelling/grammar errors
- [ ] ATS-friendly format

---

## 🗓️ Timeline Summary

| Phase | Duration | Focus | Deliverables |
|-------|----------|-------|--------------|
| **Phase 1** | Week 1 | Layout Foundation | Resume container, header, summary |
| **Phase 2** | Week 1-2 | Skills | Categorized skill badges |
| **Phase 3** | Week 2 | Experience | Timeline with achievements |
| **Phase 4** | Week 2-3 | Projects | Compact project listings |
| **Phase 5** | Week 3 | Education | Education & certifications |
| **Phase 6** | Week 3 | Stats | Achievement metrics |
| **Phase 7** | Week 4 | Polish | Typography, colors, print |
| **Phase 8** | Week 4-5 | Interactive | PDF export, navigation |
| **Phase 9** | Week 5 | Content | Content optimization |
| **Phase 10** | Week 5-6 | Final | Performance, A11y, SEO |

**Total Duration**: 5-6 weeks  
**Recommended Approach**: 1-2 phases per week

---

## 🚦 Implementation Checklist

### Pre-Development
- [ ] Review current design with stakeholders
- [ ] Gather all content (bio, achievements, metrics)
- [ ] Create design mockups (optional)
- [ ] Set up feature branch: `feature/resume-redesign`

### Phase 1-6: Development
- [ ] Follow phase-by-phase implementation
- [ ] Test each component as you build
- [ ] Commit after each phase completion
- [ ] Keep main branch stable

### Quality Assurance
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness testing
- [ ] Print layout testing
- [ ] Accessibility audit (WAVE, axe DevTools)
- [ ] Performance testing (Lighthouse)
- [ ] Content review (spelling, grammar, tone)

### Deployment
- [ ] Merge to main branch
- [ ] Deploy via CI/CD pipeline
- [ ] Monitor for errors
- [ ] Gather user feedback

---

## 📝 Content Guidelines

### Professional Tone
**Do's**:
- Use action verbs (Developed, Led, Implemented, Achieved)
- Include metrics and numbers
- Be specific about technologies
- Highlight outcomes and impact

**Don'ts**:
- Avoid casual language ("cool project", "fun stuff")
- Don't use first person excessively
- Avoid vague descriptions
- Don't include irrelevant information

### Achievement Bullet Format
```
[Action Verb] + [What You Did] + [Result/Metric]

Examples:
✅ Developed microservices architecture reducing API response time by 40%
✅ Led team of 5 developers delivering 15+ features on schedule
✅ Implemented CI/CD pipeline increasing deployment frequency by 300%
```

---

## 🔧 Technical Considerations

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Optimization
- Touch targets: min 44x44px
- Font size: min 16px (body text)
- Viewport meta tag configured
- No horizontal scrolling

### Print Optimization
- A4 paper size (210mm × 297mm)
- Margins: 15mm
- Black & white friendly
- No page breaks in sections

---

## 🎯 Next Steps

### Immediate Actions
1. **Review this plan** with team/stakeholders
2. **Gather content** (bio, achievements, metrics)
3. **Create feature branch**: `git checkout -b feature/resume-redesign`
4. **Start Phase 1**: Resume container and header

### Week 1 Goals
- [ ] Complete Phase 1 (Foundation)
- [ ] Start Phase 2 (Skills)
- [ ] Set up component structure

### Communication
- **Daily**: Commit progress with clear messages
- **Weekly**: Review completed phases
- **Blockers**: Document and seek help immediately

---

## 📚 Resources

### Design Inspiration
- [Standard Resume](https://standardresume.co/examples)
- [FlowCV](https://flowcv.com/resume-templates)
- [Reactive Resume](https://rxresu.me/)

### Technical Resources
- [React PDF Renderer](https://react-pdf.org/)
- [Tailwind Resume Templates](https://tailwindcomponents.com/components/resumes)
- [Print CSS Guide](https://www.smashingmagazine.com/2015/01/designing-for-print-with-css/)

### Typography
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [Roboto Font](https://fonts.google.com/specimen/Roboto)
- [Type Scale](https://typescale.com/)

---

## 🎉 Expected Outcomes

**After Transformation**:
✅ Professional, resume-style portfolio  
✅ Easy to scan and read  
✅ Highlights experience and achievements  
✅ Print-friendly design  
✅ PDF export functionality  
✅ Mobile-optimized  
✅ ATS-friendly content  
✅ High performance (90+ Lighthouse)  
✅ Fully accessible (WCAG AA)  

**Value Proposition**:
> "A modern, interactive tech resume that works as both a website and a downloadable PDF, showcasing experience, skills, and achievements in a professional, scannable format."

---

**Status**: 📋 Planning Complete - Ready for Implementation  
**Last Updated**: January 19, 2026  
**Version**: 2.0 (Enhanced with Technical Details)  
**Document Owner**: Portfolio Transformation Team

---

## 📊 PROGRESS TRACKING & IMPLEMENTATION CHECKLIST

> **This section tracks actual implementation progress. Update as you complete each task.**

### Overall Progress
```
Phase 1: Foundation & Layout        ✅✅✅✅✅ 5/5   (100%) 🎉
Phase 2: Technical Skills           ⬜⬜⬜⬜   0/4   (0%)
Phase 3: Experience Timeline        ⬜⬜⬜⬜⬜ 0/5   (0%)
Phase 4: Project Portfolio          ⬜⬜⬜⬜   0/4   (0%)
Phase 5: Education & Certifications ⬜⬜⬜     0/3   (0%)
Phase 6: Stats & Achievements       ⬜⬜⬜     0/3   (0%)
Phase 7: UI/UX Polish               ⬜⬜⬜⬜   0/4   (0%)
Phase 8: Interactive Features       ⬜⬜⬜     0/3   (0%)
Phase 9: Content Optimization       ⬜⬜       0/2   (0%)
Phase 10: Performance & A11y        ⬜⬜⬜     0/3   (0%)
─────────────────────────────────────────────────
TOTAL PROGRESS:                     ✅✅✅✅✅⬜⬜⬜⬜⬜ 5/36 (14%)
```

### Implementation Log

#### 📅 Session 1: January 29, 2025
**Tasks Completed**: 
- ✅ Phase 1.1 - Resume Container Component created and tested
- ✅ Testing infrastructure setup (Vitest + React Testing Library)
- ✅ 14/14 tests passing
- ✅ All validation checks passed (ESLint, TypeScript, Build)

**Time Spent**: ~2 hours  
**Blockers**: None  
**Next Session**: Phase 1.2 - Resume Header

#### 📅 Session 2: January 29, 2025
**Tasks Completed**: 
- ✅ Phase 1.2 - Resume Header component created and tested
- ✅ 22 comprehensive tests written and passing (total: 36/36)
- ✅ profile.json data file created
- ✅ CoreService updated with getProfile() method
- ✅ useCore hook extended with queryProfile()
- ✅ All validation passed (ESLint, TypeScript, Tests, Build)

**Time Spent**: ~2.5 hours  
**Blockers**: None  
**Next Session**: Phase 1.3 - Professional Summary

#### 📅 Session 3: January 29, 2025
**Tasks Completed**: 
- ✅ Phase 1.3 - Professional Summary component created and tested
- ✅ 24 comprehensive tests written and passing (total: 60/60)
- ✅ Framer Motion entrance animation implemented
- ✅ HeroUI Chip components for highlight badges
- ✅ Responsive flex layout with gap and alignment
- ✅ All validation passed (ESLint, TypeScript, Tests, Build)

**Time Spent**: ~1.5 hours  
**Blockers**: None  
**Next Session**: Phase 1.4/1.5 - Preview Integration

#### 📅 Session 4: January 29, 2025
**Tasks Completed**: 
- ✅ Phase 1.5 - Resume Preview Integration page created
- ✅ TanStack Router file-based routing configured
- ✅ 19 integration tests written and passing (total: 79/79)
- ✅ Data flow validated (profile.json → CoreService → useCore → components)
- ✅ Loading and error states implemented
- ✅ All validations passed (ESLint, TypeScript, Tests, Build)
- ✅ routeTree.gen.ts regenerated with /resume-preview route

**Time Spent**: ~1 hour  
**Blockers**: None  
**Next Session**: Phase 2.1 - Technical Skills Component

---

### Phase Completion Checklist

#### ✅ PHASE 1: Foundation & Layout (COMPLETED 🎉)
- [x] 1.1 Resume Container Component created ✅
- [x] 1.2 Resume Header redesigned ✅
- [x] 1.3 Professional Summary section created ✅
- [x] 1.4 globals.css updated with resume styles ✅
- [x] 1.5 Resume Preview integration page created ✅

**Status**: ✅ COMPLETE (5/5 tasks - 100%)  
**Completion Date**: Started Jan 29, 2025 - Completed Jan 29, 2025  
**Notes**: 
- Resume Container: Compound component pattern with print-friendly classes
- Resume Header: Compact professional header with contact info, social links, and download button
- Professional Summary: 2-3 line summary with highlight chips (years, projects, technologies)
- Resume Preview: Integration route with TanStack Router, full data flow validation
- All tests passing (79/79) - 100% pass rate maintained
- Phase 1 complete in 4 sessions (~7 hours total)

---

#### ✅ PHASE 2: Technical Skills
- [ ] 2.1 TechnicalSkills component created
- [ ] 2.2 technologies.json updated with proficiency data
- [ ] 2.3 CoreService updated with getTechnologiesByCategory
- [ ] 2.4 Skill progress bars implemented

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Complete  
**Completion Date**: [DATE]  
**Notes**: 

---

#### ✅ PHASE 3: Professional Experience
- [ ] 3.1 Experience timeline layout created
- [ ] 3.2 experiences.json updated with achievements
- [ ] 3.3 Related projects linking implemented
- [ ] 3.4 Expandable project previews added
- [ ] 3.5 Timeline animations implemented

**Status**: ⬜ Not Started | ⏳ In Progress | ✅ Complete  
**Completion Date**: [DATE]  
**Notes**: 

---

### Files Created/Modified Tracker

#### New Files Created:
- [x] `src/components/features/resume/resume-container.tsx` ✅
- [x] `src/components/features/resume/resume-container.test.tsx` ✅
- [x] `src/components/features/resume/resume-header.tsx` ✅
- [x] `src/components/features/resume/resume-header.test.tsx` ✅
- [x] `src/components/features/resume/professional-summary.tsx` ✅
- [x] `src/components/features/resume/professional-summary.test.tsx` ✅
- [x] `src/routes/resume-preview.tsx` ✅
- [x] `src/components/features/resume/resume-preview.test.tsx` ✅
- [x] `vitest.config.ts` ✅
- [x] `src/test/setup.ts` ✅
- [x] `src/test/jest-dom.d.ts` ✅
- [x] `src/assets/portfolio-resources/data/profile.json` ✅
- [ ] `src/sections/technical-skills.tsx`
- [ ] `src/styles/print.css`

**Total New Files**: 12/30+

#### Files Modified:
- [x] `src/globals.css` (resume styles added) ✅
- [x] `package.json` (test scripts added) ✅
- [x] `src/services/core/service.ts` (getProfile method) ✅
- [x] `src/services/core/types.ts` (Profile, ContactInfo types) ✅
- [x] `src/services/core/interface.ts` (ICoreService.getProfile) ✅
- [x] `src/hooks/use-core.ts` (queryProfile hook) ✅
- [ ] `tailwind.config.js` (resume theme extension)
- [ ] `src/routes/index.tsx` (new layout structure)
- [ ] `src/assets/portfolio-resources/data/experiences.json`
- [ ] `src/assets/portfolio-resources/data/technologies.json`

**Total Modified Files**: 6/15+

---

### Technical Debt & Issues

#### 🐛 Bugs Found:
1. [None yet]

#### ⚠️ Known Issues:
1. [None yet]

#### 💡 Improvement Ideas:
1. Consider adding export to LinkedIn format
2. Add keyboard shortcuts for navigation
3. Implement dark mode toggle persistence

---

### Performance Metrics

#### Before Redesign:
- Lighthouse Performance: [TBD]
- First Contentful Paint: [TBD]
- Time to Interactive: [TBD]
- Bundle Size: [TBD]

#### After Redesign (Target):
- Lighthouse Performance: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle Size: < 500KB (gzipped)

#### Actual After Redesign:
- Lighthouse Performance: [TBD]
- First Contentful Paint: [TBD]
- Time to Interactive: [TBD]
- Bundle Size: [TBD]

---

### Git Branch Strategy

**Main Branch**: `main` (production)  
**Feature Branch**: `feature/resume-redesign`  
**Sub-branches**:
- `feature/resume-redesign-phase-1`
- `feature/resume-redesign-phase-2`
- `feature/resume-redesign-phase-3`
- etc.

**Commit Message Format**:
```
feat(resume): [Phase X.Y] Brief description

- Detailed change 1
- Detailed change 2

Closes #[issue-number]
```

**Example**:
```bash
git checkout -b feature/resume-redesign
git commit -m "feat(resume): [Phase 1.1] Add Resume Container component

- Create ResumeContainer with max-width 1000px
- Add ResumeSection wrapper with padding
- Implement ResumeSectionHeader with accent underline
- Add print-friendly CSS classes

Closes #123"
```

---

### Testing Checklist

#### Functional Testing:
- [ ] All sections render correctly
- [ ] Navigation works smoothly
- [ ] PDF export generates correctly
- [ ] All links are functional
- [ ] Forms submit successfully

#### Responsive Testing:
- [ ] Desktop (1920px, 1440px, 1280px)
- [ ] Laptop (1024px)
- [ ] Tablet (768px, 834px)
- [ ] Mobile (375px, 414px, 390px)
- [ ] Large screens (2560px+)

#### Browser Testing:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### Print Testing:
- [ ] A4 portrait layout
- [ ] US Letter layout
- [ ] Black & white printing
- [ ] Page breaks appropriate
- [ ] No interactive elements showing

#### Accessibility Testing:
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast WCAG AA
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] ARIA labels present

---

### Deployment Checklist

**Pre-Deployment**:
- [ ] Run `npm run lint` (no errors)
- [ ] Run `npm run build` (successful)
- [ ] Run `npm run test` (all tests pass)
- [ ] Run Lighthouse audit (90+ score)
- [ ] Test on multiple devices
- [ ] Verify all content is accurate
- [ ] Check all external links
- [ ] Test PDF export functionality
- [ ] Review print layout

**Deployment**:
- [ ] Merge feature branch to main
- [ ] Create version tag (v3.0.0)
- [ ] Deploy to production (Vercel)
- [ ] Verify production site
- [ ] Monitor for errors (24 hours)

**Post-Deployment**:
- [ ] Update documentation
- [ ] Share with stakeholders
- [ ] Gather user feedback
- [ ] Monitor analytics
- [ ] Address any reported issues

---

## 🧪 AUTOMATED TESTING STRATEGY

> **Critical**: All components must have automated tests to ensure quality and prevent regressions.

### Testing Framework Setup

**Install Testing Dependencies**:
```bash
# Install Vitest (fast Vite-native test runner)
npm install -D vitest @vitest/ui

# Install React Testing Library
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Install Happy DOM (lightweight DOM for tests)
npm install -D happy-dom

# Install accessibility testing
npm install -D @axe-core/react vitest-axe
```

**Vitest Configuration** (`vitest.config.ts`):
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        'src/main.tsx',
        'src/vite-env.d.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

**Test Setup File** (`src/test/setup.ts`):
```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

**Update package.json scripts**:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

---

### Unit Tests for Each Phase

#### Phase 1.1: Resume Container Tests

**File**: `src/components/features/resume/resume-container.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Resume } from './resume-container';

describe('ResumeContainer', () => {
  it('should render children correctly', () => {
    render(
      <Resume.Container>
        <div>Test Content</div>
      </Resume.Container>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should have max-width constraint', () => {
    const { container } = render(
      <Resume.Container>
        <div>Test</div>
      </Resume.Container>
    );
    const resumeDiv = container.firstChild as HTMLElement;
    expect(resumeDiv).toHaveClass('max-w-[1000px]');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Resume.Container className="custom-class">
        <div>Test</div>
      </Resume.Container>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have print-friendly class on sections', () => {
    const { container } = render(
      <Resume.Section>
        <div>Section Content</div>
      </Resume.Section>
    );
    expect(container.firstChild).toHaveClass('page-break-inside-avoid');
  });
});

describe('ResumeSection', () => {
  it('should render with border by default', () => {
    const { container } = render(
      <Resume.Section>Content</Resume.Section>
    );
    expect(container.firstChild).toHaveClass('border-b');
  });

  it('should render without border when noBorder is true', () => {
    const { container } = render(
      <Resume.Section noBorder>Content</Resume.Section>
    );
    expect(container.firstChild).not.toHaveClass('border-b');
  });

  it('should render with id attribute', () => {
    render(<Resume.Section id="test-section">Content</Resume.Section>);
    expect(screen.getByText('Content').closest('section')).toHaveAttribute('id', 'test-section');
  });
});

describe('ResumeSectionHeader', () => {
  it('should render header text', () => {
    render(<Resume.Header>Test Header</Resume.Header>);
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('should have uppercase styling', () => {
    const { container } = render(<Resume.Header>Test</Resume.Header>);
    expect(container.firstChild).toHaveClass('uppercase');
  });

  it('should have accent underline (::after)', () => {
    const { container } = render(<Resume.Header>Test</Resume.Header>);
    const header = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(header, '::after');
    // Note: pseudo-element testing is limited in jsdom
    expect(header).toHaveClass('after:bg-resume-accent');
  });
});
```

#### Phase 1.2: Resume Header Tests

**File**: `src/sections/resume-header.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResumeHeader } from './resume-header';

const mockContactInfo = {
  email: 'test@example.com',
  phone: '+1234567890',
  location: 'San Francisco, CA',
  github: 'https://github.com/testuser',
  linkedin: 'https://linkedin.com/in/testuser'
};

describe('ResumeHeader', () => {
  it('should render name and title', () => {
    render(
      <ResumeHeader
        name="John Doe"
        title="Full Stack Developer"
        contact={mockContactInfo}
      />
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
  });

  it('should render all contact information', () => {
    render(
      <ResumeHeader
        name="John Doe"
        title="Developer"
        contact={mockContactInfo}
      />
    );
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
  });

  it('should have clickable email link', () => {
    render(
      <ResumeHeader
        name="John Doe"
        title="Developer"
        contact={mockContactInfo}
      />
    );
    const emailLink = screen.getByText('test@example.com').closest('a');
    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
  });

  it('should have clickable phone link', () => {
    render(
      <ResumeHeader
        name="John Doe"
        title="Developer"
        contact={mockContactInfo}
      />
    );
    const phoneLink = screen.getByText('+1234567890').closest('a');
    expect(phoneLink).toHaveAttribute('href', 'tel:+1234567890');
  });

  it('should render social links with correct attributes', () => {
    render(
      <ResumeHeader
        name="John Doe"
        title="Developer"
        contact={mockContactInfo}
      />
    );
    const githubLink = screen.getByLabelText('GitHub Profile');
    const linkedinLink = screen.getByLabelText('LinkedIn Profile');
    
    expect(githubLink).toHaveAttribute('href', mockContactInfo.github);
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('href', mockContactInfo.linkedin);
  });

  it('should call onDownloadPDF when button clicked', async () => {
    const mockDownload = vi.fn();
    const user = userEvent.setup();
    
    render(
      <ResumeHeader
        name="John Doe"
        title="Developer"
        contact={mockContactInfo}
        onDownloadPDF={mockDownload}
      />
    );
    
    const downloadButton = screen.getByText('Download Resume');
    await user.click(downloadButton);
    
    expect(mockDownload).toHaveBeenCalledTimes(1);
  });

  it('should have no-print class on interactive elements', () => {
    render(
      <ResumeHeader
        name="John Doe"
        title="Developer"
        contact={mockContactInfo}
      />
    );
    const downloadButton = screen.getByText('Download Resume').closest('div');
    expect(downloadButton).toHaveClass('no-print');
  });
});
```

#### Phase 1.3: Professional Summary Tests

**File**: `src/sections/professional-summary.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfessionalSummary } from './professional-summary';

const mockHighlights = {
  yearsExperience: 5,
  projectsCompleted: 25,
  primaryTechnologies: ['React', 'TypeScript', 'Node.js']
};

describe('ProfessionalSummary', () => {
  it('should render summary text', () => {
    render(
      <ProfessionalSummary
        summary="Passionate developer with experience"
        highlights={mockHighlights}
      />
    );
    expect(screen.getByText(/Passionate developer/)).toBeInTheDocument();
  });

  it('should render years experience chip', () => {
    render(
      <ProfessionalSummary
        summary="Test summary"
        highlights={mockHighlights}
      />
    );
    expect(screen.getByText('5+ Years Experience')).toBeInTheDocument();
  });

  it('should render projects completed chip', () => {
    render(
      <ProfessionalSummary
        summary="Test summary"
        highlights={mockHighlights}
      />
    );
    expect(screen.getByText('25+ Projects Delivered')).toBeInTheDocument();
  });

  it('should render all primary technologies', () => {
    render(
      <ProfessionalSummary
        summary="Test summary"
        highlights={mockHighlights}
      />
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('should have proper section structure', () => {
    render(
      <ProfessionalSummary
        summary="Test summary"
        highlights={mockHighlights}
      />
    );
    expect(screen.getByText('Professional Summary')).toBeInTheDocument();
  });
});
```

#### Phase 2: Technical Skills Tests

**File**: `src/sections/technical-skills.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { TechnicalSkills } from './technical-skills';

const mockSkills = [
  {
    category: 'Languages',
    technologies: [
      {
        name: 'TypeScript',
        proficiency: 8,
        yearsExperience: 5,
        level: 'Advanced' as const
      },
      {
        name: 'JavaScript',
        proficiency: 7,
        yearsExperience: 6,
        level: 'Advanced' as const
      }
    ]
  },
  {
    category: 'Frameworks',
    technologies: [
      {
        name: 'React',
        proficiency: 9,
        yearsExperience: 5,
        level: 'Expert' as const
      }
    ]
  }
];

describe('TechnicalSkills', () => {
  it('should render all skill categories', () => {
    render(<TechnicalSkills skills={mockSkills} />);
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Frameworks')).toBeInTheDocument();
  });

  it('should render all technologies', () => {
    render(<TechnicalSkills skills={mockSkills} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('should display proficiency levels', () => {
    render(<TechnicalSkills skills={mockSkills} />);
    expect(screen.getByText('8/10')).toBeInTheDocument();
    expect(screen.getByText('7/10')).toBeInTheDocument();
    expect(screen.getByText('9/10')).toBeInTheDocument();
  });

  it('should display skill level badges', () => {
    render(<TechnicalSkills skills={mockSkills} />);
    expect(screen.getAllByText('Advanced')).toHaveLength(2);
    expect(screen.getByText('Expert')).toBeInTheDocument();
  });

  it('should display years of experience', () => {
    render(<TechnicalSkills skills={mockSkills} />);
    expect(screen.getByText('5 years experience')).toBeInTheDocument();
    expect(screen.getByText('6 years experience')).toBeInTheDocument();
  });

  it('should have progress bars with correct values', () => {
    render(<TechnicalSkills skills={mockSkills} />);
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
  });
});
```

---

### Automated Testing Workflow

#### Test-Driven Development (TDD) Process

```
1. Write Test First (RED)
   └─> npm run test -- resume-container.test.tsx
   └─> Test fails (expected - component doesn't exist)

2. Write Minimal Code (GREEN)
   └─> Create component to pass test
   └─> npm run test -- resume-container.test.tsx
   └─> Test passes

3. Refactor (REFACTOR)
   └─> Improve code quality
   └─> npm run test
   └─> All tests still pass

4. Repeat for each component
```

#### Continuous Testing During Development

```bash
# Run tests in watch mode (auto-rerun on file changes)
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (for CI/CD)
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

#### Pre-Commit Testing Hook

**Install Husky** (Git hooks):
```bash
npm install -D husky lint-staged

# Initialize husky
npx husky init
```

**Configure** (`.husky/pre-commit`):
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged
npx lint-staged
```

**Configure lint-staged** (`package.json`):
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "vitest related --run"
    ]
  }
}
```

---

### Automated Quality Checks

#### ESLint + TypeScript Checking

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# TypeScript type checking
npx tsc --noEmit
```

#### Accessibility Testing

**Install axe**:
```bash
npm install -D @axe-core/react vitest-axe
```

**Add to tests**:
```typescript
import { axe, toHaveNoViolations } from 'vitest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<ResumeHeader {...props} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

### Issue Detection & Auto-Fix Workflow

#### Automated Issue Detection

**Create test script** (`scripts/validate-all.ts`):
```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ValidationResult {
  task: string;
  passed: boolean;
  error?: string;
}

async function runValidation(): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  
  // 1. ESLint
  try {
    await execAsync('npm run lint');
    results.push({ task: 'ESLint', passed: true });
  } catch (error) {
    results.push({ task: 'ESLint', passed: false, error: String(error) });
  }
  
  // 2. TypeScript
  try {
    await execAsync('npx tsc --noEmit');
    results.push({ task: 'TypeScript', passed: true });
  } catch (error) {
    results.push({ task: 'TypeScript', passed: false, error: String(error) });
  }
  
  // 3. Tests
  try {
    await execAsync('npm run test:run');
    results.push({ task: 'Unit Tests', passed: true });
  } catch (error) {
    results.push({ task: 'Unit Tests', passed: false, error: String(error) });
  }
  
  // 4. Build
  try {
    await execAsync('npm run build');
    results.push({ task: 'Build', passed: true });
  } catch (error) {
    results.push({ task: 'Build', passed: false, error: String(error) });
  }
  
  return results;
}

// Run validation
runValidation().then((results) => {
  console.log('\n📊 Validation Results:\n');
  results.forEach(({ task, passed, error }) => {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${task}`);
    if (error) {
      console.log(`   Error: ${error}\n`);
    }
  });
  
  const allPassed = results.every(r => r.passed);
  process.exit(allPassed ? 0 : 1);
});
```

**Run validation**:
```bash
npx tsx scripts/validate-all.ts
```

#### Auto-Fix Common Issues

```bash
# Fix ESLint issues
npm run lint -- --fix

# Fix Prettier formatting
npx prettier --write "src/**/*.{ts,tsx,css}"

# Fix import organization
npx organize-imports-cli tsconfig.json

# Run all fixes
npm run lint -- --fix && npx prettier --write "src/**/*.{ts,tsx,css}"
```

---

### Testing Progress Tracker

#### Test Coverage Requirements

```
Component Tests:      100% of components
Integration Tests:    All user flows
Accessibility Tests:  All interactive elements
Performance Tests:    Critical paths
```

#### Current Test Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html  # Mac/Linux
start coverage/index.html # Windows
```

**Coverage Goals**:
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

#### Test Status Tracking

```
Phase 1.1: Resume Container
├─ Component Tests     ⬜ 0/5 tests written
├─ Integration Tests   ⬜ 0/2 tests written
└─ A11y Tests          ⬜ 0/1 tests written

Phase 1.2: Resume Header
├─ Component Tests     ⬜ 0/8 tests written
├─ Integration Tests   ⬜ 0/3 tests written
└─ A11y Tests          ⬜ 0/2 tests written

Phase 1.3: Professional Summary
├─ Component Tests     ⬜ 0/5 tests written
└─ A11y Tests          ⬜ 0/1 tests written

Phase 2: Technical Skills
├─ Component Tests     ⬜ 0/6 tests written
├─ Integration Tests   ⬜ 0/2 tests written
└─ A11y Tests          ⬜ 0/1 tests written

Phase 3: Professional Experience
├─ Component Tests     ⬜ 0/8 tests written
├─ Integration Tests   ⬜ 0/3 tests written
└─ A11y Tests          ⬜ 0/2 tests written
```

---

### Repeat Until Complete Process

#### Step-by-Step Workflow

```
1. ✅ PLAN
   └─ Review phase requirements in this document
   └─ Write test cases FIRST

2. ✅ WRITE TESTS
   └─ npm run test (watch mode)
   └─ Tests fail (expected)

3. ✅ IMPLEMENT
   └─ Write component code
   └─ Tests turn green

4. ❌ CHECK FOR ERRORS
   └─ npm run lint
   └─ npx tsc --noEmit
   └─ npm run test:run
   
   IF ERRORS FOUND:
   └─ Fix errors
   └─ Return to step 4 (repeat)
   
   IF NO ERRORS:
   └─ Continue to step 5

5. ✅ REFACTOR
   └─ Improve code quality
   └─ Ensure tests still pass

6. ✅ COMMIT
   └─ Git commit with descriptive message
   └─ Update progress in this document

7. ✅ NEXT PHASE
   └─ Return to step 1 for next component
```

#### Error Resolution Checklist

**When Error Occurs**:
```
1. Read error message carefully
2. Identify error type:
   ├─ TypeScript error?    → Fix types
   ├─ ESLint error?        → Fix code style
   ├─ Test failure?        → Fix implementation
   └─ Build error?         → Check imports/dependencies

3. Apply fix

4. Re-run validation:
   npm run lint && npx tsc --noEmit && npm run test:run

5. If still failing → Return to step 1
   If passing → Update this document

6. Commit fix with message:
   "fix(resume): [Phase X.Y] Fix [error description]"
```

---

### Quick Reference Commands

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview

# Format code
npx prettier --write .

# Create new branch
git checkout -b feature/resume-redesign-phase-1

# Commit changes
git add .
git commit -m "feat(resume): [Phase X.Y] Description"

# Push to remote
git push origin feature/resume-redesign-phase-1

# Check bundle size
npm run build && npx vite-bundle-visualizer
```

---

### Component Inventory (Quick Reference)

```
src/
├── components/features/resume/
│   ├── resume-container.tsx          [Phase 1.1]
│   ├── skill-badge.tsx               [Phase 2]
│   └── timeline-connector.tsx        [Phase 3]
├── sections/
│   ├── resume-header.tsx             [Phase 1.2]
│   ├── professional-summary.tsx      [Phase 1.3]
│   ├── technical-skills.tsx          [Phase 2]
│   ├── professional-experience.tsx   [Phase 3]
│   ├── project-portfolio.tsx         [Phase 4]
│   ├── education-certifications.tsx  [Phase 5]
│   └── achievements-stats.tsx        [Phase 6]
├── styles/
│   └── print.css                     [Phase 7]
└── assets/portfolio-resources/data/
    └── profile.json                  [Phase 1.3]
```

---

## 🎯 NEXT IMMEDIATE ACTIONS

**Today**:
1. ✅ Review this planning document
2. ⬜ Set up feature branch: `git checkout -b feature/resume-redesign`
3. ⬜ Start Phase 1.1: Create Resume Container component
4. ⬜ Commit first changes

**This Week**:
1. Complete Phase 1 (Foundation & Layout)
2. Start Phase 2 (Technical Skills)
3. Update this document with progress

**End Goal**:
Transform portfolio from project-focused to resume-focused professional presentation in 5-6 weeks.

---

**🚀 Ready to start implementation!**  
**First task**: Phase 1.1 - Create Resume Container Component (2 hours estimated)

---

## 🎯 NEXT STEP PROMPT & EXECUTION GUIDE

> **Copy this prompt to continue implementation step-by-step**

### 🚀 IMMEDIATE NEXT STEP: Start Phase 1.1

**Command to execute**:
```
I'm ready to implement Phase 1.1 from the RESUME_REDESIGN_PLAN.md document.

Please follow this process:

1. READ the Phase 1.1 requirements from C:\Users\ADMIN\Desktop\PP Namias\Portfolio\.github\RESUME_REDESIGN_PLAN.md

2. SETUP testing infrastructure first:
   - Install Vitest and testing dependencies
   - Create vitest.config.ts
   - Create src/test/setup.ts
   - Update package.json scripts

3. WRITE TESTS FIRST (TDD):
   - Create src/components/features/resume/resume-container.test.tsx
   - Write all test cases from the testing section
   - Run tests (they should fail - that's expected)

4. IMPLEMENT the component:
   - Create src/components/features/resume/resume-container.tsx
   - Write code to pass all tests
   - Run tests until all pass

5. VALIDATE:
   - Run npm run lint (fix any issues)
   - Run npx tsc --noEmit (fix any type errors)
   - Run npm run test:run (ensure all tests pass)
   - Run npm run build (ensure build succeeds)

6. IF ERRORS FOUND:
   - Fix the errors
   - Re-run validation (step 5)
   - Repeat until all checks pass

7. UPDATE PROGRESS:
   - Update C:\Users\ADMIN\Desktop\PP Namias\Portfolio\.github\RESUME_REDESIGN_PLAN.md
   - Mark Phase 1.1 as complete ✅
   - Update test coverage tracker
   - Update files created tracker
   - Add implementation log entry with date and time

8. COMMIT:
   - Git add changes
   - Commit with: "feat(resume): [Phase 1.1] Add Resume Container component with tests"

9. SHOW ME:
   - Summary of what was completed
   - Test results (passed/failed)
   - Any issues encountered and how they were fixed
   - Updated progress from RESUME_REDESIGN_PLAN.md

10. SUGGEST NEXT STEP:
    - Tell me we're ready for Phase 1.2
    - Provide the next prompt to continue

IMPORTANT RULES:
- Test-driven development: Write tests FIRST, then implementation
- Fix ALL errors before moving forward
- Update the single RESUME_REDESIGN_PLAN.md document with progress
- Do NOT create new documentation files
- Run full validation after every phase
- Commit after each completed phase
```

---

### 📋 Subsequent Steps Prompt Template

**After completing Phase 1.1, use this prompt**:

```
Phase 1.1 is complete! Now implement Phase [X.Y] from RESUME_REDESIGN_PLAN.md.

Follow the same process:
1. Read Phase [X.Y] requirements
2. Write tests first (TDD)
3. Implement component
4. Validate (lint, typecheck, test, build)
5. Fix any errors (repeat validation until clean)
6. Update progress in RESUME_REDESIGN_PLAN.md
7. Commit changes
8. Show summary and suggest next step

File to update: C:\Users\ADMIN\Desktop\PP Namias\Portfolio\.github\RESUME_REDESIGN_PLAN.md
```

---

### 🔄 Validation Loop Command

**When errors are found, use this**:

```
I found errors in the implementation. Please fix them following this process:

1. READ the error messages carefully
2. IDENTIFY error type (TypeScript, ESLint, test failure, build error)
3. FIX the specific error in the code
4. RUN validation again:
   - npm run lint
   - npx tsc --noEmit
   - npm run test:run
   - npm run build
5. IF still failing → return to step 1
6. IF passing → update RESUME_REDESIGN_PLAN.md with fix details
7. Show me what was fixed and current status

Keep repeating until ALL validations pass.
```

---

### 🎯 Full Phase Completion Prompt

**After completing a full phase (e.g., all of Phase 1)**:

```
Phase [X] is complete! Let's review and move to the next phase.

1. REVIEW what was completed:
   - List all components created
   - Show test coverage
   - Confirm all validations pass

2. UPDATE RESUME_REDESIGN_PLAN.md:
   - Mark entire Phase [X] as ✅ Complete
   - Update overall progress bar
   - Add completion date
   - Update performance metrics if applicable

3. FINAL VALIDATION:
   - npm run lint
   - npx tsc --noEmit
   - npm run test:coverage (show coverage report)
   - npm run build

4. COMMIT:
   - Git commit -m "feat(resume): Complete Phase [X] - [Brief description]"

5. NEXT PHASE READINESS:
   - Review Phase [X+1] requirements
   - Identify dependencies
   - Estimate time
   - Suggest starting Phase [X+1]

Show me updated progress and ask if ready to start Phase [X+1].
```

---

### 🚨 Emergency Debugging Prompt

**When stuck on an error**:

```
I'm stuck on an error. Please help debug:

ERROR: [paste error message]

FILE: [file path]

CONTEXT: [what were you trying to do]

Please:
1. Analyze the error
2. Explain what's causing it
3. Provide the exact fix
4. Update the code
5. Re-run validation
6. Confirm it's fixed

If error persists after fix, repeat the process.
Document the solution in RESUME_REDESIGN_PLAN.md under "Technical Debt & Issues" section.
```

---

### 📊 Progress Check Prompt

**To check current status**:

```
Show me the current progress of the resume redesign project.

Read C:\Users\ADMIN\Desktop\PP Namias\Portfolio\.github\RESUME_REDESIGN_PLAN.md and show me:

1. Overall progress percentage
2. Completed phases (✅)
3. Current phase (⏳)
4. Upcoming phases (⬜)
5. Test coverage stats
6. Files created/modified count
7. Known issues or blockers
8. Estimated time remaining

Then suggest what to work on next.
```

---

### 🎨 Implementation Best Practices Reminder

**Keep this in mind during implementation**:

```
BEST PRACTICES CHECKLIST:

✅ Test-Driven Development (TDD)
   - Write tests FIRST
   - Watch them fail
   - Write minimal code to pass
   - Refactor

✅ TypeScript Strict Mode
   - No 'any' types
   - Proper interfaces
   - Full type coverage

✅ Accessibility First
   - ARIA labels on interactive elements
   - Keyboard navigation support
   - Color contrast WCAG AA
   - Screen reader testing

✅ Performance
   - Lazy load below-fold content
   - Optimize images
   - Code splitting
   - Monitor bundle size

✅ Responsive Design
   - Mobile-first approach
   - Test all breakpoints
   - Touch-friendly targets (44x44px min)

✅ Print Optimization
   - Hide interactive elements
   - Optimize for A4 paper
   - Proper page breaks
   - Black & white friendly

✅ Documentation
   - Update RESUME_REDESIGN_PLAN.md progress
   - Document decisions
   - Track issues and fixes
```

---

### 🏁 Final Deployment Prompt

**When all phases are complete**:

```
All 10 phases are complete! Ready for final deployment.

Please execute final checklist:

1. FINAL TESTING:
   - Run full test suite: npm run test:coverage
   - Verify > 80% coverage
   - Run Lighthouse audit (target 90+)
   - Test on all devices/browsers
   - Test print functionality
   - Test PDF export

2. FINAL VALIDATION:
   - npm run lint (must pass)
   - npx tsc --noEmit (must pass)
   - npm run build (must succeed)
   - Verify production bundle size

3. UPDATE DOCUMENTATION:
   - Mark all phases ✅ Complete in RESUME_REDESIGN_PLAN.md
   - Update "After Redesign" metrics
   - Add final completion date
   - Update version to v3.0.0

4. GIT & DEPLOYMENT:
   - Create final commit
   - Merge to main branch
   - Create git tag v3.0.0
   - Deploy to production (Vercel)
   - Monitor for 24 hours

5. POST-DEPLOYMENT:
   - Verify production site
   - Share with stakeholders
   - Gather initial feedback
   - Monitor analytics

Show me final summary with before/after comparisons.
```

---

## 📖 Quick Command Reference

```bash
# Development
npm run dev              # Start dev server
npm run test             # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run lint             # Check code quality
npx tsc --noEmit        # Type check

# Validation
npm run lint && npx tsc --noEmit && npm run test:run && npm run build

# Coverage
npm run test:coverage    # Generate coverage report
open coverage/index.html # View coverage (Mac/Linux)
start coverage/index.html # View coverage (Windows)

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Git
git checkout -b feature/resume-redesign-phase-X
git add .
git commit -m "feat(resume): [Phase X.Y] Description"
git push origin feature/resume-redesign-phase-X
```

---

## 🎯 SUCCESS CRITERIA

**Project is complete when**:

- [ ] All 10 phases marked ✅ Complete
- [ ] All tests passing (100% of written tests)
- [ ] Test coverage > 80%
- [ ] ESLint: 0 errors, 0 warnings
- [ ] TypeScript: 0 type errors
- [ ] Build: Successful
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 100
- [ ] All devices tested
- [ ] Print layout tested
- [ ] PDF export working
- [ ] Deployed to production
- [ ] Stakeholder approval

**Current Status**: 🟡 Ready to Start Phase 1.1

---

**END OF DOCUMENT**  
**Last Updated**: January 19, 2026 - Enhanced with Testing Strategy & Next Step Prompts  
**Version**: 2.1  
**Total Lines**: [Auto-calculated]  
**Ready for Implementation**: ✅ YES

---

## 🚀 START HERE:

**Copy and paste this to begin**:
```
I'm ready to start the resume redesign! Please begin with Phase 1.1 from C:\Users\ADMIN\Desktop\PP Namias\Portfolio\.github\RESUME_REDESIGN_PLAN.md. Follow the TDD process: setup tests → write tests → implement component → validate → fix errors → update progress → commit. Show me each step and ask before proceeding to the next phase.
```
