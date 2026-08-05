import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "About",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lede",
      title: "Lede",
      type: "text",
      rows: 3,
      description: "The larger opening line above the body.",
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "imageWithAlt",
      description: "Optional.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "richText",
      description:
        "Written as a narrative, not a list of jobs. Headings become navigable sections.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "About page" }),
  },
});
