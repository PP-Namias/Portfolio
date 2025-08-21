# 🤖 AI Prompt for Portfolio Website Development

## 🎯 Comprehensive AI Development Prompt

Use this prompt when working with AI assistants to continue developing the minimalist resume-style portfolio website:

---

### **Primary Development Context**

```
I'm developing a modern, minimalist resume-style portfolio website inspired by Bryl Lim's design aesthetic using Next.js 15 with TypeScript. The website is for PP Namias, a full-stack software engineer.

CURRENT SETUP:
- Next.js 15 with TypeScript and Tailwind CSS v4
- Dark theme as default with smooth light/dark mode switching
- Modern component architecture with organized folder structure
- Framer Motion for animations, Lucide React for icons
- CSS variables for consistent theming across components
- Mobile-first responsive design approach

COMPLETED COMPONENTS:
✅ useTheme hook with dark mode default
✅ ThemeToggle component with smooth icon transitions
✅ Header component with navigation and backdrop blur
✅ HeroSection with typing animation and professional presentation
✅ Basic page layout with placeholder sections

DESIGN SYSTEM:
- Colors: Dark theme (#0a0a0a bg, #4ade80 accent) / Light theme (#ffffff bg, #3b82f6 accent)
- Typography: Inter font family with consistent heading scale
- Components: .card, .btn-primary, .btn-secondary, .badge classes
- Animations: Smooth hover effects, scale transforms, backdrop blur

PROJECT STRUCTURE:
portfolio-redesign/src/
├── app/ (Next.js app router)
├── components/layout/ (Header, Footer)
├── components/sections/ (HeroSection, AboutSection, etc.)
├── components/ui/ (ThemeToggle, Button, Card, etc.)
├── hooks/ (useTheme, useScrollAnimation)
├── lib/ (utilities, constants)
├── data/ (experience, projects, skills)
└── types/ (TypeScript definitions)

DEVELOPMENT SERVER:
Running at http://localhost:3000 with Turbopack

IMMEDIATE GOALS:
I need help with [SPECIFIC TASK HERE]
```

---

## 🛠️ Specific Task Prompts

### **For Content Integration:**
```
Help me create the following data files and components:

1. src/data/experience.ts - Professional work experience with:
   - Company information and logos
   - Role titles and durations
   - Key achievements with metrics
   - Technology stacks used

2. src/components/sections/ExperienceSection.tsx - Timeline component with:
   - Vertical timeline layout
   - Hover effects on experience cards
   - Expandable achievement details
   - Technology badge display

Use the existing design system with CSS variables (var(--color-*)) and maintain the minimalist aesthetic. Include Framer Motion animations for scroll-triggered reveals.
```

### **For Skills Section:**
```
Create a modern skills grid system:

1. src/data/skills.ts - Categorized skills data structure
2. src/components/sections/SkillsSection.tsx - Interactive skills display

Requirements:
- Group skills by categories (Frontend, Backend, DevOps, etc.)
- Interactive hover effects with proficiency indicators
- Stagger animations for skill badges
- Filter functionality by category
- Use Lucide React icons for categories
- Maintain the existing .badge styling with hover transforms
```

### **For Projects Showcase:**
```
Build a portfolio projects section:

1. src/data/projects.ts - Project information with images, tech stacks, links
2. src/components/sections/ProjectsSection.tsx - Grid layout with filtering

Features needed:
- Masonry/grid layout with responsive design
- Project category filtering (Web App, Mobile, API, etc.)
- Hover effects with image overlays
- Live demo and GitHub repository links
- Technology stack badges
- Featured project highlighting
- Modal or detailed view for project descriptions
```

### **For Contact Section:**
```
Implement a professional contact section:

1. src/components/sections/ContactSection.tsx with:
   - Contact form using react-hook-form and zod validation
   - Professional contact information display
   - Social media links with hover animations
   - Availability status indicator
   - Email/phone call-to-action buttons

2. Form requirements:
   - Name, email, subject, message fields
   - Form validation with error handling
   - Success/loading states
   - Consistent styling with design system
   - Mobile-friendly layout
```

### **For Performance Optimization:**
```
Optimize the website for production:

1. Image optimization using Next.js Image component
2. Code splitting and lazy loading for sections
3. SEO optimization with proper meta tags and structured data
4. Accessibility improvements (WCAG 2.1 compliance)
5. Performance monitoring setup

Target metrics:
- Lighthouse score 95+ across all categories
- First Contentful Paint < 1.2 seconds
- Largest Contentful Paint < 2.0 seconds
- Time to Interactive < 2.5 seconds

Maintain the existing CSS variable system and component architecture.
```

