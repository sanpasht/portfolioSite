import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

import { dataset, isSanityConfigured, projectId } from "../env";

const builder = isSanityConfigured
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

export type SanityImage = Image & {
  alt?: string;
  caption?: string;
  asset?: {
    _ref?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number; aspectRatio: number };
    };
  };
};

/** Returns null for missing images so callers can branch instead of guard-typing. */
export function urlForImage(source?: SanityImage | null) {
  if (!builder || !source?.asset) return null;
  return builder.image(source).auto("format").fit("max");
}

export function imageUrl(source?: SanityImage | null, width = 1200) {
  return urlForImage(source)?.width(width).url() ?? null;
}
