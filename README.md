# San Pashtoon

Personal site: writing, projects, and the pages around them. Built to be edited
entirely through Sanity, so publishing a post or reordering featured projects
never requires a code change or a redeploy.

**Stack:** Next.js (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Motion,
Sanity, Vercel

---

## Running it

```bash
npm install
npm run dev
```

The site works immediately with no configuration. Until Sanity is connected it
renders the seed content in [`lib/fallback.ts`](lib/fallback.ts), so every route
is browsable on a fresh clone.

---

## Connecting Sanity

1. Create the project and dataset:

   ```bash
   npx sanity@latest init --env .env.local
   ```

   Pick "production" as the dataset. This writes
   `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` into
   `.env.local`.

2. Copy the rest of the variables from
   [`.env.local.example`](.env.local.example) into the same file:

   | Variable | Needed for | Where it comes from |
   | --- | --- | --- |
   | `SANITY_API_READ_TOKEN` | Draft mode and live preview | sanity.io/manage, API, Tokens, **Viewer** |
   | `SANITY_REVALIDATE_SECRET` | Instant updates on publish | Any random string you choose |
   | `NEXT_PUBLIC_SITE_URL` | Canonicals, sitemap, RSS, OG images | Your domain, no trailing slash |

3. Restart the dev server and open <http://localhost:3000/studio>. Sign in with
   the account from step 1.

4. Create the four one-off pages (Homepage, About, Now, Contact) and Site
   settings from the left-hand list, then add projects and posts.

Once a document exists in Sanity it overrides the seed content for that page.
Collections behave slightly differently on purpose: an empty Projects list in a
connected dataset renders as empty, rather than quietly showing seed data.

### Importing the seed content (optional, one time)

The pages render seed text from `lib/fallback.ts` before Sanity has anything in
it. That text lives in the codebase, not the dataset, so opening the Studio
gives you a blank editor rather than something to revise.

If you'd rather edit than retype, import it once:

```bash
npm run seed -- --dry-run
```

That lists what it would create and writes nothing. When the list looks right,
drop the flag:

```bash
npm run seed
```

It needs a token with **Editor** rights in `.env.local` as
`SANITY_API_WRITE_TOKEN`, which is a different token from the read-only one
used for previews. Delete it afterwards if you like; the site never reads it.

Everything arrives as a **draft**, so nothing reaches the site until you press
Publish. Projects and posts also arrive with Visibility set to Draft, because
their seed descriptions are placeholders.

Two things the script will not do:

- It only ever writes to `drafts.*` ids, so a published document cannot be
  overwritten by it under any circumstances, `--force` included.
- It skips anything that already exists. Re-running it after you've started
  editing changes nothing. Pass `--force` to replace existing *drafts*, which
  does discard edits in those drafts.

### Publish-time revalidation

At sanity.io/manage, under API, Webhooks, add:

- **URL:** `https://<your-domain>/api/revalidate`
- **Dataset:** production
- **Trigger on:** create, update, delete
- **Secret:** the same value as `SANITY_REVALIDATE_SECRET`

Publishing then refreshes the affected pages within seconds. Without it, pages
still refresh on their own hourly revalidation.

---

## Editing and publishing

You edit at `/studio`. There is no separate admin login for the site itself:
authorization is your Sanity account, and only the people you invite to the
Sanity project can sign in.

**To publish:** open a document, fill it in, set *Visibility* to Published, and
press **Publish**. Required fields block publishing until they're filled.

**To see changes before they're live:** open **Presentation** from the top of
the Studio. The site loads beside the editor, showing unpublished content, with
click-to-edit overlays. A small **Edit** button also appears on each page while
you're in that mode, jumping straight to the document behind it. Both disappear
for signed-out visitors, because that mode can only be entered through an
authenticated Studio session.

**To add another editor:** sanity.io/manage, your project, Members, Invite.
Editor role is enough to write and publish.

The Studio is organised as:

- **Homepage / About / Now / Contact:** the one-off pages, edited in place.
- **Writing** and **Projects:** split into Published, Drafts, and Archived.
- **Site settings:** name, role, description, email, and the links used in the
  footer and on /contact.

Specific behaviours worth knowing:

| Thing | How it works |
| --- | --- |
| **Scheduling** | Set a future *Publish date* on a post. It stays hidden until that moment, then appears on its own. |
| **Draft / Published / Archived** | The *Visibility* field. Only "Published" is public. "Archived" keeps the document but removes it from the site. |
| **Featured project order** | Drag the references in Homepage, *Featured projects*. If that list is empty, the homepage falls back to every project flagged `featured`, newest first. |
| **Reading time** | Computed from the body. Nothing to set. |
| **Table of contents** | Generated from H2/H3 headings on posts and About, shown when there are at least two. |
| **Autosave, version history, rollback, duplicate, drag-and-drop uploads** | Native Sanity behaviour, no configuration needed. Document history is under the three-dot menu on any document. |
| **Validation** | Required fields block publishing and are listed in the Studio's validation panel. |

One thing from the original spec that isn't here: the Portable Text editor has
no slash-command menu. Sanity doesn't provide one, and bolting on a third-party
editor would trade a decade of stability for a shortcut. Formatting is on the
toolbar and the usual keyboard shortcuts.

### Writing technical posts

The body editor supports code blocks with syntax highlighting and an optional
filename, LaTeX (both a display *Math* block and an inline-math annotation),
tables, images with required alt text, and footnotes. Code and math are
rendered on the server, so the browser downloads no highlighting or typesetting
library.

---

## Deploying

Import the repo on Vercel and add the same environment variables under Settings,
Environment Variables. `NEXT_PUBLIC_SITE_URL` should be the production domain.
Nothing else needs configuring; the Studio deploys with the site at `/studio`.

---

## Layout

```
app/                 Routes. One folder per page, plus rss.xml, sitemap, robots,
                     the OG image generator, and the embedded Studio.
components/          UI. `prose.tsx` is the single rich-text renderer.
lib/                 Content accessors, types, metadata, fallback seed content.
sanity/              Schemas, GROQ queries, client, and desk structure.
sanity.config.ts     Studio configuration.
```

Two files carry most of the design decisions: `app/globals.css` holds every
colour, radius, and typographic rule as a token, and `lib/content.ts` is the
only place that reads from Sanity.

---

## Commands

```bash
npm run dev        # dev server
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run seed       # one-time import of seed content into Sanity as drafts
```
