import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the image for screen readers and search engines.",
      validation: (Rule) =>
        Rule.required().error("Alt text is required for accessibility."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional. Shown under the image.",
    }),
  ],
  preview: {
    select: { media: "asset", title: "alt", subtitle: "caption" },
  },
});
