import "server-only";

import { draftMode } from "next/headers";

import { client } from "./client";
import { readToken } from "../env";

type FetchOptions = {
  query: string;
  params?: Record<string, unknown>;
  /** Cache tags to revalidate from the Sanity webhook. */
  tags?: string[];
  /** Value returned when Sanity isn't configured or the query fails. */
  fallback: unknown;
  /**
   * Set false for queries that run outside a request, such as
   * `generateStaticParams` and the sitemap. Next 16 throws if `draftMode()` is
   * called there, and those callers only ever want published content anyway.
   */
  allowDrafts?: boolean;
};

/**
 * The single read path for the whole site.
 *
 * Three things it guarantees:
 *  - no configured project, or a failed request, degrades to `fallback`
 *    instead of a 500;
 *  - draft mode reads unpublished documents (needs a read token) and never
 *    caches;
 *  - published reads are tagged so the Sanity webhook can revalidate them.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  fallback,
  allowDrafts = true,
}: FetchOptions & { fallback: T }): Promise<T> {
  if (!client) return fallback;

  const isDraft = allowDrafts ? (await draftMode()).isEnabled : false;

  if (isDraft && !readToken) {
    console.warn(
      "[sanity] Draft mode is on but SANITY_API_READ_TOKEN is unset. Serving published content.",
    );
  }

  const useDrafts = isDraft && Boolean(readToken);

  try {
    const result = await client
      .withConfig(
        useDrafts
          ? {
              token: readToken,
              useCdn: false,
              perspective: "drafts",
              stega: { enabled: true, studioUrl: "/studio" },
            }
          : {},
      )
      .fetch<T>(query, { ...params, preview: useDrafts }, {
        next: useDrafts
          ? { revalidate: 0 }
          : { revalidate: 3600, tags: ["sanity", ...tags] },
        cache: useDrafts ? "no-store" : "force-cache",
      });

    // A GROQ query that matches nothing returns null, not an error.
    return result ?? fallback;
  } catch (error) {
    console.error("[sanity] Query failed, using fallback content:", error);
    return fallback;
  }
}
