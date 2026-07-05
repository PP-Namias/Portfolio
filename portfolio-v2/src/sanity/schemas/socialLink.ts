import { defineField, defineType } from "sanity";

export default defineType({
  name: "socialLink",
  title: "Social Link",
  type: "document",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "X", value: "x" },
          { title: "GitHub", value: "github" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Discord", value: "discord" },
          { title: "YouTube", value: "youtube" },
          { title: "Instagram", value: "instagram" },
          { title: "daily.dev", value: "dailydev" },
          { title: "Email", value: "email" },
          { title: "Phone", value: "phone" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "handle",
      title: "Handle",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isPrimary",
      title: "Primary",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "platform",
      subtitle: "handle",
    },
  },
});
