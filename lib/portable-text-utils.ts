import type { PortableTextBlock } from "@portabletext/types";

import type { RichText } from "./types";

type PtNode = { _type?: string; text?: string; children?: unknown[] };

/** Flattens Portable Text to a plain string. Used for reading time and excerpts. */
export function toPlainText(value?: RichText | null): string {
  if (!Array.isArray(value)) return "";
  return value
    .map((block) => {
      const node = block as PtNode;
      if (node._type !== "block" || !Array.isArray(node.children)) return "";
      return node.children
        .map((child) => (child as PtNode).text ?? "")
        .join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

export type Heading = { id: string; text: string; level: 2 | 3 };

/** Stable, URL-safe id for a heading. Must match the renderer's ids exactly. */
export function slugifyHeading(text: string, index: number) {
  const base = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return base ? `${base}-${index}` : `section-${index}`;
}

/**
 * Table of contents source. Indexed by block position so two headings with the
 * same words still get distinct anchors.
 */
export function extractHeadings(value?: RichText | null): Heading[] {
  if (!Array.isArray(value)) return [];

  const headings: Heading[] = [];

  value.forEach((block, index) => {
    const node = block as PortableTextBlock;
    if (node._type !== "block") return;
    if (node.style !== "h2" && node.style !== "h3") return;

    const text = toPlainText([node] as RichText);
    if (!text) return;

    headings.push({
      id: slugifyHeading(text, index),
      text,
      level: node.style === "h2" ? 2 : 3,
    });
  });

  return headings;
}

/** ~200 words per minute, from a character count so listings can skip the body. */
export function readingTime(input?: RichText | number | null): number {
  const chars =
    typeof input === "number"
      ? input
      : toPlainText(input as RichText | null | undefined).length;
  if (!chars) return 1;
  const words = chars / 5;
  return Math.max(1, Math.round(words / 200));
}
