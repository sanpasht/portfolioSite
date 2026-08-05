import type { Metadata } from "next";

import { imageUrl } from "@/sanity/lib/image";

import { siteUrl } from "./site";
import type { Seo } from "./types";

/**
 * One place that decides how a page describes itself. Every route funnels
 * through here so titles, canonicals, and share images can't drift apart.
 */
export function buildMetadata({
  seo,
  title,
  description,
  path,
  siteName,
  type = "website",
  publishedTime,
  modifiedTime,
  ogSubtitle,
}: {
  seo?: Seo | null;
  title: string;
  description: string;
  path: string;
  siteName: string;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  ogSubtitle?: string;
}): Metadata {
  const resolvedTitle = seo?.title || title;
  const resolvedDescription = seo?.description || description;
  const url = `${siteUrl}${path}`;

  // A hand-picked share image wins; otherwise one is generated from the title.
  const ogImage =
    imageUrl(seo?.image, 1200) ??
    `${siteUrl}/api/og?${new URLSearchParams({
      title: resolvedTitle,
      ...(ogSubtitle ? { subtitle: ogSubtitle } : {}),
    })}`;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: path },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      siteName,
      title: resolvedTitle,
      description: resolvedDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: resolvedTitle }],
      ...(type === "article"
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? undefined,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
  };
}
