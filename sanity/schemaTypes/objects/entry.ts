import { defineField, defineType } from "sanity";

/**
 * The repeating unit behind every list on /now and the homepage's Current Focus.
 * One shape, reused everywhere, so the editing experience stays predictable.
 */
export const entry = defineType({
  name: "entry",
  title: "Entry",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "detail",
      title: "Detail",
      type: "text",
      rows: 2,
      description: "Optional one-liner shown under the title.",
    }),
    defineField({
      name: "url",
      title: "Link",
      type: "url",
      description: "Optional. Turns the title into a link.",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"], allowRelative: true }),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "detail" },
  },
});

export const readingItem = defineType({
  name: "readingItem",
  title: "Book",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({
      name: "note",
      title: "Note",
      type: "text",
      rows: 2,
      description: "Optional. What you're taking from it.",
    }),
    defineField({
      name: "url",
      title: "Link",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "author" },
  },
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["http", "https", "mailto"] }),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "GitHub", value: "github" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Email", value: "mail" },
          { title: "X / Twitter", value: "twitter" },
          { title: "Generic link", value: "link" },
        ],
        layout: "dropdown",
      },
      initialValue: "link",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "url" },
  },
});
