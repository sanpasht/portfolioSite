import type { Entry, ReadingItem } from "@/lib/types";

export function EntryList({ items }: { items?: Entry[] | null }) {
  if (!items || items.length === 0) return null;

  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={item._key ?? index}>
          <p className="text-[0.95rem] font-medium tracking-tight">
            {item.url ? (
              <a
                href={item.url}
                target={item.url.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.url.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
              >
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </p>
          {item.detail ? (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.detail}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function ReadingList({ items }: { items?: ReadingItem[] | null }) {
  if (!items || items.length === 0) return null;

  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={item._key ?? index}>
          <p className="text-[0.95rem] tracking-tight">
            <span className="font-medium">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </span>
            {item.author ? (
              <span className="text-muted-foreground"> — {item.author}</span>
            ) : null}
          </p>
          {item.note ? (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.note}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
