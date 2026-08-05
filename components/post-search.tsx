"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { readingTime } from "@/lib/portable-text-utils";
import type { PostSummary } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

/**
 * Client-side filtering over the full index.
 *
 * The post list is small enough to ship whole, which keeps search instant and
 * means the page still works with JavaScript disabled — the unfiltered list is
 * what renders on the server.
 */
export function PostSearch({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = React.useState("");
  const [activeTag, setActiveTag] = React.useState<string | null>(null);

  const tags = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [posts]);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeTag && !(post.tags ?? []).includes(activeTag)) return false;
      if (!needle) return true;
      const haystack = [post.title, post.summary, ...(post.tags ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [posts, query, activeTag]);

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search writing"
          aria-label="Search writing"
          className="pl-9"
        />
      </div>

      {tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => {
            const active = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(active ? null : tag)}
                aria-pressed={active}
                className="rounded-md focus-visible:outline-none"
              >
                <Badge
                  variant={active ? "accent" : "default"}
                  className={cn(
                    "cursor-pointer transition-colors",
                    !active && "hover:text-foreground",
                  )}
                >
                  {tag}
                </Badge>
              </button>
            );
          })}
        </div>
      ) : null}

      <p className="mt-6 text-xs text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "post" : "posts"}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Nothing matches that.
        </p>
      ) : (
        <ul className="mt-2">
          {filtered.map((post) => (
            <li key={post._id} className="border-b border-border last:border-0">
              <Link
                href={`/writing/${post.slug}`}
                className="-mx-3 block rounded-lg px-3 py-5 transition-colors hover:bg-subtle"
              >
                <h2 className="text-base font-medium tracking-tight">
                  {post.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {post.summary}
                </p>
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  {formatDate(post.publishedAt)} ·{" "}
                  {readingTime(post.bodyChars)} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
