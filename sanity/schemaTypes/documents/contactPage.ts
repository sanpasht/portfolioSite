import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { defineArrayMember, defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Contact",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "simpleText",
      description: "What you'd like to hear about.",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      description:
        "Leave empty to use the links from Site settings. Drag to reorder.",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "responseNote",
      title: "Response note",
      type: "string",
      description: 'e.g. "I usually reply within a couple of days."',
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Contact page" }),
  },
});
