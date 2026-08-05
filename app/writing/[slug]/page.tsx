import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { EditButton } from "@/components/edit-button";
import { Container } from "@/components/layout-primitives";
import { Prose } from "@/components/prose";
import { TableOfContents } from "@/components/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { getPost, getPostSlugs, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { extractHeadings, readingTime } from "@/lib/portable-text-utils";
import { siteUrl } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { imageUrl, urlForImage } from "@/sanity/lib/image";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);

  if (!post) return { title: "Post not found" };

  return buildMetadata({
    seo: post.seo,
    title: post.title,
    description: post.summary,
    path: `/writing/${post.slug}`,
    siteName: settings.name,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post._updatedAt,
    ogSubtitle: formatDate(post.publishedAt),
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);

  if (!post) notFound();

  const headings = extractHeadings(post.body);
  const minutes = readingTime(post.bodyChars ?? post.body);
  const cover = urlForImage(post.coverImage);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt ?? post.publishedAt,
    author: { "@type": "Person", name: settings.name, url: siteUrl },
    mainEntityOfPage: `${siteUrl}/writing/${post.slug}`,
    ...(imageUrl(post.coverImage, 1200)
      ? { image: imageUrl(post.coverImage, 1200) }
      : {}),
  };

  return (
    <Container className="pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="pt-10 sm:pt-14">
        <Link
          href="/writing"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Writing
        </Link>
      </div>

      <article className="mt-8">
        <header>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {post.title}
            </h1>
            <EditButton id={post._id} type="post" />
          </div>

          <p className="mt-4 font-mono text-xs text-muted-foreground">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>{" "}
            · {minutes} min read
          </p>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {post.summary}
          </p>
        </header>

        {cover ? (
          <figure className="my-10">
            <Image
              src={cover.width(1400).url()}
              alt={post.coverImage?.alt ?? post.title}
              width={post.coverImage?.asset?.metadata?.dimensions?.width ?? 1600}
              height={post.coverImage?.asset?.metadata?.dimensions?.height ?? 900}
              sizes="(min-width: 768px) 700px, 100vw"
              priority
              className="h-auto w-full rounded-lg border border-border"
            />
            {post.coverImage?.caption ? (
              <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                {post.coverImage.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : (
          <hr className="my-10 border-border" />
        )}

        <TableOfContents headings={headings} />

        <Prose value={post.body} />
      </article>

      <footer className="mt-14 border-t border-border pt-6">
        {post.tags && post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        {post._updatedAt ? (
          <p className="mt-5 text-xs text-muted-foreground">
            Last updated {formatDate(post._updatedAt)}
          </p>
        ) : null}
      </footer>
    </Container>
  );
}
