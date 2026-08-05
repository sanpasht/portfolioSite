import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Appears in the header, footer, and page titles.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: 'e.g. "Software Engineer"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: 'e.g. "MCS @ UC Irvine · BS Mathematics"',
    }),
    defineField({
      name: "description",
      title: "Site description",
      type: "text",
      rows: 3,
      description:
        "The default meta description, used anywhere a page doesn't set its own.",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) =>
        Rule.required().email().error("Enter a valid email address."),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "resumeUrl",
      title: "Resume link",
      type: "string",
      description:
        "Where /resume sends people. Either an uploaded file below, or a full URL.",
    }),
    defineField({
      name: "resumeFile",
      title: "Resume file",
      type: "file",
      description:
        "Drag a PDF here. Takes precedence over the link above when set.",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "socialLinks",
      title: "Links",
      type: "array",
      description: "Shown in the footer and on /contact. Drag to reorder.",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "ogImage",
      title: "Default social share image",
      type: "image",
      description:
        "Optional. Falls back to an automatically generated image when empty.",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
