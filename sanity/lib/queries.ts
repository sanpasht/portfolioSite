import { defineQuery } from "next-sanity";

/**
 * `$preview` is injected by `sanityFetch` and is true only inside draft mode. It
 * relaxes the visibility and scheduling gates so the Presentation tool can show
 * unpublished and future-dated documents without a second set of queries.
 */

const imageFields = /* groq */ `
  ...,
  alt,
  caption,
  asset->{ url, metadata { lqip, dimensions } }
`;

const seoFields = /* groq */ `
  title,
  description,
  noIndex,
  image { ${imageFields} }
`;

const projectSummaryFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  technologies,
  tags,
  status,
  featured,
  date,
  githubUrl,
  demoUrl,
  coverImage { ${imageFields} }
`;

const postSummaryFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  summary,
  publishedAt,
  tags,
  featured,
  coverImage { ${imageFields} },
  "bodyChars": length(pt::text(body))
`;

const visibleProject = /* groq */ `_type == "project" && (visibility == "published" || $preview)`;

const visiblePost = /* groq */ `_type == "post" && (visibility == "published" || $preview) && (publishedAt <= now() || $preview)`;

/* -------------------------------------------------------------------------- */
/* Singletons                                                                  */
/* -------------------------------------------------------------------------- */

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    name,
    role,
    tagline,
    description,
    email,
    location,
    socialLinks[]{ _key, label, url, icon },
    ogImage { ${imageFields} }
  }
`);

export const homePageQuery = defineQuery(`
  *[_type == "homePage"][0]{
    heroName,
    heroSubtitle,
    heroRole,
    intro,
    currentFocusTitle,
    currentFocus[]{ _key, title, detail, url },
    showLatestWriting,
    seo { ${seoFields} },
    "featuredProjects": featuredProjects[]->{ ${projectSummaryFields} }
  }
`);

export const aboutPageQuery = defineQuery(`
  *[_type == "aboutPage"][0]{
    heading,
    lede,
    portrait { ${imageFields} },
    body,
    seo { ${seoFields} }
  }
`);

export const nowPageQuery = defineQuery(`
  *[_type == "nowPage"][0]{
    heading,
    intro,
    currentFocus[]{ _key, title, detail, url },
    building[]{ _key, title, detail, url },
    learning[]{ _key, title, detail, url },
    research[]{ _key, title, detail, url },
    reading[]{ _key, title, author, note, url },
    courses[]{ _key, title, detail, url },
    goals[]{ _key, title, detail, url },
    technologies,
    recentlyFinished[]{ _key, title, detail, url },
    thoughts,
    lastUpdated,
    seo { ${seoFields} }
  }
`);

export const contactPageQuery = defineQuery(`
  *[_type == "contactPage"][0]{
    heading,
    body,
    links[]{ _key, label, url, icon },
    responseNote,
    seo { ${seoFields} }
  }
`);

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export const projectsQuery = defineQuery(`
  *[${visibleProject}] | order(date desc, _createdAt desc){
    ${projectSummaryFields}
  }
`);

export const featuredProjectsQuery = defineQuery(`
  *[${visibleProject} && featured == true] | order(date desc)[0...3]{
    ${projectSummaryFields}
  }
`);

export const projectBySlugQuery = defineQuery(`
  *[${visibleProject} && slug.current == $slug][0]{
    ${projectSummaryFields},
    _updatedAt,
    longDescription,
    architecture,
    challenges,
    lessons,
    futureWork,
    gallery[]{ ${imageFields} },
    seo { ${seoFields} }
  }
`);

export const projectSlugsQuery = defineQuery(`
  *[_type == "project" && visibility == "published" && defined(slug.current)].slug.current
`);

/* -------------------------------------------------------------------------- */
/* Writing                                                                     */
/* -------------------------------------------------------------------------- */

export const postsQuery = defineQuery(`
  *[${visiblePost}] | order(publishedAt desc){
    ${postSummaryFields}
  }
`);

export const latestPostsQuery = defineQuery(`
  *[${visiblePost}] | order(publishedAt desc)[0...3]{
    ${postSummaryFields}
  }
`);

export const postBySlugQuery = defineQuery(`
  *[${visiblePost} && slug.current == $slug][0]{
    ${postSummaryFields},
    _updatedAt,
    body,
    seo { ${seoFields} }
  }
`);

export const postSlugsQuery = defineQuery(`
  *[_type == "post" && visibility == "published" && publishedAt <= now() && defined(slug.current)].slug.current
`);

/** Everything the sitemap needs, in one round trip. */
export const sitemapQuery = defineQuery(`
  {
    "posts": *[_type == "post" && visibility == "published" && publishedAt <= now() && defined(slug.current)]{
      "slug": slug.current, _updatedAt, publishedAt
    },
    "projects": *[_type == "project" && visibility == "published" && defined(slug.current)]{
      "slug": slug.current, _updatedAt, date
    }
  }
`);
