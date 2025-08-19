import { FC } from 'react';
import { BlogList } from './BlogList';
import { Button } from './ui/button';
import { useLocation } from 'wouter';

export const BlogPreviewSection: FC = () => {
  const [, setLocation] = useLocation();

  const handleViewAllPosts = () => {
    setLocation('/blog');
  };

  return (
    <section id="blog-preview" className="py-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="scroll-fade-in">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Latest <span className="gradient-text">Blog Posts</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on web development, AI, and technology
            </p>
          </div>

          {/* Blog Posts Preview */}
          <div className="mb-12">
            <BlogList limit={3} showTitle={false} />
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button
              onClick={handleViewAllPosts}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 text-lg font-semibold hover:from-blue-600 hover:to-purple-700 hover:scale-105 transform transition-all duration-300 shadow-lg"
            >
              View All Posts
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
