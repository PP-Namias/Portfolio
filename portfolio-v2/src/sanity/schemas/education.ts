import { defineField, defineType } from "sanity";

export default defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "degree",
      title: "Degree",
      type: "string",
    }),
    defineField({
      name: "field",
      title: "Field of Study",
      type: "string",
    }),
    defineField({
      name: "startYear",
      title: "Start Year",
      type: "number",
    }),
    defineField({
      name: "endYear",
      title: "End Year",
      type: "number",
    }),
    defineField({
      name: "gpa",
      title: "GPA",
      type: "string",
    }),
    defineField({
      name: "honors",
      title: "Honors",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "activities",
      title: "Activities",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: {
      title: "institution",
      subtitle: "degree",
    },
  },
});
