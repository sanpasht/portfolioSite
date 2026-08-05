import { HomeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "heroName",
      title: "Hero name",
      type: "string",
      description: "Leave empty to use the name from Site settings.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero subtitle",
      type: "string",
      description: 'e.g. "MCS @ UC Irvine · BS Mathematics"',
    }),
    defineField({
      name: "heroRole",
      title: "Hero role",
      type: "string",
      description: 'e.g. "Software Engineer"',
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "simpleText",
      description: "The paragraph under the hero.",
    }),

    defineField({
      name: "currentFocusTitle",
      title: "Current Focus — heading",
      type: "string",
      initialValue: "Current Focus",
    }),
    defineField({
      name: "currentFocus",
      title: "Current Focus — items",
      type: "array",
      description: "Drag to reorder. Leave empty to hide the section.",
      of: [defineArrayMember({ type: "entry" })],
    }),

    defineField({
      name: "featuredProjects",
      title: "Featured projects",
      type: "array",
      description:
        "Drag to set the exact order shown on the homepage. Leave empty to fall back to every project marked 'Featured', newest first.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "project" }],
          options: {
            filter: 'visibility == "published"',
          },
        }),
      ],
      validation: (Rule) => Rule.unique().max(6),
    }),
    defineField({
      name: "showLatestWriting",
      title: "Show Latest Writing",
      type: "boolean",
      initialValue: true,
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
