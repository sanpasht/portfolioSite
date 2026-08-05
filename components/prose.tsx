import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from "@portabletext/react";
import katex from "katex";

import "katex/dist/katex.min.css";

import { highlight } from "@/lib/highlight";
import { slugifyHeading } from "@/lib/portable-text-utils";
import type { RichText } from "@/lib/types";
import { cn } from "@/lib/utils";
import { urlForImage, type SanityImage } from "@/sanity/lib/image";
import { CopyButton } from "@/components/copy-button";

type Footnote = { key: string; text: string; number: number };

type CodeValue = {
  _key?: string;
  code?: string;
  language?: string;
  filename?: string;
};

/**
 * Walks children in reading order so footnote numbers match where the markers
 * actually appear, not the order the annotations happen to sit in `markDefs`.
 */
function collectFootnotes(value: RichText): Footnote[] {
  const footnotes: Footnote[] = [];
  const seen = new Set<string>();

  for (const block of value) {
    const node = block as {
      _type?: string;
      markDefs?: { _key: string; _type: string; text?: string }[];
      children?: { marks?: string[] }[];
    };
    if (node._type !== "block" || !Array.isArray(node.children)) continue;

    const defs = new Map(
      (node.markDefs ?? [])
        .filter((def) => def._type === "footnote")
        .map((def) => [def._key, def.text ?? ""]),
    );

    for (const child of node.children) {
      for (const mark of child.marks ?? []) {
        if (!defs.has(mark) || seen.has(mark)) continue;
        seen.add(mark);
        footnotes.push({
          key: mark,
          text: defs.get(mark) ?? "",
          number: footnotes.length + 1,
        });
      }
    }
  }

  return footnotes;
}

function renderMath(expression: string, displayMode: boolean) {
  try {
    return katex.renderToString(expression, {
      displayMode,
      throwOnError: false,
      strict: false,
      output: "html",
    });
  } catch {
    return null;
  }
}

function buildComponents(
  codeHtml: Map<string, string>,
  footnotes: Map<string, number>,
): PortableTextComponents {
  return {
    block: {
      h2: ({ children, index, value }) => (
        <h2 id={slugifyHeading(headingText(value), index ?? 0)}>{children}</h2>
      ),
      h3: ({ children, index, value }) => (
        <h3 id={slugifyHeading(headingText(value), index ?? 0)}>{children}</h3>
      ),
      h4: ({ children }) => <h4>{children}</h4>,
      blockquote: ({ children }) => <blockquote>{children}</blockquote>,
      normal: ({ children }) => <p>{children}</p>,
    },

    marks: {
      link: ({ children, value }) => {
        const href: string = value?.href ?? "#";
        const external = /^https?:\/\//.test(href) && !href.includes("://localhost");
        if (external || value?.newTab) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="break-words"
            >
              {children}
            </a>
          );
        }
        return <Link href={href}>{children}</Link>;
      },

      inlineMath: ({ value }) => {
        const html = renderMath(value?.expression ?? "", false);
        if (!html) return <code>{value?.expression}</code>;
        return <span dangerouslySetInnerHTML={{ __html: html }} />;
      },

      footnote: ({
        children,
        markKey,
      }: PortableTextMarkComponentProps & { markKey?: string }) => {
        const number = markKey ? footnotes.get(markKey) : undefined;
        if (!number) return <>{children}</>;
        return (
          <>
            {children}
            <sup className="ml-0.5">
              <a
                id={`fnref-${number}`}
                href={`#fn-${number}`}
                aria-label={`Footnote ${number}`}
                className="no-underline"
              >
                {number}
              </a>
            </sup>
          </>
        );
      },
    },

    types: {
      codeBlock: ({ value }: { value: CodeValue }) => {
        const html = value._key ? codeHtml.get(value._key) : undefined;
        return (
          <CodeBlock
            html={html}
            code={value.code ?? ""}
            filename={value.filename}
            language={value.language}
          />
        );
      },

      imageWithAlt: ({ value }: { value: SanityImage }) => {
        const builder = urlForImage(value);
        if (!builder) return null;

        const dimensions = value.asset?.metadata?.dimensions;
        const width = dimensions?.width ?? 1600;
        const height = dimensions?.height ?? 900;

        return (
          <figure className="my-8">
            <Image
              src={builder.width(1400).url()}
              alt={value.alt ?? ""}
              width={width}
              height={height}
              sizes="(min-width: 768px) 700px, 100vw"
              placeholder={value.asset?.metadata?.lqip ? "blur" : "empty"}
              blurDataURL={value.asset?.metadata?.lqip}
              className="h-auto w-full rounded-lg border border-border"
            />
            {value.caption ? <figcaption>{value.caption}</figcaption> : null}
          </figure>
        );
      },

      mathBlock: ({ value }: { value: { expression?: string; caption?: string } }) => {
        const html = renderMath(value.expression ?? "", true);
        if (!html) {
          return (
            <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 text-sm">
              {value.expression}
            </pre>
          );
        }
        return (
          <figure className="my-7">
            <div dangerouslySetInnerHTML={{ __html: html }} />
            {value.caption ? <figcaption>{value.caption}</figcaption> : null}
          </figure>
        );
      },

      tableBlock: ({ value }) => <TableBlock value={value} />,
    },

    list: {
      bullet: ({ children }) => <ul>{children}</ul>,
      number: ({ children }) => <ol>{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },

    hardBreak: () => <br />,
  };
}

