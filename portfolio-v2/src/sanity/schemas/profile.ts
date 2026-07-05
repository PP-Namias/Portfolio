import { defineField, defineType } from "sanity";

export default defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "displayName",
      title: "Display Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "username",
      title: "Username",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "dailyDev",
      title: "daily.dev Profile",
      type: "url",
    }),
    defineField({
      name: "avatar",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "about",
      title: "About (Rich Text)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "aboutText",
      title: "About (Plain Text)",
      type: "text",
      description: "Plain text version of about section",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{ type: "reference", to: [{ type: "socialLink" }] }],
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      of: [{ type: "reference", to: [{ type: "education" }] }],
    }),
    defineField({
      name: "availability",
      title: "Available for Work",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "resumeUrl",
      title: "Resume URL",
      type: "url",
    }),
  ],
  preview: {
    select: {
      title: "displayName",
      subtitle: "title",
    },
  },
});
