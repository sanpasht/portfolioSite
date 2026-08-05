import { ClockIcon } from "@sanity/icons/Clock";
import { defineArrayMember, defineField, defineType } from "sanity";

/** Every list on /now is the same shape, so the editor learns it once. */
const entryList = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "array",
    group: "sections",
    description: description ?? "Drag to reorder. Empty sections are hidden.",
    of: [defineArrayMember({ type: "entry" })],
  });

export const nowPage = defineType({
  name: "nowPage",
  title: "Now page",
  type: "document",
  icon: ClockIcon,
  groups: [
    { name: "intro", title: "Intro", default: true },
    { name: "sections", title: "Sections" },
    { name: "meta", title: "Meta" },
  ],
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      group: "intro",
      initialValue: "Now",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "simpleText",
      group: "intro",
      description: "A sentence or two framing what this page is.",
    }),

    entryList("currentFocus", "Current Focus"),
    entryList("building", "Building"),
    entryList("learning", "Learning"),
    entryList("research", "Research"),
    defineField({
      name: "reading",
      title: "Reading",
      type: "array",
      group: "sections",
      of: [defineArrayMember({ type: "readingItem" })],
    }),
    entryList("courses", "Courses"),
    entryList("goals", "Goals"),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      group: "sections",
      description: "Tools you're actively working in.",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    entryList("recentlyFinished", "Recently Finished"),
    defineField({
      name: "thoughts",
      title: "Thoughts",
      type: "simpleText",
      group: "sections",
      description: "Free-form. Whatever's on your mind this month.",
    }),

    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "datetime",
      group: "meta",
      description:
        "Shown at the top of the page. Bump it whenever you revise this.",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "meta" }),
  ],
  preview: {
    select: { lastUpdated: "lastUpdated" },
    prepare: ({ lastUpdated }) => ({
      title: "Now page",
      subtitle: lastUpdated
        ? `Updated ${new Date(lastUpdated).toISOString().slice(0, 10)}`
        : "Never updated",
    }),
  },
});
