import { SearchIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: SearchIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      description:
        "Overrides the page title in search results. Leave empty to use the document title.",
      validation: (Rule) =>
        Rule.max(70).warning("Titles over ~70 characters get truncated."),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning(
          "Descriptions over 160 characters get truncated in search results.",
        ),
    }),
    defineField({
      name: "image",
      title: "Social share image",
      type: "image",
      description:
        "Optional. If empty, an OpenGraph image is generated automatically from the title.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
