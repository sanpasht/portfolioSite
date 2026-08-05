/**
 * Structural constants only.
 *
 * Anything a reader sees as *content* (bio, links, hero copy) lives in Sanity,
 * with seed values in `lib/fallback.ts`. This file holds the two things that
 * would need a code change regardless: the site URL and the nav routes.
 */

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/contact", label: "Contact" },
] as const;
