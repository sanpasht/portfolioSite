/**
 * One-time import of the seed content in `lib/fallback.ts` into Sanity.
 *
 *   npm run seed -- --dry-run     show what would be created, write nothing
 *   npm run seed                  create the documents as drafts
 *   npm run seed -- --force       also overwrite drafts that already exist
 *
 * Two safety properties, both deliberate:
 *
 *  - It only ever writes to `drafts.*` ids. A published document cannot be
 *    touched by this script, with or without --force.
 *  - Without --force it skips anything that already exists, so re-running it
 *    after you've started editing is a no-op rather than a rollback.
 *
 * Needs a token with write access (Editor), which is a different token from the
 * read-only one the site uses for previews. Create one at sanity.io/manage
 * under API -> Tokens, then put it in .env.local as SANITY_API_WRITE_TOKEN.
 */

import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

import {
  fallbackAbout,
  fallbackContact,
  fallbackHome,
  fallbackNow,
  fallbackPosts,
  fallbackProjects,
  fallbackSettings,
} from "../lib/fallback";

// Read the env file before touching process.env: static imports have already
// been evaluated by this point, so nothing above depends on these values.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local is fine as long as the variables are set some other way.
}

const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
const token =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

type Doc = Record<string, unknown> & { _id: string; _type: string };

/* -------------------------------------------------------------------------- */
/* Shaping                                                                     */
/* -------------------------------------------------------------------------- */

/** Drops nulls so documents arrive clean rather than full of empty fields. */
function stripEmpty(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .map(stripEmpty)
      .filter((item) => item !== null && item !== undefined);
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      const cleaned = stripEmpty(item);
      if (cleaned !== null && cleaned !== undefined) out[key] = cleaned;
    }
    return out;
  }
  return value;
}

/**
 * Sanity needs a unique `_key` on every object inside an array. The seed data
 * uses readable placeholders that repeat across fields, so they're replaced
 * with fresh ones here. Arrays of plain strings are left alone.
 */
function withKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) =>
      item && typeof item === "object"
        ? { ...(withKeys(item) as object), _key: randomUUID().slice(0, 12) }
        : item,
    );
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = withKeys(item);
    }
    return out;
  }
  return value;
}

function build(id: string, type: string, source: object): Doc {
  const rest = { ...(source as Record<string, unknown>) };
  // The seed objects carry synthetic ids like "seed-project-sime"; the real
  // document id is assigned below.
  delete rest._id;
  const shaped = withKeys(stripEmpty(rest)) as Record<string, unknown>;
  return { ...shaped, _id: id, _type: type };
}

/* -------------------------------------------------------------------------- */
/* Documents                                                                   */
/* -------------------------------------------------------------------------- */

const singletons: Doc[] = [
  build("siteSettings", "siteSettings", fallbackSettings),
  build("homePage", "homePage", fallbackHome),
  build("aboutPage", "aboutPage", fallbackAbout),
  build("nowPage", "nowPage", fallbackNow),
  build("contactPage", "contactPage", fallbackContact),
];

// Projects and posts arrive with visibility "draft" on purpose: the seed text
// is placeholder, so publishing the document should not also put it on the
// site. Flip Visibility to Published once the write-up is real.
const projects: Doc[] = fallbackProjects.map((project) =>
  build(`project-${project.slug}`, "project", {
    ...project,
    slug: { _type: "slug", current: project.slug },
    visibility: "draft",
  }),
);

const posts: Doc[] = fallbackPosts.map((post) =>
  build(`post-${post.slug}`, "post", {
    ...post,
    slug: { _type: "slug", current: post.slug },
    visibility: "draft",
  }),
);

const documents = [...singletons, ...projects, ...posts];

/* -------------------------------------------------------------------------- */
/* Run                                                                         */
/* -------------------------------------------------------------------------- */

async function main() {
  if (!projectId) {
    throw new Error(
      "NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Check .env.local.",
    );
  }
  if (!token) {
    throw new Error(
      "No Sanity token found. Add SANITY_API_WRITE_TOKEN to .env.local " +
        "(sanity.io/manage -> API -> Tokens -> Editor).",
    );
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  console.log(
    `\nProject ${projectId} / ${dataset}${dryRun ? "  (dry run, nothing will be written)" : ""}\n`,
  );

  // One round trip to find out what is already there, published or draft.
  const ids = documents.flatMap((doc) => [doc._id, `drafts.${doc._id}`]);
  const present = new Set<string>(
    await client.fetch<string[]>("*[_id in $ids]._id", { ids }),
  );

  let created = 0;
  let skipped = 0;

  for (const doc of documents) {
    const draftId = `drafts.${doc._id}`;
    const isPublished = present.has(doc._id);
    const hasDraft = present.has(draftId);

    if (isPublished) {
      console.log(`  skip     ${doc._id}  (already published)`);
      skipped += 1;
      continue;
    }
    if (hasDraft && !force) {
      console.log(`  skip     ${doc._id}  (draft exists, use --force to replace)`);
      skipped += 1;
      continue;
    }

    const action = hasDraft ? "replace" : "create";

    if (dryRun) {
      console.log(`  ${action.padEnd(8)} ${doc._id}`);
      created += 1;
      continue;
    }

    const payload = { ...doc, _id: draftId };
    if (hasDraft) {
      await client.createOrReplace(payload);
    } else {
      await client.createIfNotExists(payload);
    }

    console.log(`  ${action.padEnd(8)} ${doc._id}`);
    created += 1;
  }

  const verb = dryRun ? "would be created" : "created";
  console.log(`\n${created} ${verb}, ${skipped} skipped.`);

  if (created > 0 && !dryRun) {
    console.log(
      "\nOpen /studio to review them. Each one is a draft until you press " +
        "Publish.\nProjects and posts also need Visibility set to Published " +
        "before they appear on the site.\n",
    );
  }
}

main().catch((error) => {
  console.error("\nSeed failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
