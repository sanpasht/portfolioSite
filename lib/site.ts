/**
 * Structural constants only.
 *
 * Anything a reader sees as *content* — bio, links, hero copy — lives in Sanity.
 * This file holds the things that would require a code change anyway: routes,
 * and the fallbacks used when the CMS has nothing to say yet.
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
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
] as const;

export const defaultMeta = {
  name: "Sanaullah Pashtoon",
  role: "Software Engineer",
  tagline: "MCS @ UC Irvine · BS Mathematics",
  description:
    "Software engineer working close to the metal — embedded systems, real-time audio, and developer tools.",
} as const;
