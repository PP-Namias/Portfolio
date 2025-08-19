import { FC } from 'react';
import { PortableText } from '@portabletext/react';
import { urlFor } from '../lib/sanity';

interface PortableTextComponentProps {
  value: any[];
}

// Custom components for portable text rendering
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      try {
        // Check if we have a valid image object with asset reference
        if (!value || !value.asset) {
          console.warn('Image block missing asset reference:', value);
          return null;
        }
        
        const imageUrl = urlFor(value).width(800).url();
        return (
          <div className="my-8">
            <img
              src={imageUrl}
              alt={value.alt || ''}
              className="w-full rounded-lg shadow-md"
            />
            {value.caption && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {value.caption}
              </p>
            )}
          </div>
        );
      } catch (error) {
        console.error('Error rendering image:', error, value);
        return (
          <div className="my-8 p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground text-center">
              Unable to load image
            </p>
          </div>
        );
      }
    },
    code: ({ value }: any) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
        <code className="text-sm">{value.code}</code>
      </pre>
    ),
  },
  marks: {
    link: ({ children, value }: any) => {
      const target = value.href.startsWith('http') ? '_blank' : undefined;
      return (
        <a
          href={value.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-primary hover:underline"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }: any) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }: any) => (
      <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-medium mt-4 mb-2">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-medium mt-3 mb-2">{children}</h4>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
};

export const PortableTextComponent: FC<PortableTextComponentProps> = ({ value }) => {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <PortableText value={value} components={portableTextComponents} />
    </div>
  );
};
