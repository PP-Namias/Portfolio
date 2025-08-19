import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
}

const defaultSEO = {
  title: "Ervhyne R. Dalugdog | Full Stack Developer & AI Solutions Engineer",
  description: "Full Stack Developer specializing in AI solutions, automation, and modern web applications. Expert in React, Node.js, TypeScript, Python, and AI integration. Experienced with OpenAI, n8n automation, Sanity CMS, and modern deployment platforms. Based in Philippines, available for freelance projects and full-time opportunities.",
  keywords: "Ervhyne Dalugdog, Ervhyne R Dalugdog, Full Stack Developer Philippines, AI Engineer Philippines, React Developer, Node.js Developer, TypeScript Expert, JavaScript Developer, Python Developer, Web Development Services, AI Solutions, Machine Learning Engineer, Software Engineer Philippines, Freelance Developer, Portfolio Website, Automation Specialist, Chatbot Developer, MERN Stack Developer, Frontend Developer, Backend Developer, OpenAI API, n8n automation, Sanity CMS, Vercel deployment, MongoDB, PostgreSQL, Tailwind CSS, Express.js, RESTful APIs, JWT authentication, Figma design, WordPress Elementor, Xendit payments, Postman API testing",
  image: "https://ervhyne.vercel.app/gallery/PortFolioCoverPhoto.png",
  url: "https://ervhyne.vercel.app/",
  type: "website",
  author: "Ervhyne R. Dalugdog",
  siteName: "Ervhyne R. Dalugdog Portfolio"
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  article,
}) => {
  const seoTitle = title ? `${title} | Ervhyne R. Dalugdog` : defaultSEO.title;
  const seoDescription = description || defaultSEO.description;
  const seoKeywords = keywords || defaultSEO.keywords;
  const seoImage = image || defaultSEO.image;
  const seoUrl = url || defaultSEO.url;
  const seoAuthor = author || defaultSEO.author;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={seoAuthor} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={defaultSEO.siteName} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${seoTitle} - Preview`} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={`${seoTitle} - Preview`} />
      <meta name="twitter:creator" content="@ervhyne" />
      <meta name="twitter:site" content="@ervhyne" />

      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:author" content={article.author || seoAuthor} />
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Additional time meta tags */}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'Article' : 'Person',
          ...(type === 'article' ? {
            headline: seoTitle,
            description: seoDescription,
            image: seoImage,
            url: seoUrl,
            author: {
              "@type": "Person",
              name: seoAuthor
            },
            ...(publishedTime && { datePublished: publishedTime }),
            ...(modifiedTime && { dateModified: modifiedTime })
          } : {
            name: seoAuthor,
            url: seoUrl,
            image: seoImage,
            description: seoDescription,
            jobTitle: "Full Stack Developer & AI Solutions Engineer",
            worksFor: {
              "@type": "Organization",
              name: "Freelance"
            },
            knowsAbout: [
              "JavaScript", "TypeScript", "React", "Node.js", "Python", 
              "Artificial Intelligence", "Machine Learning", "Web Development",
              "Automation", "Software Engineering"
            ],
            sameAs: [
              "https://github.com/Ervhyne",
              "https://www.linkedin.com/in/ervhyne-dalugdog-867531359"
            ]
          })
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
