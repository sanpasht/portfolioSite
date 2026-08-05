import type { SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./documents/aboutPage";
import { contactPage } from "./documents/contactPage";
import { homePage } from "./documents/homePage";
import { nowPage } from "./documents/nowPage";
import { post } from "./documents/post";
import { project } from "./documents/project";
import { siteSettings } from "./documents/siteSettings";
import { entry, readingItem, socialLink } from "./objects/entry";
import { imageWithAlt } from "./objects/imageWithAlt";
import { mathBlock } from "./objects/mathBlock";
import { richText, simpleText } from "./objects/richText";
import { seo } from "./objects/seo";
import { tableBlock, tableRow } from "./objects/tableBlock";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  project,
  post,
  siteSettings,
  homePage,
  aboutPage,
  nowPage,
  contactPage,
  // Objects
  richText,
  simpleText,
  imageWithAlt,
  mathBlock,
  tableBlock,
  tableRow,
  entry,
  readingItem,
  socialLink,
  seo,
];

/** Documents that exist exactly once — surfaced as single items in the Studio. */
export const singletonTypes = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "nowPage",
  "contactPage",
] as const;
