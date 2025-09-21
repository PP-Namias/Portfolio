/**
 * Gallery Image Generator Utility
 * Creates professional placeholder images and optimizes gallery visuals
 */

export interface ImagePlaceholder {
	title: string;
	dimensions: {
		width: number;
		height: number;
	};
	category: string;
	primaryColor: string;
	secondaryColor: string;
	iconType: string;
}

export const galleryImagePlaceholders: ImagePlaceholder[] = [
	{
		title: "HRIS Management System",
		dimensions: { width: 1200, height: 800 },
		category: "Enterprise",
		primaryColor: "#2563eb",
		secondaryColor: "#1e40af",
		iconType: "building",
	},
	{
		title: "AI Document Processor",
		dimensions: { width: 1200, height: 800 },
		category: "AI & Automation",
		primaryColor: "#7c3aed",
		secondaryColor: "#5b21b6",
		iconType: "robot",
	},
	{
		title: "E-commerce Platform",
		dimensions: { width: 1200, height: 800 },
		category: "Web Development",
		primaryColor: "#059669",
		secondaryColor: "#047857",
		iconType: "shopping",
	},
	{
		title: "Mobile Banking App",
		dimensions: { width: 1200, height: 800 },
		category: "Mobile",
		primaryColor: "#dc2626",
		secondaryColor: "#b91c1c",
		iconType: "mobile",
	},
	{
		title: "Cloud Architecture Design",
		dimensions: { width: 1200, height: 800 },
		category: "Architecture",
		primaryColor: "#0891b2",
		secondaryColor: "#0e7490",
		iconType: "cloud",
	},
];

/**
 * Generate SVG placeholder for gallery projects
 */
export function generatePlaceholderSVG(placeholder: ImagePlaceholder): string {
	const { title, dimensions, primaryColor, secondaryColor, iconType } =
		placeholder;

	const icons = {
		building: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>`,
		robot: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"></path>`,
		shopping: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>`,
		mobile: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"></path>`,
		cloud: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>`,
	};

	return `
    <svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg-gradient)"/>
      
      <!-- Grid Pattern -->
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      <!-- Center Icon -->
      <g transform="translate(${dimensions.width / 2 - 100}, ${dimensions.height / 2 - 100})">
        <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.2)" filter="url(#shadow)"/>
        <svg x="50" y="50" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
          ${icons[iconType as keyof typeof icons] || icons.building}
        </svg>
      </g>
      
      <!-- Title -->
      <text x="${dimensions.width / 2}" y="${dimensions.height - 60}" 
            text-anchor="middle" 
            fill="white" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="36" 
            font-weight="600"
            filter="url(#shadow)">
        ${title}
      </text>
      
      <!-- Decorative Elements -->
      <circle cx="100" cy="100" r="4" fill="rgba(255,255,255,0.3)"/>
      <circle cx="${dimensions.width - 100}" cy="100" r="4" fill="rgba(255,255,255,0.3)"/>
      <circle cx="100" cy="${dimensions.height - 100}" r="4" fill="rgba(255,255,255,0.3)"/>
      <circle cx="${dimensions.width - 100}" cy="${dimensions.height - 100}" r="4" fill="rgba(255,255,255,0.3)"/>
    </svg>
  `.trim();
}

/**
 * Generate professional project mockup image URLs
 */
export function getProjectImageUrl(
	projectSlug: string,
	imageType: "main" | "detail" = "main",
): string {
	const baseUrl = "https://images.unsplash.com";

	const imageMapping: Record<string, { main: string; detail: string[] }> = {
		"hris-system": {
			main: `${baseUrl}/1600x900/?business,office,computer,dashboard,professional`,
			detail: [
				`${baseUrl}/1200x800/?dashboard,analytics,charts,business`,
				`${baseUrl}/1200x800/?office,teamwork,collaboration,modern`,
				`${baseUrl}/1200x800/?computer,coding,development,workspace`,
			],
		},
		"ai-automation": {
			main: `${baseUrl}/1600x900/?artificial-intelligence,technology,automation,futuristic`,
			detail: [
				`${baseUrl}/1200x800/?robot,automation,technology,innovation`,
				`${baseUrl}/1200x800/?data,analytics,machine-learning,ai`,
				`${baseUrl}/1200x800/?neural-network,artificial-intelligence,tech`,
			],
		},
		"ecommerce-platform": {
			main: `${baseUrl}/1600x900/?ecommerce,shopping,online,marketplace,modern`,
			detail: [
				`${baseUrl}/1200x800/?shopping-cart,ecommerce,retail,online`,
				`${baseUrl}/1200x800/?payment,checkout,secure,transaction`,
				`${baseUrl}/1200x800/?warehouse,logistics,shipping,fulfillment`,
			],
		},
		"mobile-banking": {
			main: `${baseUrl}/1600x900/?mobile,banking,fintech,finance,app`,
			detail: [
				`${baseUrl}/1200x800/?smartphone,banking,mobile-app,finance`,
				`${baseUrl}/1200x800/?security,encryption,safe,protection`,
				`${baseUrl}/1200x800/?transaction,payment,digital,banking`,
			],
		},
		"cloud-architecture": {
			main: `${baseUrl}/1600x900/?cloud,architecture,infrastructure,technology`,
			detail: [
				`${baseUrl}/1200x800/?server,datacenter,cloud-computing,tech`,
				`${baseUrl}/1200x800/?network,connectivity,infrastructure,cloud`,
				`${baseUrl}/1200x800/?scalability,performance,optimization,cloud`,
			],
		},
	};

	if (imageType === "main") {
		return (
			imageMapping[projectSlug]?.main ||
			`${baseUrl}/1600x900/?technology,software,development`
		);
	}

	const details = imageMapping[projectSlug]?.detail || [];
	return (
		details[Math.floor(Math.random() * details.length)] ||
		`${baseUrl}/1200x800/?technology,software`
	);
}

/**
 * Generate optimized image metadata for better performance
 */
export function generateImageMetadata(projectSlug: string) {
	return {
		mainImage: getProjectImageUrl(projectSlug, "main"),
		additionalImages: [
			getProjectImageUrl(projectSlug, "detail"),
			getProjectImageUrl(projectSlug, "detail"),
			getProjectImageUrl(projectSlug, "detail"),
		],
		alt: `Professional ${projectSlug.replace("-", " ")} project showcase`,
		loading: "lazy" as const,
		decoding: "async" as const,
		sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
	};
}

/**
 * Professional color schemes for gallery projects
 */
export const professionalColorSchemes = {
	enterprise: {
		primary: "#2563eb",
		secondary: "#1e40af",
		accent: "#3b82f6",
		text: "#1e293b",
	},
	aiAutomation: {
		primary: "#7c3aed",
		secondary: "#5b21b6",
		accent: "#8b5cf6",
		text: "#1e293b",
	},
	webDevelopment: {
		primary: "#059669",
		secondary: "#047857",
		accent: "#10b981",
		text: "#1e293b",
	},
	mobile: {
		primary: "#dc2626",
		secondary: "#b91c1c",
		accent: "#ef4444",
		text: "#1e293b",
	},
	architecture: {
		primary: "#0891b2",
		secondary: "#0e7490",
		accent: "#06b6d4",
		text: "#1e293b",
	},
};
