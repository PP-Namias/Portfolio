import { test, expect } from "@playwright/test";

test.describe("Sanity API Routes", () => {
  test("GET /api/sanity/data should return JSON", async ({ request }) => {
    const response = await request.get("/api/sanity/data");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
  });

  test("GET /api/sanity/data should return profile data", async ({ request }) => {
    const response = await request.get("/api/sanity/data");
    const data = await response.json();
    expect(data).toHaveProperty("profile");
  });

  test("POST /api/sanity/webhook should require secret", async ({ request }) => {
    const response = await request.post("/api/sanity/webhook", {
      data: { _type: "profile", _id: "test" },
    });
    expect(response.status()).toBe(401);
  });
});

test.describe("Draft Mode Routes", () => {
  test("POST /api/draft-mode/disable should disable draft mode", async ({ request }) => {
    const response = await request.post("/api/draft-mode/disable");
    expect(response.status()).toBe(200);
  });
});

test.describe("RSS Routes", () => {
  test("GET /blog/rss should return XML", async ({ request }) => {
    const response = await request.get("/blog/rss");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
  });

  test("GET /components/rss should return XML", async ({ request }) => {
    const response = await request.get("/components/rss");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
  });
});

test.describe("SEO Routes", () => {
  test("GET /sitemap.xml should return XML", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
  });

  test("GET /robots.txt should return text", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text");
  });
});
