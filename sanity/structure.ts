import { CaseIcon } from "@sanity/icons/Case";
import { ClockIcon } from "@sanity/icons/Clock";
import { CogIcon } from "@sanity/icons/Cog";
import { ComposeIcon } from "@sanity/icons/Compose";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { HomeIcon } from "@sanity/icons/Home";
import { StarIcon } from "@sanity/icons/Star";
import { UserIcon } from "@sanity/icons/User";
import type { StructureResolver } from "sanity/structure";

/**
 * Desk layout: pages you edit once at the top, collections below.
 * Projects and posts each get a Published / Drafts / Archived split so the
 * three-state workflow is visible rather than buried in a field.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("About")
        .icon(UserIcon)
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Now")
        .icon(ClockIcon)
        .child(S.document().schemaType("nowPage").documentId("nowPage")),
      S.listItem()
        .title("Contact")
        .icon(EnvelopeIcon)
        .child(
          S.document().schemaType("contactPage").documentId("contactPage"),
        ),

      S.divider(),

      S.listItem()
        .title("Writing")
        .icon(ComposeIcon)
        .child(
          S.list()
            .title("Writing")
            .items([
              S.listItem()
                .title("Published")
                .icon(DocumentsIcon)
                .child(
                  S.documentTypeList("post")
                    .title("Published posts")
                    .filter('_type == "post" && visibility == "published"')
                    .defaultOrdering([
                      { field: "publishedAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Drafts")
                .icon(ComposeIcon)
                .child(
                  S.documentTypeList("post")
                    .title("Draft posts")
                    .filter('_type == "post" && visibility == "draft"'),
                ),
              S.listItem()
                .title("Archived")
                .child(
                  S.documentTypeList("post")
                    .title("Archived posts")
                    .filter('_type == "post" && visibility == "archived"'),
                ),
              S.divider(),
              S.listItem()
                .title("All posts")
                .child(S.documentTypeList("post").title("All posts")),
            ]),
        ),

      S.listItem()
        .title("Projects")
        .icon(CaseIcon)
        .child(
          S.list()
            .title("Projects")
            .items([
              S.listItem()
                .title("Featured")
                .icon(StarIcon)
                .child(
                  S.documentTypeList("project")
                    .title("Featured projects")
                    .filter('_type == "project" && featured == true')
                    .defaultOrdering([{ field: "date", direction: "desc" }]),
                ),
              S.listItem()
                .title("Published")
                .icon(DocumentsIcon)
                .child(
                  S.documentTypeList("project")
                    .title("Published projects")
                    .filter('_type == "project" && visibility == "published"')
                    .defaultOrdering([{ field: "date", direction: "desc" }]),
                ),
              S.listItem()
                .title("Drafts")
                .child(
                  S.documentTypeList("project")
                    .title("Draft projects")
                    .filter('_type == "project" && visibility == "draft"'),
                ),
              S.listItem()
                .title("Archived")
                .child(
                  S.documentTypeList("project")
                    .title("Archived projects")
                    .filter('_type == "project" && visibility == "archived"'),
                ),
              S.divider(),
              S.listItem()
                .title("All projects")
                .child(S.documentTypeList("project").title("All projects")),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
    ]);
