import { defineField, defineType } from "sanity";

export const mathBlock = defineType({
  name: "mathBlock",
  title: "Math (display)",
  type: "object",
  fields: [
    defineField({
      name: "expression",
      title: "LaTeX expression",
      type: "text",
      rows: 3,
      description:
        "LaTeX without the surrounding $$. Example: \\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt\\pi}{2}",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "expression", subtitle: "caption" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Math block",
      subtitle: subtitle || "LaTeX",
    }),
  },
});
