# 🚀 Kenneth Namias Portfolio  
![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue) 
[![CI/CD Pipeline](https://github.com/PP-Namias/Portfolio/actions/workflows/ci-cd-pipeline.yml/badge.svg)](https://github.com/PP-Namias/Portfolio/actions/workflows/ci-cd-pipeline.yml)
[![Code Quality](https://github.com/PP-Namias/Portfolio/actions/workflows/quality-check.yml/badge.svg)](https://github.com/PP-Namias/Portfolio/actions/workflows/quality-check.yml)
[![Daily Health Check](https://github.com/PP-Namias/Portfolio/actions/workflows/daily-health-check.yml/badge.svg)](https://github.com/PP-Namias/Portfolio/actions/workflows/daily-health-check.yml)
[![Speed Insights](https://img.shields.io/badge/Vercel-Speed_Insights-black?logo=vercel)](https://vercel.com/analytics)

**Full Stack Developer & AI Automation Specialist Portfolio** - A modern, optimized portfolio built with [Astro](https://astro.build) featuring comprehensive CI/CD automation and content optimization.

[**🖥️ Live Portfolio**](https://ppnamias.vercel.app)

![Portfolio Preview](https://ppnamias.vercel.app/og-image.png)

## � Portfolio Highlights

**Professional Full Stack Developer** specializing in:
- **AI & Automation Solutions** - Custom AI agents and intelligent workflow automation
- **Enterprise Applications** - HRIS systems, insurance portals, and business tools  
- **Modern Web Development** - React, TypeScript, Node.js, and cutting-edge frameworks
- **Educational Technology** - Innovative solutions for academic institutions

## 📊 Content Organization

This portfolio features a **fully optimized content taxonomy system** with:

### **Blog Categories (4)**
- **📖 Technical** - Development tutorials and guides
- **🚀 Projects** - Case studies and project showcases  
- **💼 Career** - Professional journey and experiences
- **👤 Personal** - Background and personal stories

### **Project Categories (4)** 
- **🌐 Web Development** - Full-stack applications and dashboards
- **🤖 AI & Automation** - AI agents and automation tools
- **🏢 Enterprise Solutions** - Business applications and tools
- **🎨 Design & Creative** - UI/UX and visual design work

### **Standardized Tag System (25 Tags)**
- **Technology Tags**: React, TypeScript, Node.js, AI/ML, DevOps, Full-Stack
- **Topic Tags**: Tutorial, Case-Study, Best-Practices, Enterprise, Education  
- **Industry Tags**: FinTech, E-Commerce, Gaming, Productivity, SaaS

## 🚀 CI/CD Automation Features

- [x] **Automated Code Quality Checks** - Biome linting, formatting, and import sorting
- [x] **Continuous Integration** - Automated testing and building on every commit
- [x] **Deployment Automation** - Automatic deployment to production on main branch
- [x] **Performance Monitoring** - Vercel Speed Insights integration
- [x] **Error Tracking & Logging** - Comprehensive error handling with GitHub issue creation
- [x] **Security Auditing** - Automated dependency vulnerability scanning
- [x] **Daily Health Checks** - Scheduled system health monitoring
- [x] **Dependency Management** - Weekly automated dependency updates
- [x] **Content Validation** - Automated taxonomy compliance checking

## ✨ Features

- [x] Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- [x] **100% Content Taxonomy Compliance** - Professionally organized content system
- [x] **Performance Optimized** - Speed Insights monitoring and optimization
- [x] Smooth animations and page transitions
- [x] Light / dark mode with theme customization
- [x] Responsive design for all devices
- [x] Advanced search functionality with [Pagefind](https://pagefind.app/)
- [x] [Markdown extended features](#-markdown-extended-syntax)
- [x] Table of contents and RSS feed
- [x] Professional portfolio showcase

## 📁 Project Structure

```
Portfolio/
├── src/
│   ├── content/
│   │   ├── posts/           # Blog posts (12 files, 100% compliant)
│   │   ├── projects/        # Project showcases (10 files, 100% compliant)
│   │   └── gallery/         # Visual portfolio
│   ├── components/          # Reusable Astro/Svelte components
│   ├── layouts/             # Page layouts
│   ├── pages/               # Route pages
│   └── styles/              # Global styles
├── validate-taxonomy.js     # Content validation tool
├── migrate-taxonomy.js      # Content migration tool
└── CONTENT_MIGRATION_MASTER_PLAN.md  # Content optimization guide
```

## 🚀 Getting Started

### **Option 1: Use This Portfolio as Template**
1. **Fork or Clone**: [Generate a new repository](https://github.com/PP-Namias/Portfolio/generate) from this template
2. **Install Dependencies**: Run `pnpm install` (install [pnpm](https://pnpm.io) with `npm install -g pnpm`)
3. **Customize**: Edit `src/config.ts` to personalize your portfolio
4. **Content Creation**: Use `pnpm new-post <filename>` to create posts in `src/content/posts/`
5. **Deploy**: Deploy to Vercel, Netlify, or GitHub Pages following [Astro deployment guides](https://docs.astro.build/en/guides/deploy/)

### **Option 2: Start Fresh with Fuwari**
If you prefer the original template:
```sh
npm create fuwari@latest
# or
yarn create fuwari
pnpm create fuwari@latest
bun create fuwari@latest
```

## 📊 Content Management

This portfolio includes professional content management tools:

### **Validation System**
```bash
node validate-taxonomy.js    # Check content compliance (Current: 100% ✅)
```

### **Migration Tools**  
```bash
node migrate-taxonomy.js     # Apply content optimization patterns
```

### **Content Guidelines**
- **Categories**: Use only approved categories (4 blog, 4 project categories)
- **Tags**: 2-5 tags per content piece from standardized list (25 total)
- **Structure**: Follow professional taxonomy for discoverability

## 📝 Content Frontmatter

### **Blog Posts**
```yaml
---
title: "Your Blog Post Title"
published: 2024-09-19
description: "Brief description of your post"
image: "./cover.jpg"
tags: ["Full-Stack", "Tutorial", "Best-Practices"]  # 2-5 approved tags
category: "Technical"  # Technical | Projects | Career | Personal
draft: false
---
```

### **Projects**  
```yaml
---
title: "Your Project Name"
description: "Project description"
published: 2024-09-19
featured: true
image: "./cover.jpg" 
tags: ["React", "TypeScript", "Case-Study"]  # 2-5 approved tags
category: "Web Development"  # Web Development | AI & Automation | Enterprise Solutions | Design & Creative
technologies: ["React", "Node.js", "PostgreSQL"]
demoUrl: "https://demo.example.com"
codeUrl: "https://github.com/username/project"
---
```

## 🧩 Markdown Extended Syntax

This portfolio supports enhanced Markdown features:

- **Admonitions** - Callout boxes for tips, warnings, and notes ([Preview and Usage](https://ppnamias.vercel.app/archive/markdown-extended/#admonitions))
- **GitHub Repository Cards** - Embed repository information ([Preview and Usage](https://ppnamias.vercel.app/archive/markdown-extended/#github-repository-cards))  
- **Enhanced Code Blocks** - Syntax highlighting with Expressive Code ([Preview](https://ppnamias.vercel.app/archive/expressive-code/) / [Docs](https://expressive-code.com/))
- **Math Equations** - KaTeX support for mathematical expressions
- **Table of Contents** - Automatic TOC generation

## ⚡ Development Commands

| Command                    | Action                                              |
|:---------------------------|:----------------------------------------------------|
| `pnpm install`             | Install dependencies                               |
| `pnpm dev`                 | Start local dev server at `localhost:4321`        |
| `pnpm build`               | Build production site to `./dist/`                |
| `pnpm preview`             | Preview build locally before deploying            |
| `pnpm check`               | Run code quality checks                           |
| `pnpm format`              | Format code using Biome                           |
| `pnpm new-post <filename>` | Create new blog post                              |
| `node validate-taxonomy.js`| Validate content taxonomy compliance             |
| `node migrate-taxonomy.js` | Apply content optimization patterns              |
| `pnpm astro ...`           | Run Astro CLI commands                            |

## 📈 Performance & Analytics

- **Vercel Speed Insights** - Real-time performance monitoring
- **Lighthouse Optimization** - SEO and performance best practices
- **Responsive Design** - Mobile-first approach
- **Fast Loading** - Optimized images and code splitting
- **Search Engine Optimized** - Structured data and meta tags

## 🎯 Professional Features

### **Content Management**
- ✅ **100% Taxonomy Compliance** - Validated content organization
- ✅ **Professional Categories** - Logical content structure  
- ✅ **Standardized Tags** - Consistent, discoverable keywords
- ✅ **Quality Validation** - Automated content compliance checking

### **Development Excellence**
- ✅ **CI/CD Pipeline** - Automated testing and deployment
- ✅ **Code Quality** - Biome linting and formatting
- ✅ **Security Scanning** - Automated vulnerability checks
- ✅ **Performance Monitoring** - Speed insights and optimization

## ✏️ Contributing

Interested in contributing to this portfolio template? Check out the [Contributing Guide](https://github.com/PP-Namias/Portfolio/blob/main/CONTRIBUTING.md) for details.

## 🙏 Acknowledgments

This portfolio is built upon the excellent [Fuwari](https://github.com/saicaca/fuwari) template by [saicaca](https://github.com/saicaca). Special thanks for creating such a solid foundation for modern portfolio websites.

## � Contact

**Kenneth Namias**  
Full Stack Developer & AI Automation Specialist

- 🌐 **Portfolio**: [ppnamias.vercel.app](https://ppnamias.vercel.app)
- 💼 **LinkedIn**: [Connect with me](https://linkedin.com/in/kenneth-namias)
- 📧 **Email**: [Contact](mailto:contact@ppnamias.vercel.app)
- 🔗 **GitHub**: [@PP-Namias](https://github.com/PP-Namias)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Kenneth Namias**  
*Transforming ideas into digital solutions*
