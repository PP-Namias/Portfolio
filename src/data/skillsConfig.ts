// src/data/skillsConfig.ts
export interface SkillData {
	name: string;
	level: number;
	category: SkillCategory;
	icon: string;
	experience: string;
	projects: string[];
	certifications?: string[];
	description?: string;
	trending?: boolean;
	learningPath?: string[];
	lastUpdated?: string;
}

export type SkillCategory =
	| "frontend"
	| "backend"
	| "ai"
	| "devops"
	| "database"
	| "tools";

export const skillCategories = {
	frontend: {
		title: "Frontend Development",
		description: "User interface and experience technologies",
		color: "from-blue-500 to-purple-600",
		icon: "material-symbols:web",
	},
	backend: {
		title: "Backend Development",
		description: "Server-side technologies and APIs",
		color: "from-green-500 to-blue-600",
		icon: "material-symbols:storage",
	},
	ai: {
		title: "AI & Machine Learning",
		description: "Artificial intelligence and automation",
		color: "from-purple-500 to-pink-600",
		icon: "material-symbols:psychology",
	},
	devops: {
		title: "DevOps & Infrastructure",
		description: "Deployment, monitoring, and automation",
		color: "from-orange-500 to-red-600",
		icon: "material-symbols:settings",
	},
	database: {
		title: "Database & Storage",
		description: "Data management and storage solutions",
		color: "from-teal-500 to-cyan-600",
		icon: "material-symbols:database",
	},
	tools: {
		title: "Tools & Productivity",
		description: "Development tools and workflow optimization",
		color: "from-gray-500 to-slate-600",
		icon: "material-symbols:build",
	},
};

