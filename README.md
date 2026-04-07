# Cloud-Native Portfolio

A modern, production-ready portfolio website built with cloud-native technologies and deployed on AWS. This project demonstrates end-to-end cloud development practices — from building in a cloud IDE to hosting static assets on S3 and deploying via AWS Amplify.

## Live Reference

This portfolio is inspired by [bryllim.com](https://bryllim.com/), a clean and professional developer portfolio by Bryl Lim. The design follows the same minimalist aesthetic, two-column layout, dark/light theme support, and content-first approach that makes the original so effective. All code is original; the design principles and information architecture serve as the creative reference.

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) | Server-side rendering, static generation, routing |
| Language | [TypeScript](https://www.typescriptlang.org/) | Type safety and developer experience |
| Styling | [Tailwind CSS v3](https://tailwindcss.com/) | Utility-first styling with custom design tokens |
| Animations | [Framer Motion](https://www.framer.com/motion/) | Smooth page transitions and scroll-based effects |
| Icons | [Lucide React](https://lucide.dev/) | Consistent, tree-shakeable icon library |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) | Dark/light mode with system preference detection |
| Development | [GitHub Codespaces](https://github.com/features/codespaces) | Cloud-based development environment |
| Static Assets | [AWS S3](https://aws.amazon.com/s3/) | Scalable object storage for images and documents |
| Hosting | [AWS Amplify](https://aws.amazon.com/amplify/) | Serverless deployment with CI/CD pipeline |
| Monitoring | [AWS CloudWatch](https://aws.amazon.com/cloudwatch/) | Logging, metrics, and operational visibility |

## AWS Services Used

### Amazon S3 (Simple Storage Service)
Hosts all static assets including the profile photo, gallery images, and downloadable resume PDF. The bucket is configured with a public-read policy and CORS headers to allow cross-origin requests from the Amplify-hosted frontend.

### AWS Amplify Hosting
Provides fully managed hosting with automatic CI/CD. Every push to the `main` branch triggers a build and deployment pipeline. Amplify auto-detects the Next.js framework, handles server-side rendering, and serves the application through a global CDN with free SSL.

### Amazon CloudWatch
Integrated automatically with Amplify for build logs, access logs, and performance metrics. Provides operational visibility into the deployed application without additional configuration.

## Project Structure

```
cloud-native-portfolio/
├── .devcontainer/           # GitHub Codespaces configuration
│   └── devcontainer.json
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── blog/            # Blog listing and individual post pages
│   │   ├── layout.tsx       # Root layout with theme provider
│   │   ├── page.tsx         # Home page
│   │   ├── providers.tsx    # Theme provider wrapper
│   │   └── globals.css      # Global styles and CSS variables
│   ├── components/
│   │   ├── layout/          # Header, Footer layout components
│   │   ├── sections/        # Page sections (Hero, About, Projects, etc.)
│   │   └── ui/              # Reusable UI components (Button, Card, Badge)
│   ├── data/                # Content data files (profile, experience, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript type definitions
├── public/                  # Static public files
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Features

- **Responsive Design** — Fully responsive across desktop, tablet, and mobile devices
- **Dark / Light Mode** — Theme toggle with system preference detection, defaults to dark
- **Card-Based Layout** — Clean sections wrapped in bordered cards for visual hierarchy
- **Two-Column Layout** — Main content alongside a sticky sidebar on desktop
- **Blog Section** — Dedicated blog with article pages, navigation, and tag system
- **Gallery Slider** — Paginated image gallery with navigation arrows (5 images per slide)
- **Experience Timeline** — Interactive timeline with hover-fill checkbox indicators
- **Recommendations Carousel** — Auto-advancing testimonial slider with pagination dots
- **Smooth Animations** — Scroll-triggered fade-ins and hover effects via Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ (or use GitHub Codespaces — no local setup required)
- npm or yarn
- AWS account (free tier) for S3 and Amplify deployment

### Local Development

```bash
# Clone the repository
git clone https://github.com/pabilandokarenpv/cloud-native-portfolio.git
cd cloud-native-portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Using GitHub Codespaces

1. Click the green **Code** button on the repository page
2. Select the **Codespaces** tab
3. Click **Create codespace on main**
4. The environment will be ready in under 2 minutes with all dependencies installed

## Deployment

### AWS Amplify

1. Push your code to GitHub
2. Open the [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
3. Click **Host web app** → Select **GitHub** → Authorize and select this repository
4. Amplify auto-detects Next.js and configures the build settings
5. Click **Save and deploy**

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_S3_BUCKET_URL` | Base URL of your S3 bucket for static assets |

## Free Tier Coverage

This entire project runs within AWS Free Tier limits:

| Service | Free Allowance | Our Usage |
|---------|---------------|-----------|
| GitHub Codespaces | 120 core-hours/month | ~30-40 hours |
| AWS S3 | 5 GB storage, 20K GET/month | ~100 MB |
| AWS Amplify | 1,000 build min, 15 GB served/month | ~15 builds |
| AWS CloudWatch | 5 GB logs, 10 metrics | Basic logs |

## Design Reference

This project draws design inspiration from [bryllim.com](https://bryllim.com/) by Bryl Lim — a software engineer and content creator from the Philippines. The original portfolio exemplifies modern developer portfolio design with its clean minimalist aesthetic, professional typography, smart two-column information architecture, and subtle animations. We follow the same design principles while keeping all implementation code original.

## Documentation Map

- [Contributing Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Support](SUPPORT.md)
- [Publication Plan](docs/REPO_PUBLICATION_PLAN.md)
- [Branch Protection Blueprint](docs/BRANCH_PROTECTION_RULESET.md)
- [Reference Index](docs/REFERENCE_INDEX.md)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