---

## 🎨 Design Consistency Guidelines

### **Visual Design Principles:**
```
When creating new components, follow these principles:

1. MINIMALIST AESTHETIC:
   - Clean typography with Inter font family
   - Generous white space usage
   - Subtle shadows and rounded corners (12px radius)
   - Consistent color usage with CSS variables

2. PROFESSIONAL PRESENTATION:
   - Resume-style information layout
   - Card-based section organization
   - Clear visual hierarchy with heading classes
   - Professional color palette (dark/light themes)

3. INTERACTIVE ELEMENTS:
   - Smooth hover effects with scale transforms
   - 200-300ms transition duration
   - Backdrop blur effects where appropriate
   - Micro-animations for user feedback

4. RESPONSIVE DESIGN:
   - Mobile-first approach with proper breakpoints
   - Touch-friendly interface (44px minimum touch targets)
   - Readable typography across all devices
   - Consistent spacing with Tailwind utilities
```

### **Component Development Standards:**
```
For all new components:

1. Use TypeScript with proper interface definitions
2. Implement CSS variables for theming: var(--color-*)
3. Include Framer Motion animations where appropriate
4. Follow the existing .card, .btn-*, .badge styling patterns
5. Ensure mobile responsiveness and accessibility
6. Use Lucide React icons consistently
7. Include hover states and loading states
8. Add proper ARIA labels and semantic HTML
```

---

## 🚀 Advanced Feature Requests

### **Animation System Enhancement:**
```
Enhance the website with advanced animations:

1. Scroll-triggered animations using Framer Motion and useInView
2. Stagger animations for lists and grids
3. Page transition animations
4. Loading state animations
5. Micro-interactions for buttons and cards

Requirements:
- Smooth 60fps animations
- Respect user's reduced motion preferences
- Performance-optimized with proper cleanup
- Consistent timing and easing curves
```

### **Blog Integration:**
```
Add a blog section to showcase technical writing:

1. Integration with the existing Sanity CMS setup
2. Blog post listing with pagination
3. Individual blog post pages with proper SEO
4. Related posts suggestions
5. Reading time estimates
6. Tag/category filtering

Maintain the minimalist design aesthetic and ensure fast loading times.
```

### **Advanced Contact Features:**
```
Enhance the contact functionality:

1. Email service integration (EmailJS or similar)
2. Calendar booking integration for consultations
3. Real-time form validation
4. Auto-response system
5. Contact analytics tracking
6. Spam protection

Ensure all features maintain the professional appearance and user experience.
```

---

## 📋 Quality Assurance Checklist

### **Before Deployment:**
```
Ensure the website meets these standards:

PERFORMANCE:
□ Lighthouse score 95+ across all categories
□ Images optimized and properly sized
□ Code splitting implemented
□ Minimal bundle size

ACCESSIBILITY:
□ Proper heading hierarchy (h1, h2, h3)
□ ARIA labels for interactive elements
□ Keyboard navigation support
□ Color contrast ratios meet WCAG standards
□ Screen reader compatibility

SEO:
□ Meta tags properly configured
□ Structured data implemented
□ Sitemap generated
□ Open Graph tags for social sharing
□ Proper URL structure

CROSS-BROWSER:
□ Chrome, Firefox, Safari, Edge compatibility
□ Mobile device testing
□ Different screen size validation
□ Touch interaction testing

FUNCTIONALITY:
□ Theme toggle works correctly
□ Navigation smooth scrolling
□ Forms validate and submit properly
□ All links functional
□ Contact information accurate
```

---

## 🎯 Content Guidelines

### **Professional Tone:**
```
All content should maintain:

1. Professional but approachable language
2. Clear, concise descriptions
3. Achievement-focused wording with metrics
4. Technical accuracy in skill descriptions
5. Action-oriented call-to-actions

Examples:
- "Reduced load times by 40% through performance optimization"
- "Led development of scalable React applications serving 10,000+ users"
- "Specialized in full-stack development with modern web technologies"
```

### **Personal Branding:**
```
Ensure consistent branding:

1. Professional headshot or working environment photos
2. Consistent name presentation: "PP Namias"
3. Unified professional title: "Full-Stack Software Engineer"
4. Location: "Manila, Philippines"
5. Availability status: "Available for projects"
6. Professional email and contact information
```

This comprehensive prompt system ensures consistent development direction and maintains the high-quality, professional standard established in the initial implementation.
