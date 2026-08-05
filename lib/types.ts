import type { PortableTextBlock } from "@portabletext/types";

import type { SanityImage } from "@/sanity/lib/image";

export type RichText = PortableTextBlock[];

export type Seo = {
  title?: string | null;
  description?: string | null;
  image?: SanityImage | null;
  noIndex?: boolean | null;
};

export type Entry = {
  _key?: string;
  title: string;
  detail?: string | null;
  url?: string | null;
};

export type ReadingItem = {
  _key?: string;
  title: string;
  author?: string | null;
  note?: string | null;
  url?: string | null;
};

export type SocialLink = {
  _key?: string;
  label: string;
  url: string;
  icon?: string | null;
};

export type SiteSettings = {
  name: string;
  role: string;
  tagline?: string | null;
  description: string;
  email: string;
  location?: string | null;
  socialLinks?: SocialLink[] | null;
  ogImage?: SanityImage | null;
};

export type ProjectSummary = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  technologies?: string[] | null;
  tags?: string[] | null;
  status?: string | null;
  featured?: boolean | null;
  date?: string | null;
  coverImage?: SanityImage | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
};

export type Project = ProjectSummary & {
  _updatedAt?: string | null;
  longDescription?: RichText | null;
  architecture?: RichText | null;
  challenges?: RichText | null;
  lessons?: RichText | null;
  futureWork?: RichText | null;
  gallery?: SanityImage[] | null;
  seo?: Seo | null;
};

export type PostSummary = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  tags?: string[] | null;
  featured?: boolean | null;
  coverImage?: SanityImage | null;
  /** Body length in characters, computed in GROQ so listings can show read time. */
  bodyChars?: number | null;
};

export type Post = PostSummary & {
  _updatedAt?: string | null;
  body?: RichText | null;
  seo?: Seo | null;
};

export type HomePage = {
  heroName?: string | null;
  heroSubtitle?: string | null;
  heroRole?: string | null;
  intro?: RichText | null;
  currentFocusTitle?: string | null;
  currentFocus?: Entry[] | null;
  featuredProjects?: ProjectSummary[] | null;
  showLatestWriting?: boolean | null;
  seo?: Seo | null;
};

export type AboutPage = {
  heading: string;
  lede?: string | null;
  portrait?: SanityImage | null;
  body?: RichText | null;
  seo?: Seo | null;
};

export type NowPage = {
  heading: string;
  intro?: RichText | null;
  currentFocus?: Entry[] | null;
  building?: Entry[] | null;
  learning?: Entry[] | null;
  research?: Entry[] | null;
  reading?: ReadingItem[] | null;
  courses?: Entry[] | null;
  goals?: Entry[] | null;
  technologies?: string[] | null;
  recentlyFinished?: Entry[] | null;
  thoughts?: RichText | null;
  lastUpdated?: string | null;
  seo?: Seo | null;
};

export type ContactPage = {
  heading: string;
  body?: RichText | null;
  links?: SocialLink[] | null;
  responseNote?: string | null;
  seo?: Seo | null;
};
