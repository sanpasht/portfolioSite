import { defineArrayMember, defineField, defineType } from "sanity";

const annotations = [
  defineArrayMember({
    name: "link",
    title: "Link",
    type: "object",
    fields: [
      defineField({
        name: "href",
        title: "URL",
        type: "url",
        validation: (Rule) =>
          Rule.required().uri({
            scheme: ["http", "https", "mailto", "tel"],
            allowRelative: true,
          }),
      }),
      defineField({
        name: "newTab",
        title: "Open in a new tab",
        type: "boolean",
        initialValue: false,
      }),
    ],
  }),
  defineArrayMember({
    name: "footnote",
    title: "Footnote",
    type: "object",
    description: "Renders a numbered marker; the text appears at the end.",
    fields: [
      defineField({
        name: "text",
        title: "Footnote text",
        type: "text",
        rows: 3,
        validation: (Rule) => Rule.required(),
      }),
    ],
  }),
  defineArrayMember({
    name: "inlineMath",
    title: "Inline math",
    type: "object",
    description: "LaTeX rendered inline. Write the expression without $.",
    fields: [
      defineField({
        name: "expression",
        title: "LaTeX",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
    ],
  }),
];

const codeBlock = defineArrayMember({
  type: "code",
  name: "codeBlock",
  title: "Code",
  options: {
    withFilename: true,
    languageAlternatives: [
      { title: "C", value: "c" },
      { title: "C++", value: "cpp" },
      { title: "Rust", value: "rust" },
      { title: "Python", value: "python" },
      { title: "TypeScript", value: "typescript" },
      { title: "JavaScript", value: "javascript" },
      { title: "TSX", value: "tsx" },
      { title: "Go", value: "go" },
      { title: "Assembly", value: "asm" },
      { title: "Verilog", value: "verilog" },
      { title: "Bash", value: "bash" },
      { title: "JSON", value: "json" },
      { title: "YAML", value: "yaml" },
      { title: "SQL", value: "sql" },
      { title: "Makefile", value: "makefile" },
      { title: "Diff", value: "diff" },
      { title: "Plain text", value: "text" },
    ],
  },
});

/**
 * Full editorial body: everything a technical post needs and nothing it doesn't.
 */
export const richText = defineType({
  name: "richText",
  title: "Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations,
      },
    }),
    defineArrayMember({ type: "imageWithAlt" }),
    codeBlock,
    defineArrayMember({ type: "mathBlock" }),
    defineArrayMember({ type: "tableBlock" }),
  ],
});

/**
 * Short intros and blurbs: paragraphs, emphasis, links. No headings, no media.
 */
export const simpleText = defineType({
  name: "simpleText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [{ title: "Bulleted", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: annotations.slice(0, 1),
      },
    }),
  ],
});
