import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

/**
 * `null` when no project id is configured, so callers fall back to seed content
 * rather than crashing on a half-configured environment.
 */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
      stega: {
        // Overlays are enabled per-request in draft mode; off by default so
        // published HTML stays free of encoded metadata.
        enabled: false,
        studioUrl: "/studio",
      },
    })
  : null;
