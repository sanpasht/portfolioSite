import { CaseIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "writeup", title: "Write-up" },
    { name: "media", title: "Media" },
    { name: "meta", title: "Meta & SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description: "The URL segment: /projects/<slug>",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 2,
      group: "content",
      description: "One or two lines. Shown in listings and previews.",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "longDescription",
      title: "Overview",
      type: "richText",
      group: "content",
      description: "The main write-up. What it is and why it exists.",
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "architecture",
      title: "Architecture",
      type: "richText",
      group: "writeup",
      description: "How it's put together.",
    }),
    defineField({
      name: "challenges",
      title: "Challenges",
      type: "richText",
      group: "writeup",
      description: "What was genuinely hard.",
    }),
    defineField({
      name: "lessons",
      title: "Lessons learned",
      type: "richText",
      group: "writeup",
    }),
    defineField({
      name: "futureWork",
      title: "Future work",
      type: "richText",
      group: "writeup",
    }),

    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "imageWithAlt",
      group: "media",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      options: { layout: "grid" },
      description: "Drag to reorder.",
    }),

    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      group: "meta",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "demoUrl",
      title: "Demo URL",
      type: "url",
      group: "meta",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "status",
      title: "Project status",
      type: "string",
      group: "meta",
      options: {
        list: [
          { title: "In progress", value: "in-progress" },
          { title: "Shipped", value: "shipped" },
          { title: "Maintained", value: "maintained" },
          { title: "Research", value: "research" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "in-progress",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "visibility",
      title: "Visibility",
      type: "string",
      group: "meta",
      description:
        "Only 'Published' appears on the site. 'Archived' keeps the document but hides it.",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "meta",
      description: "Featured projects can appear on the homepage.",
      initialValue: false,
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      group: "meta",
      description: "Used for ordering. Roughly when you built it.",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "meta" }),
  ],
  orderings: [
    {
      title: "Date, newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Title, A to Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "shortDescription",
      media: "coverImage",
      visibility: "visibility",
      featured: "featured",
    },
    prepare: ({ title, subtitle, media, visibility, featured }) => {
      const flags = [
        visibility !== "published" ? visibility : null,
        featured ? "featured" : null,
      ].filter(Boolean);
      return {
        title,
        subtitle: flags.length ? `[${flags.join(" · ")}] ${subtitle ?? ""}` : subtitle,
        media,
      };
    },
  },
});
