import { defineField, defineType } from "sanity";

export default defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "issuer",
      title: "Issuer",
      type: "string",
    }),
    defineField({
      name: "issuedAt",
      title: "Issued Date",
      type: "date",
    }),
    defineField({
      name: "expiresAt",
      title: "Expires Date",
      type: "date",
    }),
    defineField({
      name: "credentialUrl",
      title: "Credential URL",
      type: "url",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "issuer",
      media: "image",
    },
  },
});
