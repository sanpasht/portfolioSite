import type { MetadataRoute } from "next";

import { getSitemapEntries } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, projects } = await getSitemapEntries();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/writing`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/now`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];

  return [
    ...staticRoutes,
    ...posts.map((post) => ({
      url: `${siteUrl}/writing/${post.slug}`,
      lastModified: post._updatedAt ?? post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: project._updatedAt ?? project.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
