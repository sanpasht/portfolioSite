import { defineArrayMember, defineField, defineType } from "sanity";

export const tableRow = defineType({
  name: "tableRow",
  title: "Row",
  type: "object",
  fields: [
    defineField({
      name: "cells",
      title: "Cells",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { cells: "cells" },
    prepare: ({ cells }) => ({
      title: Array.isArray(cells) ? cells.join(" · ") : "Empty row",
    }),
  },
});

export const tableBlock = defineType({
  name: "tableBlock",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "hasHeaderRow",
      title: "First row is a header",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [defineArrayMember({ type: "tableRow" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: { rows: "rows", caption: "caption" },
    prepare: ({ rows, caption }) => ({
      title: caption || "Table",
      subtitle: `${Array.isArray(rows) ? rows.length : 0} rows`,
    }),
  },
});