function headingText(value: unknown): string {
  const node = value as { children?: { text?: string }[] };
  return (node?.children ?? []).map((child) => child.text ?? "").join("");
}

function CodeBlock({
  html,
  code,
  filename,
  language,
}: {
  html?: string;
  code: string;
  filename?: string;
  language?: string;
}) {
  return (
    <div className="group my-7 overflow-hidden rounded-lg border border-border bg-muted">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5">
        <span className="truncate font-mono text-xs text-muted-foreground">
          {filename || language || "code"}
        </span>
        <CopyButton value={code} />
      </div>
      {html ? (
        <div
          className="shiki-block"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="shiki-block">
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

function TableBlock({
  value,
}: {
  value: {
    rows?: { _key?: string; cells?: string[] }[];
    hasHeaderRow?: boolean;
    caption?: string;
  };
}) {
  const rows = value.rows ?? [];
  if (rows.length === 0) return null;

  const [first, ...rest] = rows;
  const headerRow = value.hasHeaderRow ? first : null;
  const bodyRows = value.hasHeaderRow ? rest : rows;

  return (
    <figure className="my-7">
      {/* Wide tables scroll inside this box; the page itself never does. */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-left text-sm">
          {headerRow ? (
            <thead className="bg-muted">
              <tr>
                {(headerRow.cells ?? []).map((cell, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="whitespace-nowrap border-b border-border px-3 py-2 font-medium"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr key={row._key ?? rowIndex} className="border-b border-border last:border-0">
                {(row.cells ?? []).map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {value.caption ? <figcaption>{value.caption}</figcaption> : null}
    </figure>
  );
}

/**
 * The single renderer for every piece of rich text on the site.
 *
 * Async because code blocks are highlighted here, before render, so the
 * Portable Text components below stay synchronous.
 */
export async function Prose({
  value,
  className,
}: {
  value?: RichText | null;
  className?: string;
}) {
  if (!Array.isArray(value) || value.length === 0) return null;

  const codeHtml = new Map<string, string>();
  await Promise.all(
    value.map(async (block) => {
      const node = block as CodeValue & { _type?: string };
      if (node._type !== "codeBlock" || !node._key || !node.code) return;
      codeHtml.set(node._key, await highlight(node.code, node.language));
    }),
  );

  const footnotes = collectFootnotes(value);
  const numbers = new Map(footnotes.map((note) => [note.key, note.number]));

  return (
    <div className={cn("prose", className)}>
      <PortableText value={value} components={buildComponents(codeHtml, numbers)} />

      {footnotes.length > 0 ? (
        <section aria-label="Footnotes" className="mt-12 border-t border-border pt-6">
          <ol className="space-y-2 text-sm text-muted-foreground">
            {footnotes.map((note) => (
              <li key={note.key} id={`fn-${note.number}`} className="scroll-mt-24">
                <span className="mr-2 font-mono text-xs">{note.number}.</span>
                {note.text}{" "}
                <a
                  href={`#fnref-${note.number}`}
                  aria-label={`Back to reference ${note.number}`}
                  className="no-underline"
                >
                  ↩
                </a>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
