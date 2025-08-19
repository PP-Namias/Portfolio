import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'Person' | 'WebSite' | 'Article' | 'BlogPosting' | 'Organization';
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
    </Helmet>
  );
};

// Predefined structured data for common use cases
export const PersonStructuredData = () => (
  <StructuredData
    type="Person"
    data={{
      name: "Ervhyne R. Dalugdog",
      url: "https://ervhyne.vercel.app",
      image: "https://ervhyne.vercel.app/profile.jpeg",
      description: "Full Stack Developer specializing in AI solutions, automation, and modern web applications",
      jobTitle: "Full Stack Developer & AI Solutions Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Freelance"
      },
      knowsAbout: [
        "JavaScript",
        "TypeScript", 
        "React",
        "Vue.js",
        "Next.js",
        "Node.js",
        "Express.js",
        "Python",
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Artificial Intelligence",
        "Machine Learning",
        "OpenAI API",
        "n8n Automation",
        "Web Development",
        "RESTful APIs",
        "JWT Authentication",
        "OAuth",
        "Tailwind CSS",
        "Redux",
        "Vite",
        "Webpack",
        "Git",
        "GitHub Actions",
        "Vercel",
        "Railway",
        "Figma",
        "Sanity CMS",
        "WordPress",
        "Shopify",
        "Xendit Payments",
        "Postman",
        "Software Engineering",
        "Automation",
        "Chatbot Development"
      ],
      hasOccupation: {
        "@type": "Occupation",
        name: "Full Stack Developer",
        occupationLocation: {
          "@type": "Country",
          name: "Philippines"
        },
        skills: [
          "Frontend Development",
          "Backend Development", 
          "Database Management",
          "DevOps & Deployment",
          "UI/UX Design",
          "AI & Automation",
          "Payment Integration"
        ]
      },
      sameAs: [
        "https://github.com/Ervhyne",
        "https://www.linkedin.com/in/ervhyne-dalugdog-867531359"
      ],
      address: {
        "@type": "Place",
        addressCountry: "PH"
      }
    }}
  />
);

export const WebSiteStructuredData = () => (
  <StructuredData
    type="WebSite"
    data={{
      name: "Ervhyne R. Dalugdog Portfolio",
      url: "https://ervhyne.vercel.app",
      description: "Portfolio website showcasing full stack development projects, AI solutions, and technical blog posts",
      author: {
        "@type": "Person",
        name: "Ervhyne R. Dalugdog"
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://ervhyne.vercel.app/blog?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }}
  />
);

export default StructuredData;
