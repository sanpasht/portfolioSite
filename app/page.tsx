import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditButton } from "@/components/edit-button";
import { EntryList } from "@/components/entry-list";
import { FadeIn } from "@/components/fade-in";
import { Container, Section } from "@/components/layout-primitives";
import { PostCard } from "@/components/post-card";
import { ProjectCard } from "@/components/project-card";
import { Prose } from "@/components/prose";
import {
  getFeaturedProjects,
  getHomePage,
  getLatestPosts,
  getSettings,
} from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([getHomePage(), getSettings()]);

  return {
    ...buildMetadata({
      seo: home.seo,
      title: `${settings.name} · ${settings.role}`,
      description: settings.description,
      path: "/",
      siteName: settings.name,
      ogSubtitle: settings.tagline ?? settings.role,
    }),
    // The root layout's template would otherwise append the name twice.
    title: { absolute: home.seo?.title || `${settings.name} · ${settings.role}` },
  };
}

export default async function HomePage() {
  const [home, settings] = await Promise.all([getHomePage(), getSettings()]);
  const [featured, latest] = await Promise.all([
    getFeaturedProjects(home),
    home.showLatestWriting === false
      ? Promise.resolve([])
      : getLatestPosts(),
  ]);

  const name = home.heroName || settings.name;
  const subtitle = home.heroSubtitle || settings.tagline;
  const role = home.heroRole || settings.role;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.name,
    jobTitle: settings.role,
    description: settings.description,
    email: `mailto:${settings.email}`,
    url: siteUrl,
    sameAs: (settings.socialLinks ?? [])
      .map((link) => link.url)
      .filter((url) => url.startsWith("http")),
  };

  return (
    <Container className="pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <header className="pt-16 sm:pt-24">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {name}
          </h1>
          <EditButton id="homePage" type="homePage" />
        </div>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          {[subtitle, role].filter(Boolean).join(" · ")}
        </p>
      </header>

      {home.intro ? (
        <FadeIn className="mt-8">
          <Prose value={home.intro} className="max-w-[var(--container-measure)]" />
        </FadeIn>
      ) : null}

      {home.currentFocus && home.currentFocus.length > 0 ? (
        <FadeIn>
          <Section title={home.currentFocusTitle || "Current Focus"}>
            <EntryList items={home.currentFocus} />
          </Section>
        </FadeIn>
      ) : null}

      {featured.length > 0 ? (
        <FadeIn>
          <Section
            title="Featured Projects"
            action={
              <Link
                href="/projects"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                All projects <ArrowRight className="size-3.5" />
              </Link>
            }
          >
            <ul className="-mt-2">
              {featured.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </ul>
          </Section>
        </FadeIn>
      ) : null}

      {latest.length > 0 ? (
        <FadeIn>
          <Section
            title="Latest Writing"
            action={
              <Link
                href="/writing"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                All writing <ArrowRight className="size-3.5" />
              </Link>
            }
          >
            <ul className="-mt-2">
              {latest.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </ul>
          </Section>
        </FadeIn>
      ) : null}
    </Container>
  );
}
