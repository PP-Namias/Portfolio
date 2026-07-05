import { defineField, defineType } from "sanity";

export default defineType({
  name: "award",
  title: "Award",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "prize",
      title: "Prize",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "prize",
    },
  },
});