// Enhanced skills database with comprehensive information
export const skillsDatabase: Record<SkillCategory, SkillData[]> = {
	frontend: [
		{
			name: "React.js",
			level: 95,
			category: "frontend",
			icon: "fa6-brands:react",
			experience: "4+ years",
			projects: [
				"Enterprise HRIS System",
				"E-commerce Platform",
				"Real-time Dashboard",
				"Component Library",
			],
			description:
				"Expert in React ecosystem with advanced hooks, context, performance optimization, and testing strategies",
			trending: true,
			learningPath: [
				"JavaScript ES6+",
				"React Hooks",
				"Redux Toolkit",
				"React Query",
				"Testing Library",
			],
			lastUpdated: "2024-09-01",
		},
		{
			name: "TypeScript",
			level: 92,
			category: "frontend",
			icon: "simple-icons:typescript",
			experience: "3+ years",
			projects: [
				"Type-safe APIs",
				"Enterprise Applications",
				"Component Libraries",
				"Node.js Services",
			],
			description:
				"Advanced TypeScript with generics, utility types, design patterns, and enterprise-grade type safety",
			trending: true,
			learningPath: [
				"JavaScript",
				"Static Typing",
				"Advanced Types",
				"Decorators",
				"Compiler API",
			],
			lastUpdated: "2024-08-15",
		},
		{
			name: "Next.js",
			level: 88,
			category: "frontend",
			icon: "simple-icons:nextdotjs",
			experience: "2+ years",
			projects: [
				"SSR Applications",
				"JAMstack Sites",
				"API Routes",
				"E-commerce Platform",
			],
			description:
				"Full-stack React framework with SSR/SSG, API routes, performance optimization, and deployment",
			trending: true,
			learningPath: [
				"React",
				"SSR/SSG",
				"API Routes",
				"Deployment",
				"Performance",
			],
			lastUpdated: "2024-08-20",
		},
		{
			name: "Tailwind CSS",
			level: 90,
			category: "frontend",
			icon: "simple-icons:tailwindcss",
			experience: "3+ years",
			projects: [
				"Responsive Designs",
				"Component Systems",
				"Custom Themes",
				"Design Systems",
			],
			description:
				"Utility-first CSS framework for rapid, responsive UI development with custom design systems",
			learningPath: [
				"CSS Fundamentals",
				"Responsive Design",
				"Component Design",
				"Custom Configurations",
			],
			lastUpdated: "2024-07-10",
		},
		{
			name: "Svelte",
			level: 78,
			category: "frontend",
			icon: "simple-icons:svelte",
			experience: "1+ years",
			projects: [
				"Interactive Components",
				"Portfolio Features",
				"Animation Libraries",
			],
			description:
				"Modern frontend framework with compile-time optimizations and reactive programming",
			trending: true,
			learningPath: [
				"JavaScript",
				"Reactive Programming",
				"SvelteKit",
				"Animations",
			],
			lastUpdated: "2024-06-15",
		},
		{
			name: "Astro",
			level: 82,
			category: "frontend",
			icon: "simple-icons:astro",
			experience: "1+ years",
			projects: [
				"Portfolio Website",
				"Static Sites",
				"Multi-framework Integration",
			],
			description:
				"Modern static site generator with island architecture and framework agnostic approach",
			trending: true,
			learningPath: [
				"Static Site Generation",
				"Island Architecture",
				"Performance",
				"SEO",
			],
			lastUpdated: "2024-08-01",
		},
	],

	backend: [
		{
			name: "Node.js",
			level: 90,
			category: "backend",
			icon: "fa6-brands:node-js",
			experience: "4+ years",
			projects: [
				"REST APIs",
				"Microservices",
				"Real-time Applications",
				"Enterprise Systems",
			],
			description:
				"Scalable server-side applications with Express, performance optimization, and security best practices",
			learningPath: [
				"JavaScript",
				"Express.js",
				"Async Programming",
				"Performance",
				"Security",
			],
			lastUpdated: "2024-08-10",
		},
		{
			name: "Python",
			level: 85,
			category: "backend",
			icon: "fa6-brands:python",
			experience: "3+ years",
			projects: [
				"AI/ML Models",
				"Data Processing",
				"Automation Scripts",
				"API Development",
			],
			description:
				"Backend development, data science, automation, and AI integration with modern frameworks",
			learningPath: [
				"Python Basics",
				"FastAPI/Django",
				"Data Science",
				"Machine Learning",
				"Automation",
			],
			lastUpdated: "2024-07-20",
		},
		{
			name: "Express.js",
			level: 88,
			category: "backend",
			icon: "simple-icons:express",
			experience: "4+ years",
			projects: [
				"REST APIs",
				"Authentication Systems",
				"Middleware Development",
				"API Gateways",
			],
			description:
				"Fast, minimalist web framework with advanced middleware, routing, and API development",
			learningPath: [
				"Node.js",
				"HTTP/HTTPS",
				"Middleware",
				"Authentication",
				"Testing",
			],
			lastUpdated: "2024-08-05",
		},
		{
			name: "GraphQL",
			level: 75,
			category: "backend",
			icon: "simple-icons:graphql",
			experience: "2+ years",
			projects: ["API Development", "Schema Design", "Real-time Subscriptions"],
			description:
				"Query language and runtime for APIs with efficient data fetching and type safety",
			learningPath: [
				"REST APIs",
				"Schema Design",
				"Resolvers",
				"Subscriptions",
				"Performance",
			],
			lastUpdated: "2024-06-20",
		},
	],

	ai: [
		{
			name: "OpenAI API",
			level: 88,
			category: "ai",
			icon: "simple-icons:openai",
			experience: "2+ years",
			projects: [
				"AI Chatbots",
				"Content Generation",
				"Document Processing",
				"AI Automation",
			],
			description:
				"Advanced AI integration, prompt engineering, fine-tuning, and custom AI solutions",
			trending: true,
			learningPath: [
				"API Integration",
				"Prompt Engineering",
				"Fine-tuning",
				"AI Ethics",
				"Cost Optimization",
			],
			lastUpdated: "2024-09-15",
		},
		{
			name: "Machine Learning",
			level: 75,
			category: "ai",
			icon: "material-symbols:psychology",
			experience: "2+ years",
			projects: [
				"Predictive Models",
				"Classification Systems",
				"Data Analysis",
				"ML Pipelines",
			],
			description:
				"Supervised/unsupervised learning, model training, evaluation, and production deployment",
			learningPath: [
				"Statistics",
				"Python/R",
				"Scikit-learn",
				"Deep Learning",
				"MLOps",
			],
			lastUpdated: "2024-08-25",
		},
		{
			name: "Natural Language Processing",
			level: 72,
			category: "ai",
			icon: "material-symbols:chat",
			experience: "1+ years",
			projects: [
				"Text Analysis",
				"Sentiment Analysis",
				"Language Models",
				"Content Processing",
			],
			description:
				"Text processing, sentiment analysis, language understanding, and content generation",
			trending: true,
			learningPath: [
				"Linguistics",
				"NLTK/spaCy",
				"Transformers",
				"Language Models",
				"Text Processing",
			],
			lastUpdated: "2024-07-30",
		},
	],

	devops: [
		{
			name: "Docker",
			level: 85,
			category: "devops",
			icon: "fa6-brands:docker",
			experience: "3+ years",
			projects: [
				"Containerized Applications",
				"Multi-stage Builds",
				"Container Orchestration",
				"CI/CD Integration",
			],
			description:
				"Container development, optimization, security scanning, and production deployment strategies",
			learningPath: [
				"Containerization",
				"Dockerfile",
				"Docker Compose",
				"Security",
				"Orchestration",
			],
			lastUpdated: "2024-08-18",
		},
		{
			name: "Kubernetes",
			level: 78,
			category: "devops",
			icon: "simple-icons:kubernetes",
			experience: "2+ years",
			projects: [
				"Production Deployments",
				"Auto-scaling",
				"Service Mesh",
				"Monitoring",
			],
			description:
				"Container orchestration, deployments, scaling, monitoring, and production-grade cluster management",
			learningPath: [
				"Docker",
				"YAML",
				"Networking",
				"Security",
				"Monitoring",
				"Helm",
			],
			lastUpdated: "2024-08-12",
		},
		{
			name: "GitHub Actions",
			level: 92,
			category: "devops",
			icon: "simple-icons:githubactions",
			experience: "3+ years",
			projects: [
				"CI/CD Pipelines",
				"Automated Testing",
				"Deployment Workflows",
				"Multi-platform Builds",
			],
			description:
				"Enterprise CI/CD automation, workflow orchestration, and advanced deployment strategies",
			trending: true,
			learningPath: [
				"Git",
				"YAML",
				"CI/CD Concepts",
				"Security",
				"Workflow Design",
			],
			lastUpdated: "2024-09-20",
		},
		{
			name: "AWS",
			level: 70,
			category: "devops",
			icon: "fa6-brands:aws",
			experience: "2+ years",
			projects: [
				"Cloud Deployment",
				"S3 Storage",
				"Lambda Functions",
				"Infrastructure as Code",
			],
			description:
				"Cloud infrastructure, serverless computing, storage solutions, and scalable architectures",
			learningPath: [
				"Cloud Concepts",
				"IAM",
				"EC2",
				"S3",
				"Lambda",
				"CloudFormation",
			],
			lastUpdated: "2024-07-15",
		},
	],

	database: [
		{
			name: "PostgreSQL",
			level: 82,
			category: "database",
			icon: "simple-icons:postgresql",
			experience: "3+ years",
			projects: [
				"Database Design",
				"Query Optimization",
				"Data Migration",
				"Performance Tuning",
			],
			description:
				"Advanced SQL, database design, performance tuning, and enterprise data management",
			learningPath: [
				"SQL Basics",
				"Database Design",
				"Indexing",
				"Performance",
				"Advanced Features",
			],
			lastUpdated: "2024-08-08",
		},
		{
			name: "MongoDB",
			level: 78,
			category: "database",
			icon: "simple-icons:mongodb",
			experience: "2+ years",
			projects: [
				"NoSQL Design",
				"Aggregation Pipelines",
				"Scaling",
				"Real-time Data",
			],
			description:
				"NoSQL database design, aggregation, indexing, and scalable document-based applications",
			learningPath: [
				"NoSQL Concepts",
				"Document Design",
				"Aggregation",
				"Indexing",
				"Scaling",
			],
			lastUpdated: "2024-07-25",
		},
		{
			name: "Redis",
			level: 75,
			category: "database",
			icon: "simple-icons:redis",
			experience: "2+ years",
			projects: [
				"Caching Systems",
				"Session Storage",
				"Real-time Features",
				"Performance Optimization",
			],
			description:
				"In-memory data structure store for caching, sessions, and real-time applications",
			learningPath: [
				"Caching Concepts",
				"Data Structures",
				"Persistence",
				"Clustering",
				"Performance",
			],
			lastUpdated: "2024-06-30",
		},
	],

	tools: [
		{
			name: "Git",
			level: 95,
			category: "tools",
			icon: "fa6-brands:git-alt",
			experience: "5+ years",
			projects: [
				"Version Control",
				"Branching Strategies",
				"Team Collaboration",
				"CI/CD Integration",
			],
			description:
				"Advanced Git workflows, branching strategies, conflict resolution, and team collaboration",
			learningPath: [
				"Basic Commands",
				"Branching",
				"Merging",
				"Advanced Features",
				"Team Workflows",
			],
			lastUpdated: "2024-09-10",
		},
		{
			name: "VS Code",
			level: 90,
			category: "tools",
			icon: "simple-icons:visualstudiocode",
			experience: "4+ years",
			projects: [
				"Development Environment",
				"Extension Development",
				"Debugging",
				"Productivity",
			],
			description:
				"Advanced IDE usage, extension development, debugging, and productivity optimization",
			learningPath: [
				"Basic Usage",
				"Extensions",
				"Debugging",
				"Customization",
				"Advanced Features",
			],
			lastUpdated: "2024-08-30",
		},
		{
			name: "Figma",
			level: 72,
			category: "tools",
			icon: "simple-icons:figma",
			experience: "2+ years",
			projects: ["UI Design", "Prototyping", "Design Systems", "Collaboration"],
			description:
				"UI/UX design, prototyping, design systems, and designer-developer collaboration",
			learningPath: [
				"Design Basics",
				"Prototyping",
				"Components",
				"Design Systems",
				"Collaboration",
			],
			lastUpdated: "2024-07-05",
		},
	],
};

