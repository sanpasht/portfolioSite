export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/**
 * The whole site is built to render before Sanity exists. Every data helper
 * checks this first and falls back to the seed content in `lib/fallback.ts`,
 * so `npm run dev` works on a fresh clone with no env file at all.
 */
export const isSanityConfigured = projectId.length > 0;

export const readToken = process.env.SANITY_API_READ_TOKEN || "";
