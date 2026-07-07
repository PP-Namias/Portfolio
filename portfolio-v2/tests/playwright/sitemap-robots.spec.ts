import { test, expect } from "@playwright/test";

test.describe("Sitemap", () => {
  test("should return valid XML", async ({ request }) => {
    const response = await request.get("http://localhost:3000/sitemap.xml");
    expect(response.ok()).toBeTruthy();
    
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("xml");
    
    const body = await response.text();
    expect(body).toContain("<?xml");
    expect(body).toContain("<urlset");
    expect(body).toContain("<url>");
  });

  test("should contain homepage URL", async ({ request }) => {
    const response = await request.get("http://localhost:3000/sitemap.xml");
    const body = await response.text();
    
    expect(body).toContain("<loc>");
    expect(body).toContain("http://localhost:3000");
  });

  test("should have valid loc tags", async ({ request }) => {
    const response = await request.get("http://localhost:3000/sitemap.xml");
    const body = await response.text();
    
    // Check for loc tags
    const locMatches = body.match(/<loc>/g);
    expect(locMatches).toBeTruthy();
    expect(locMatches?.length).toBeGreaterThan(0);
  });
});

test.describe("Robots.txt", () => {
  test("should return valid robots.txt", async ({ request }) => {
    const response = await request.get("http://localhost:3000/robots.txt");
    expect(response.ok()).toBeTruthy();
    
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("text/plain");
    
    const body = await response.text();
    expect(body).toContain("User-agent");
    expect(body).toContain("Allow");
  });

  test("should allow all crawlers", async ({ request }) => {
    const response = await request.get("http://localhost:3000/robots.txt");
    const body = await response.text();
    
    expect(body).toContain("User-agent: *");
    expect(body).toContain("Allow: /");
  });

  test("should have sitemap reference", async ({ request }) => {
    const response = await request.get("http://localhost:3000/robots.txt");
    const body = await response.text();
    
    expect(body).toContain("Sitemap:");
  });
});
