import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
    }),
    defineField({
      name: "accentColor",
      title: "Accent Color",
      type: "string",
      description: "HEX color for theme accent",
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "string",
    }),
    defineField({
      name: "ga4Id",
      title: "Google Analytics 4 ID",
      type: "string",
    }),
    defineField({
      name: "posthogToken",
      title: "PostHog Token",
      type: "string",
    }),
    defineField({
      name: "openpanelClientId",
      title: "OpenPanel Client ID",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "siteTitle" },
  },
});
