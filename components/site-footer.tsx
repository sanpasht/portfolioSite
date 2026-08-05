import Link from "next/link";

import type { SiteSettings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const links = settings.socialLinks ?? [];

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {year} {settings.name}
        </p>

        <nav aria-label="Elsewhere" className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((link) => (
            <a
              key={link._key ?? link.url}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Link href="/rss.xml" className="transition-colors hover:text-foreground">
            RSS
          </Link>
        </nav>
      </div>
    </footer>
  );
}
