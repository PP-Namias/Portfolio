// Blog post interface based on Sanity schema
export interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  mainImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  body?: any[]; // Portable Text content
  publishedAt: string;
  published?: boolean;
  featured?: boolean;
  author?: Author;
  categories?: Category[];
}

export interface Author {
  _id: string;
  name: string;
  image?: {
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  bio?: any[]; // Portable Text content
}

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
}

// Utility type for blog list items (simplified version)
export interface BlogListItem {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  mainImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  publishedAt: string;
  author?: {
    name: string;
    image?: {
      asset: {
        _ref: string;
        _type: string;
      };
      alt?: string;
    };
  };
  categories?: {
    title: string;
    slug: {
      current: string;
    };
  }[];
}
