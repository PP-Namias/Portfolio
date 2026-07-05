import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { assist } from "@sanity/assist";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "namias-cms",
  title: "Namias CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool(),
    visionTool(),
    assist(),
  ],
  schema: {
    types: schemaTypes,
  },
});
