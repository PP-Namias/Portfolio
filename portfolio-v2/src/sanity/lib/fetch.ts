import { pickClient } from "./client";
import { QUERIES } from "./queries";

type QueryResponse<T> = T | null;

export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  options?: { perspective?: "published" | "previewDrafts"; tags?: string[] }
): Promise<QueryResponse<T>> {
  const client = pickClient(options?.perspective === "previewDrafts");

  try {
    const data = await client.fetch<T>(query, params, {
      cache: options?.perspective === "previewDrafts" ? "no-store" : "force-cache",
      next: options?.tags ? { tags: options.tags } : undefined,
    });
    return data;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return null;
  }
}
