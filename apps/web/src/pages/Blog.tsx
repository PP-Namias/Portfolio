import { FC } from 'react';
import { BlogList } from '../components/BlogList';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const BlogPage: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Blog"
        description="Thoughts, tutorials, and insights about web development, technology, and AI from Ervhyne R. Dalugdog. Explore articles on React, Node.js, TypeScript, and modern development practices."
        keywords="blog, web development, programming tutorials, React tutorials, TypeScript, JavaScript, AI development, tech articles, developer blog, Ervhyne Dalugdog"
        url="https://ervhyne.vercel.app/blog"
      />
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            My Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, technology, and my journey as a developer.
          </p>
        </section>

        {/* Blog Posts List */}
        <section>
          <BlogList />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
