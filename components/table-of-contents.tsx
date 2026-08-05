import type { Heading } from "@/lib/portable-text-utils";
import { cn } from "@/lib/utils";

/**
 * Collapsed by default on phones, open on desktop. A long list of anchors
 * shouldn't stand between the reader and the first paragraph.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;

  return (
    <details
      open
      className="group mb-10 rounded-lg border border-border bg-subtle/60 px-4 py-3 [&[open]>summary]:mb-2"
    >
      <summary className="cursor-pointer list-none text-xs font-medium uppercase tracking-widest text-muted-foreground marker:content-none">
        Contents
      </summary>
      <nav aria-label="Table of contents">
        <ol className="space-y-1.5 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={cn(heading.level === 3 && "pl-4")}
            >
              <a
                href={`#${heading.id}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
