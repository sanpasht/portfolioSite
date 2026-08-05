import { ComposeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: ComposeIcon,
  groups: [
    { name: "content", title: "Content", default: true },
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
      description: "The URL segment: /writing/<slug>",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Shown in the index, RSS, and search results. Two sentences at most.",
      validation: (Rule) => Rule.required().max(280),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "richText",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "visibility",
      title: "Visibility",
      type: "string",
      group: "meta",
      description:
        "Only 'Published' appears on the site. 'Archived' keeps the post but hides it.",
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
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      group: "meta",
      description:
        "Set a future date to schedule the post — it stays hidden until then.",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "meta",
      initialValue: false,
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
      title: "Publish date, newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      visibility: "visibility",
      publishedAt: "publishedAt",
    },
    prepare: ({ title, media, visibility, publishedAt }) => {
      const date = publishedAt ? new Date(publishedAt) : null;
      const scheduled = date && date.getTime() > Date.now();
      const state =
        visibility !== "published"
          ? visibility
          : scheduled
            ? "scheduled"
            : "published";
      return {
        title,
        subtitle: `${state} · ${date ? date.toISOString().slice(0, 10) : "no date"}`,
        media,
      };
    },
  },
});
