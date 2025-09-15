# 🚀 PP Namias Portfolio - Next.js 15 with Bryl Lim Inspired Design

A modern, minimalist portfolio website inspired by Bryl Lim's design aesthetic, built with Next.js 15, TypeScript, and Tailwind CSS. Features AI integration, dark/light theme switching, and comprehensive professional showcase.

![Portfolio Preview](https://via.placeholder.com/800x400/0a0a0a/4ade80?text=PP+Namias+Portfolio)

## ✨ Features

### 🎨 Design & UI
- **Bryl Lim Inspired Design** - Minimalist resume-style layout
- **Dark Theme Default** - Professional dark theme with light mode toggle
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Smooth Animations** - Framer Motion powered interactions
- **Professional Typography** - Inter font family with consistent hierarchy

### 🛠️ Technical Stack
- **Next.js 15** - Latest with App Router and Turbopack
- **TypeScript** - Full type safety and development experience
- **Tailwind CSS v4** - Modern utility-first styling with CSS variables
- **Framer Motion** - Advanced animations and interactions
- **Lucide React** - Beautiful, consistent iconography

### 📱 Sections & Components
- **Professional Header** - Profile image, achievement badges, dual CTAs
- **About Section** - Personal summary with metrics and specializations
- **Tech Stack** - Interactive expandable categories with proficiency levels
- **Experience Timeline** - Detailed work history with achievements
- **Beyond Coding** - Personal interests and philosophy
- **Enhanced Projects** - Featured projects with thumbnails and metrics
- **Recent Certifications** - Professional credentials with verification
- **Blog Posts** - Recent articles and thought leadership
- **Contact Section** - Multiple contact methods with availability status

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

### Local Development

```bash
# Clone the repository
git clone https://github.com/PP-Namias/portfolio.git
cd portfolio/portfolio-redesign

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Or export static files
npm run build && npm run export
```

## 🌐 Vercel Deployment

### Automatic Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Portfolio website ready for deployment"
   git push origin main
   ```

2. **Deploy with Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration
   - Click "Deploy" - your site will be live in minutes!

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Follow the prompts:
# ? Set up and deploy "portfolio-redesign"? [Y/n] y
# ? Which scope? Your Personal Account
# ? Link to existing project? [y/N] n
# ? What's your project's name? pp-namias-portfolio
# ? In which directory is your code located? ./

# Production deployment
vercel --prod
```

### Environment Variables (Optional)

Create `.env.local` for any API keys or configuration:

```env
# Example environment variables
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 📁 Project Structure

```
portfolio-redesign/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── globals.css          # Global styles with CSS variables
│   │   ├── layout.tsx           # Root layout with theme provider
│   │   └── page.tsx             # Main page with all sections
│   ├── components/
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx       # Professional header with navigation
│   │   │   ├── TwoColumnLayout.tsx  # Bryl Lim style layout
│   │   │   └── Footer.tsx       # Comprehensive footer
│   │   ├── sections/            # Page sections
│   │   │   ├── AboutSection.tsx
│   │   │   ├── TechStackSection.tsx
│   │   │   ├── ExperienceTimeline.tsx
│   │   │   ├── BeyondCodingSection.tsx
│   │   │   ├── EnhancedProjectsSection.tsx
│   │   │   ├── CertificationsSection.tsx
│   │   │   ├── RecentBlogPostsSection.tsx
│   │   │   └── ContactSection.tsx
│   │   └── ui/                  # Reusable UI components
│   │       └── ThemeToggle.tsx
│   ├── data/                    # Content data
│   │   ├── personal.ts          # Personal information
│   │   ├── experience.ts        # Work experience
│   │   └── techStack.ts         # Technologies and skills
│   ├── hooks/                   # Custom React hooks
│   │   └── useTheme.ts          # Theme management
│   └── types/                   # TypeScript type definitions
├── public/                      # Static assets
│   ├── profile.jpeg             # Profile image
│   └── resume.pdf               # Downloadable resume
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── next.config.ts              # Next.js configuration
```

## 🎨 Customization

### Update Personal Information

Edit `src/data/personal.ts`:

```typescript
export const personalInfo: PersonalInfo = {
  profile: {
    name: "Your Name",
    title: "Your Title",
    location: "Your Location",
    email: "your@email.com",
    image: "/your-profile.jpg"
  },
  // ... rest of your information
};
```

### Modify Theme Colors

Update `src/app/globals.css`:

```css
[data-theme='dark'] {
  --color-bg-primary: #0a0a0a;
  --color-accent: #4ade80;      /* Change accent color */
  /* ... other color variables */
}
```

### Add New Sections

1. Create component in `src/components/sections/`
2. Export from the section
3. Import and add to `src/app/page.tsx`

## 🔧 Performance Optimizations

### Already Implemented
- **Next.js 15** with Turbopack for fast development
- **Image Optimization** with Next.js Image component
- **Font Optimization** with Google Fonts preloading
- **CSS Variables** for efficient theming
- **Code Splitting** automatic with Next.js
- **SEO Optimization** with proper meta tags

### Recommended Vercel Settings
- **Analytics** - Enable Vercel Analytics
- **Speed Insights** - Monitor Core Web Vitals
- **Edge Functions** - For global performance
- **Image Optimization** - Automatic with Vercel

## 📊 Lighthouse Scores

Target Performance Metrics:
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🔒 Security & Best Practices

- **TypeScript** for type safety
- **ESLint** for code quality
- **Environment Variables** for sensitive data
- **HTTPS** automatic with Vercel
- **CSP Headers** configured for security

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile** iOS 14+, Android 10+

## 🚀 Live Demo

Visit the live website: [pp-namias.vercel.app](https://pp-namias.vercel.app)

## 📞 Support & Contact

- **Email**: contact@ppnamias.dev
- **LinkedIn**: [PP Namias](https://linkedin.com/in/pp-namias)
- **GitHub**: [@PP-Namias](https://github.com/PP-Namias)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS**

*Inspired by Bryl Lim's minimalist design aesthetic*
