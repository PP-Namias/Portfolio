/**
 * SEO Validation Script
 * Run this in the browser console to validate SEO implementation
 */

interface SEOValidationResult {
  category: string;
  status: "✅" | "⚠️" | "❌";
  message: string;
  details?: string;
}

class SEOValidator {
  private results: SEOValidationResult[] = [];

  /**
   * Run all SEO validations
   */
  public validate(): void {
    console.log("🔍 Starting SEO Validation...\n");
    
    this.validateTitle();
    this.validateMetaDescription();
    this.validateCanonical();
    this.validateOpenGraph();
    this.validateTwitterCards();
    this.validateStructuredData();
    this.validateRobotsMeta();
    this.validateImages();
    this.validateHeadings();
    this.validateLinks();
    
    this.printResults();
  }

  /**
   * Validate page title
   */
  private validateTitle(): void {
    const title = document.title;
    
    if (!title) {
      this.addResult("Title", "❌", "No title found");
      return;
    }

    if (title.length < 30) {
      this.addResult("Title", "⚠️", `Title too short (${title.length} chars)`, title);
    } else if (title.length > 60) {
      this.addResult("Title", "⚠️", `Title too long (${title.length} chars)`, title);
    } else {
      this.addResult("Title", "✅", `Title length optimal (${title.length} chars)`, title);
    }
  }

  /**
   * Validate meta description
   */
  private validateMetaDescription(): void {
    const description = document.querySelector('meta[name="description"]')?.getAttribute("content");
    
    if (!description) {
      this.addResult("Meta Description", "❌", "No meta description found");
      return;
    }

    if (description.length < 120) {
      this.addResult("Meta Description", "⚠️", `Description too short (${description.length} chars)`, description);
    } else if (description.length > 160) {
      this.addResult("Meta Description", "⚠️", `Description too long (${description.length} chars)`, description);
    } else {
      this.addResult("Meta Description", "✅", `Description length optimal (${description.length} chars)`, description);
    }
  }

  /**
   * Validate canonical URL
   */
  private validateCanonical(): void {
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
    
    if (!canonical) {
      this.addResult("Canonical URL", "❌", "No canonical URL found");
      return;
    }

    if (!canonical.startsWith("http")) {
      this.addResult("Canonical URL", "⚠️", "Canonical URL should be absolute", canonical);
      return;
    }

    this.addResult("Canonical URL", "✅", "Canonical URL found", canonical);
  }

  /**
   * Validate Open Graph tags
   */
  private validateOpenGraph(): void {
    const requiredOGTags = [
      "og:title",
      "og:description",
      "og:image",
      "og:url",
      "og:type",
    ];

    const missingTags: string[] = [];
    const foundTags: Record<string, string> = {};

    requiredOGTags.forEach(tag => {
      const element = document.querySelector(`meta[property="${tag}"]`);
      const content = element?.getAttribute("content");
      
      if (!content) {
        missingTags.push(tag);
      } else {
        foundTags[tag] = content;
      }
    });

    if (missingTags.length > 0) {
      this.addResult("Open Graph", "⚠️", `Missing tags: ${missingTags.join(", ")}`);
    } else {
      this.addResult("Open Graph", "✅", "All required OG tags present", JSON.stringify(foundTags, null, 2));
    }

    // Validate OG image dimensions
    const ogImage = foundTags["og:image"];
    if (ogImage) {
      const width = document.querySelector('meta[property="og:image:width"]')?.getAttribute("content");
      const height = document.querySelector('meta[property="og:image:height"]')?.getAttribute("content");
      
      if (width === "1200" && height === "630") {
        this.addResult("OG Image", "✅", "Image dimensions optimal (1200×630)");
      } else if (width && height) {
        this.addResult("OG Image", "⚠️", `Image dimensions: ${width}×${height} (recommended: 1200×630)`);
      } else {
        this.addResult("OG Image", "⚠️", "Image dimensions not specified");
      }
    }
  }

  /**
   * Validate Twitter Card tags
   */
  private validateTwitterCards(): void {
    const requiredTwitterTags = [
      "twitter:card",
      "twitter:title",
      "twitter:description",
      "twitter:image",
    ];

    const missingTags: string[] = [];
    const foundTags: Record<string, string> = {};

    requiredTwitterTags.forEach(tag => {
      const element = document.querySelector(`meta[name="${tag}"]`);
      const content = element?.getAttribute("content");
      
      if (!content) {
        missingTags.push(tag);
      } else {
        foundTags[tag] = content;
      }
    });

    if (missingTags.length > 0) {
      this.addResult("Twitter Cards", "⚠️", `Missing tags: ${missingTags.join(", ")}`);
    } else {
      this.addResult("Twitter Cards", "✅", "All required Twitter tags present", JSON.stringify(foundTags, null, 2));
    }
  }

