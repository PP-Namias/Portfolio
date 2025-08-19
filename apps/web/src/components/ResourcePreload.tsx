import { Helmet } from 'react-helmet-async';

interface PreloadProps {
  fonts?: string[];
  images?: string[];
  scripts?: string[];
  stylesheets?: string[];
}

export const ResourcePreload: React.FC<PreloadProps> = ({
  fonts = [],
  images = [],
  scripts = [],
  stylesheets = []
}) => {
  return (
    <Helmet>
      {/* Preload critical fonts */}
      {fonts.map((font, index) => (
        <link
          key={`font-${index}`}
          rel="preload"
          href={font}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}

      {/* Preload critical images */}
      {images.map((image, index) => (
        <link
          key={`image-${index}`}
          rel="preload"
          href={image}
          as="image"
        />
      ))}

      {/* Preload critical scripts */}
      {scripts.map((script, index) => (
        <link
          key={`script-${index}`}
          rel="preload"
          href={script}
          as="script"
        />
      ))}

      {/* Preload critical stylesheets */}
      {stylesheets.map((stylesheet, index) => (
        <link
          key={`stylesheet-${index}`}
          rel="preload"
          href={stylesheet}
          as="style"
        />
      ))}

      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//cdn.sanity.io" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default ResourcePreload;
