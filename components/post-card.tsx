import Link from "next/link";

import type { PostSummary } from "@/lib/types";
import { readingTime } from "@/lib/portable-text-utils";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <li className="group border-b border-border last:border-0">
      <Link
        href={`/writing/${post.slug}`}
        className="-mx-3 block rounded-lg px-3 py-5 transition-colors hover:bg-subtle"
      >
        <h3 className="text-base font-medium tracking-tight">{post.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {post.summary}
        </p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          {formatDate(post.publishedAt)} · {readingTime(post.bodyChars)} min read
        </p>
      </Link>
    </li>
  );
}
