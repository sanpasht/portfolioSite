"use client";

/**
 * Studio config. Mounted inside the Next app at /studio, so editors sign in
 * once and get click-to-edit previews of the real site.
 */
import { codeInput } from "@sanity/code-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes, singletonTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const singletons = new Set<string>(singletonTypes);

export default defineConfig({
  name: "default",
  title: "Personal site",
  basePath: "/studio",
  projectId,
  dataset,

  schema: {
    types: schemaTypes,
    // Singletons are reached through the desk, never created ad hoc.
    templates: (prev) =>
      prev.filter((template) => !singletons.has(template.schemaType)),
  },

  document: {
    actions: (prev, context) =>
      singletons.has(context.schemaType)
        ? prev.filter(({ action }) =>
            ["publish", "discardChanges", "restore"].includes(action ?? ""),
          )
        : prev,
    // Keeps "New document" from offering the one-off pages.
    newDocumentOptions: (prev) =>
      prev.filter((item) => !singletons.has(item.templateId)),
  },

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: {
        mainDocuments: [
          {
            route: "/writing/:slug",
            filter: '_type == "post" && slug.current == $slug',
          },
          {
            route: "/projects/:slug",
            filter: '_type == "project" && slug.current == $slug',
          },
        ],
        locations: {
          post: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "Untitled",
                  href: `/writing/${doc?.slug}`,
                },
                { title: "Writing index", href: "/writing" },
                { title: "Home", href: "/" },
              ],
            }),
          },
          project: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "Untitled",
                  href: `/projects/${doc?.slug}`,
                },
                { title: "Projects index", href: "/projects" },
                { title: "Home", href: "/" },
              ],
            }),
          },
          // Singletons map to exactly one URL, so their locations are static.
          homePage: { locations: [{ title: "Home", href: "/" }] },
          aboutPage: { locations: [{ title: "About", href: "/about" }] },
          nowPage: { locations: [{ title: "Now", href: "/now" }] },
          contactPage: { locations: [{ title: "Contact", href: "/contact" }] },
        },
      },
    }),
    codeInput(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