  /**
   * Validate structured data (JSON-LD)
   */
  private validateStructuredData(): void {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    if (scripts.length === 0) {
      this.addResult("Structured Data", "❌", "No structured data found");
      return;
    }

    let validSchemas = 0;
    let invalidSchemas = 0;
    const schemaTypes: string[] = [];

    scripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent || "");
        if (data["@context"] && data["@type"]) {
          validSchemas++;
          schemaTypes.push(data["@type"]);
        } else {
          invalidSchemas++;
        }
      } catch {
        invalidSchemas++;
      }
    });

    if (invalidSchemas > 0) {
      this.addResult("Structured Data", "⚠️", `${validSchemas} valid, ${invalidSchemas} invalid schemas`);
    } else {
      this.addResult("Structured Data", "✅", `${validSchemas} valid schema(s) found`, `Types: ${schemaTypes.join(", ")}`);
    }
  }

  /**
   * Validate robots meta tag
   */
  private validateRobotsMeta(): void {
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content");
    
    if (!robots) {
      this.addResult("Robots Meta", "⚠️", "No robots meta tag found");
      return;
    }

    if (robots.includes("noindex") || robots.includes("nofollow")) {
      this.addResult("Robots Meta", "⚠️", "Site is blocking crawlers", robots);
    } else {
      this.addResult("Robots Meta", "✅", "Site allows crawling", robots);
    }
  }

  /**
   * Validate images
   */
  private validateImages(): void {
    const images = document.querySelectorAll("img");
    let missingAlt = 0;
    let hasAlt = 0;

    images.forEach(img => {
      if (!img.getAttribute("alt") && img.getAttribute("alt") !== "") {
        missingAlt++;
      } else {
        hasAlt++;
      }
    });

    if (missingAlt > 0) {
      this.addResult("Images", "⚠️", `${missingAlt} images missing alt text (${hasAlt} have alt text)`);
    } else if (images.length === 0) {
      this.addResult("Images", "⚠️", "No images found on page");
    } else {
      this.addResult("Images", "✅", `All ${hasAlt} images have alt text`);
    }
  }

  /**
   * Validate heading structure
   */
  private validateHeadings(): void {
    const h1 = document.querySelectorAll("h1");
    
    if (h1.length === 0) {
      this.addResult("Headings", "❌", "No H1 heading found");
    } else if (h1.length > 1) {
      this.addResult("Headings", "⚠️", `Multiple H1 headings found (${h1.length})`, Array.from(h1).map(h => h.textContent).join(", "));
    } else {
      this.addResult("Headings", "✅", "Single H1 heading found", h1[0].textContent || "");
    }
  }

  /**
   * Validate internal links
   */
  private validateLinks(): void {
    const links = document.querySelectorAll("a[href]");
    let internalLinks = 0;
    let externalLinks = 0;
    let brokenLinks = 0;

    links.forEach(link => {
      const href = link.getAttribute("href");
      
      if (!href || href === "#" || href === "javascript:void(0)") {
        brokenLinks++;
      } else if (href.startsWith("http")) {
        externalLinks++;
      } else {
        internalLinks++;
      }
    });

    const status = brokenLinks > 0 ? "⚠️" : "✅";
    this.addResult("Links", status, `${internalLinks} internal, ${externalLinks} external, ${brokenLinks} broken`);
  }

  /**
   * Add validation result
   */
  private addResult(
    category: string,
    status: "✅" | "⚠️" | "❌",
    message: string,
    details?: string
  ): void {
    this.results.push({ category, status, message, details });
  }

  /**
   * Print validation results
   */
  private printResults(): void {
    console.log("\n📊 SEO Validation Results\n");
    console.log("=".repeat(80) + "\n");

    const passed = this.results.filter(r => r.status === "✅").length;
    const warnings = this.results.filter(r => r.status === "⚠️").length;
    const failed = this.results.filter(r => r.status === "❌").length;

    this.results.forEach(result => {
      console.log(`${result.status} ${result.category}: ${result.message}`);
      if (result.details) {
        console.log(`   ${result.details}\n`);
      }
    });

    console.log("\n" + "=".repeat(80));
    console.log(`\n✅ Passed: ${passed} | ⚠️ Warnings: ${warnings} | ❌ Failed: ${failed}\n`);

    const score = Math.round((passed / this.results.length) * 100);
    console.log(`Overall SEO Score: ${score}%\n`);

    if (score >= 90) {
      console.log("🎉 Excellent! Your SEO is well optimized.");
    } else if (score >= 70) {
      console.log("👍 Good! Address warnings to improve further.");
    } else if (score >= 50) {
      console.log("⚠️ Fair. Several improvements needed.");
    } else {
      console.log("❌ Poor. Significant SEO issues to address.");
    }
  }
}

// Auto-run validation
const validator = new SEOValidator();
validator.validate();

// Export for manual use
declare global {
  interface Window {
    SEOValidator: typeof SEOValidator;
  }
}

window.SEOValidator = SEOValidator;
