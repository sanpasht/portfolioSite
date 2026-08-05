# sanaullahpashtoon.com

Personal site: writing, projects, and the pages around them. Built to be edited
entirely through Sanity — publishing a post or reordering featured projects
never requires a code change or a redeploy.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui ·
Motion · Sanity · Vercel

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
   | `SANITY_API_READ_TOKEN` | Draft mode and live preview | sanity.io/manage → API → Tokens → **Viewer** |
   | `SANITY_REVALIDATE_SECRET` | Instant updates on publish | Any random string you choose |
   | `NEXT_PUBLIC_SITE_URL` | Canonicals, sitemap, RSS, OG images | Your domain, no trailing slash |

3. Restart the dev server and open <http://localhost:3000/studio>. Sign in with
   the account from step 1.

4. Create the four one-off pages (Homepage, About, Now, Contact) and Site
   settings from the left-hand list, then add projects and posts.

Once a document exists in Sanity it overrides the seed content for that page.
Collections behave slightly differently on purpose: an empty Projects list in a
connected dataset renders as empty, rather than quietly showing seed data.

### Publish-time revalidation

At sanity.io/manage → API → Webhooks, add:

- **URL** — `https://<your-domain>/api/revalidate`
- **Dataset** — production
- **Trigger on** — create, update, delete
- **Secret** — the same value as `SANITY_REVALIDATE_SECRET`

Publishing then refreshes the affected pages within seconds. Without it, pages
still refresh on their own hourly revalidation.

---

## Deploying

Import the repo on Vercel and add the same environment variables under Settings
→ Environment Variables. `NEXT_PUBLIC_SITE_URL` should be the production
domain. Nothing else needs configuring; the Studio deploys with the site at
`/studio`.

---

## How editing works

Everything a reader sees is a CMS field. The Studio is organised as:

- **Homepage / About / Now / Contact** — the one-off pages, edited in place.
- **Writing** and **Projects** — split into Published / Drafts / Archived.
- **Site settings** — name, role, description, email, resume, and the links
  used in the footer and on /contact.

Specific behaviours worth knowing:

| Thing | How it works |
| --- | --- |
| **Scheduling** | Set a future *Publish date* on a post. It stays hidden until that moment, then appears on its own. |
| **Draft / Published / Archived** | The *Visibility* field. Only "Published" is public; "Archived" keeps the document but removes it from the site. |
| **Featured project order** | Drag the references in Homepage → *Featured projects*. If that list is empty, the homepage falls back to every project flagged `featured`, newest first. |
| **Live preview** | Studio → Presentation. The site renders beside the editor with click-to-edit overlays and unpublished content visible. |
| **Edit button** | A small "Edit" link appears on each page while in draft mode, jumping straight to that document. It's invisible to signed-out visitors, since draft mode can only be entered through an authenticated Studio session. |
| **Reading time** | Computed from the body. Nothing to set. |
| **Table of contents** | Generated from H2/H3 headings on posts and About, shown when there are at least two. |
| **Resume** | `/resume` redirects to the file uploaded in Site settings, or to the URL set there. |
| **Autosave, version history, rollback, duplicate, drag-and-drop uploads** | Native Sanity behaviour — no configuration needed. Document history is under the ⋯ menu on any document. |
| **Validation** | Required fields block publishing and are listed in the Studio's validation panel. |

One thing from the original spec that isn't here: the Portable Text editor has
no slash-command menu — Sanity doesn't provide one, and bolting on a
third-party editor would trade a decade of stability for a shortcut. Formatting
is on the toolbar and the usual keyboard shortcuts.

### Writing technical posts

The body editor supports code blocks with syntax highlighting and an optional
filename, LaTeX (both a display *Math* block and an inline-math annotation),
tables, images with required alt text, and footnotes. Code and math are
rendered on the server, so the browser downloads no highlighting or typesetting
library.

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
```