// Utility functions for skills management
export const getSkillsByCategory = (category: SkillCategory): SkillData[] => {
	return skillsDatabase[category] || [];
};

export const getAllSkills = (): SkillData[] => {
	return Object.values(skillsDatabase).flat();
};

export const getTrendingSkills = (): SkillData[] => {
	return getAllSkills().filter((skill) => skill.trending);
};

export const getSkillsAboveLevel = (minLevel: number): SkillData[] => {
	return getAllSkills().filter((skill) => skill.level >= minLevel);
};

export const getSkillsByExperience = (minYears: number): SkillData[] => {
	return getAllSkills().filter((skill) => {
		const years = Number.parseInt(
			skill.experience.match(/\d+/)?.[0] || "0",
			10,
		);
		return years >= minYears;
	});
};

export const getRecentlyUpdatedSkills = (months = 6) => {
	const cutoffDate = new Date();
	cutoffDate.setMonth(cutoffDate.getMonth() - months);

	return getAllSkills().filter((skill) => {
		if (!skill.lastUpdated) return false;
		return new Date(skill.lastUpdated) > cutoffDate;
	});
};

export const getSkillStats = () => {
	const allSkills = getAllSkills();
	return {
		totalSkills: allSkills.length,
		averageLevel: Math.round(
			allSkills.reduce((sum, skill) => sum + skill.level, 0) / allSkills.length,
		),
		trendingCount: getTrendingSkills().length,
		expertLevel: getSkillsAboveLevel(90).length,
		advancedLevel: getSkillsAboveLevel(80).length,
		totalProjects: [...new Set(allSkills.flatMap((skill) => skill.projects))]
			.length,
		categoriesCount: Object.keys(skillsDatabase).length,
		recentUpdates: getRecentlyUpdatedSkills().length,
	};
};
