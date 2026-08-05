import "server-only";

import { isSanityConfigured } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  aboutPageQuery,
  contactPageQuery,
  featuredProjectsQuery,
  homePageQuery,
  latestPostsQuery,
  nowPageQuery,
  postBySlugQuery,
  postSlugsQuery,
  postsQuery,
  projectBySlugQuery,
  projectSlugsQuery,
  projectsQuery,
  siteSettingsQuery,
  sitemapQuery,
} from "@/sanity/lib/queries";

import {
  fallbackAbout,
  fallbackContact,
  fallbackHome,
  fallbackNow,
  fallbackPosts,
  fallbackProjects,
  fallbackSettings,
} from "./fallback";
import type {
  AboutPage,
  ContactPage,
  HomePage,
  NowPage,
  Post,
  PostSummary,
  Project,
  ProjectSummary,
  SiteSettings,
} from "./types";

/**
 * Two fallback rules, applied consistently:
 *
 *  - Singleton *pages* always fall back to seed content when the document is
 *    missing, so no route can ever render as an empty shell.
 *  - *Collections* fall back only when Sanity isn't configured at all. Once
 *    it is, an empty list is the truth and the UI says so.
 */

export async function getSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<SiteSettings | null>({
    query: siteSettingsQuery,
    tags: ["siteSettings"],
    fallback: null,
  });
  return data ?? fallbackSettings;
}

export async function getHomePage(): Promise<HomePage> {
  const data = await sanityFetch<HomePage | null>({
    query: homePageQuery,
    tags: ["homePage", "project"],
    fallback: null,
  });
  return data ?? fallbackHome;
}

export async function getAboutPage(): Promise<AboutPage> {
  const data = await sanityFetch<AboutPage | null>({
    query: aboutPageQuery,
    tags: ["aboutPage"],
    fallback: null,
  });
  return data ?? fallbackAbout;
}

export async function getNowPage(): Promise<NowPage> {
  const data = await sanityFetch<NowPage | null>({
    query: nowPageQuery,
    tags: ["nowPage"],
    fallback: null,
  });
  return data ?? fallbackNow;
}

export async function getContactPage(): Promise<ContactPage> {
  const data = await sanityFetch<ContactPage | null>({
    query: contactPageQuery,
    tags: ["contactPage"],
    fallback: null,
  });
  return data ?? fallbackContact;
}

export async function getProjects(): Promise<ProjectSummary[]> {
  return sanityFetch<ProjectSummary[]>({
    query: projectsQuery,
    tags: ["project"],
    fallback: isSanityConfigured ? [] : fallbackProjects,
  });
}

/**
 * Homepage ordering: the hand-ordered list on the Homepage document wins, so
 * drag-and-drop in the Studio is authoritative. Otherwise every project flagged
 * `featured`, newest first.
 */
export async function getFeaturedProjects(
  home: HomePage,
): Promise<ProjectSummary[]> {
  const curated = home.featuredProjects?.filter(Boolean) ?? [];
  if (curated.length > 0) return curated;

  return sanityFetch<ProjectSummary[]>({
    query: featuredProjectsQuery,
    tags: ["project"],
    fallback: isSanityConfigured
      ? []
      : fallbackProjects.filter((project) => project.featured).slice(0, 3),
  });
}

export async function getProject(slug: string): Promise<Project | null> {
  return sanityFetch<Project | null>({
    query: projectBySlugQuery,
    params: { slug },
    tags: ["project"],
    fallback: isSanityConfigured
      ? null
      : (fallbackProjects.find((project) => project.slug === slug) ?? null),
  });
}

export async function getProjectSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: projectSlugsQuery,
    allowDrafts: false,
    tags: ["project"],
    fallback: isSanityConfigured
      ? []
      : fallbackProjects.map((project) => project.slug),
  });
}

export async function getPosts(): Promise<PostSummary[]> {
  return sanityFetch<PostSummary[]>({
    query: postsQuery,
    tags: ["post"],
    fallback: isSanityConfigured ? [] : fallbackPosts,
  });
}

export async function getLatestPosts(): Promise<PostSummary[]> {
  return sanityFetch<PostSummary[]>({
    query: latestPostsQuery,
    tags: ["post"],
    fallback: isSanityConfigured ? [] : fallbackPosts.slice(0, 3),
  });
}

export async function getPost(slug: string): Promise<Post | null> {
  return sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post"],
    fallback: isSanityConfigured
      ? null
      : (fallbackPosts.find((post) => post.slug === slug) ?? null),
  });
}

export async function getPostSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: postSlugsQuery,
    allowDrafts: false,
    tags: ["post"],
    fallback: isSanityConfigured ? [] : fallbackPosts.map((post) => post.slug),
  });
}

type SitemapEntries = {
  posts: { slug: string; _updatedAt?: string; publishedAt?: string }[];
  projects: { slug: string; _updatedAt?: string; date?: string }[];
};

export async function getSitemapEntries(): Promise<SitemapEntries> {
  return sanityFetch<SitemapEntries>({
    query: sitemapQuery,
    allowDrafts: false,
    tags: ["post", "project"],
    fallback: isSanityConfigured
      ? { posts: [], projects: [] }
      : {
          posts: fallbackPosts.map((post) => ({
            slug: post.slug,
            publishedAt: post.publishedAt,
          })),
          projects: fallbackProjects.map((project) => ({
            slug: project.slug,
            date: project.date ?? undefined,
          })),
        },
  });
}
