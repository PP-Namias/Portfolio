import { useEffect } from "react";
import {
  insertStructuredData,
  removeStructuredData,
  updateMetaTags,
  type SchemaOrgData,
  type SEOMetadata,
} from "@/utilities/seo";

export interface UseSEOOptions {
  metadata: SEOMetadata;
  schema?: SchemaOrgData | SchemaOrgData[];
}

/**
 * Custom hook for managing SEO metadata and structured data
 * Updates document meta tags and injects Schema.org JSON-LD on component mount
 * 
 * @example
 * ```tsx
 * useSEO({
 *   metadata: {
 *     title: "Projects",
 *     description: "My portfolio projects",
 *     keywords: ["react", "typescript"],
 *   },
 *   schema: generateProjectSchema(projectData)
 * });
 * ```
 */
export const useSEO = ({ metadata, schema }: UseSEOOptions): void => {
  useEffect(() => {
    // Update meta tags
    updateMetaTags(metadata);

    // Insert structured data
    if (schema) {
      if (Array.isArray(schema)) {
        schema.forEach((s, index) => {
          insertStructuredData(s, `structured-data-${index}`);
        });
      } else {
        insertStructuredData(schema, "structured-data-section");
      }
    }

    // Cleanup function
    return () => {
      // Remove structured data on unmount
      if (schema) {
        if (Array.isArray(schema)) {
          schema.forEach((_, index) => {
            removeStructuredData(`structured-data-${index}`);
          });
        } else {
          removeStructuredData("structured-data-section");
        }
      }
    };
  }, [metadata, schema]);
};

/**
 * Hook for setting page-specific SEO without structured data
 */
export const usePageSEO = (metadata: SEOMetadata): void => {
  useSEO({ metadata });
};
