import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { EditButton } from "@/components/edit-button";
import { Container } from "@/components/layout-primitives";
import { ProjectLinks } from "@/components/project-card";
import { Prose } from "@/components/prose";
import { Badge } from "@/components/ui/badge";
import { getProject, getProjectSlugs, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import type { RichText } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/image";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([
    getProject(slug),
    getSettings(),
  ]);

  if (!project) return { title: "Project not found" };

  return buildMetadata({
    seo: project.seo,
    title: project.title,
    description: project.shortDescription,
    path: `/projects/${project.slug}`,
    siteName: settings.name,
    type: "article",
    modifiedTime: project._updatedAt,
    ogSubtitle: "Project",
  });
}

const statusLabels: Record<string, string> = {
  "in-progress": "In progress",
  shipped: "Shipped",
  maintained: "Maintained",
  research: "Research",
  archived: "Archived",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const cover = urlForImage(project.coverImage);

  return (
    <Container className="pb-8">
      <div className="pt-10 sm:pt-14">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Projects
        </Link>
      </div>

      <header className="mt-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {project.title}
          </h1>
          <EditButton id={project._id} type="project" />
        </div>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {project.shortDescription}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {project.status ? (
            <Badge variant="accent">
              {statusLabels[project.status] ?? project.status}
            </Badge>
          ) : null}
          {(project.technologies ?? []).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <ProjectLinks
            githubUrl={project.githubUrl}
            demoUrl={project.demoUrl}
          />
          {project.date ? (
            <span className="font-mono text-xs text-muted-foreground">
              {formatDate(project.date)}
            </span>
          ) : null}
        </div>
      </header>

      {cover ? (
        <figure className="mt-10">
          <Image
            src={cover.width(1400).url()}
            alt={project.coverImage?.alt ?? project.title}
            width={project.coverImage?.asset?.metadata?.dimensions?.width ?? 1600}
            height={project.coverImage?.asset?.metadata?.dimensions?.height ?? 900}
            sizes="(min-width: 768px) 700px, 100vw"
            priority
            className="h-auto w-full rounded-lg border border-border"
          />
        </figure>
      ) : null}

      <div className="mt-12 space-y-14">
        <ProjectSection body={project.longDescription} />
        <ProjectSection title="Architecture" body={project.architecture} />
        <ProjectSection title="Challenges" body={project.challenges} />
        <ProjectSection title="Lessons learned" body={project.lessons} />
        <ProjectSection title="Future work" body={project.futureWork} />
      </div>

      {project.gallery && project.gallery.length > 0 ? (
        <section className="mt-14">
          <h2 className="mb-5 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Gallery
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.gallery.map((image, index) => {
              const builder = urlForImage(image);
              if (!builder) return null;
              return (
                <figure key={image.asset?._ref ?? index}>
                  <Image
                    src={builder.width(900).url()}
                    alt={image.alt ?? ""}
                    width={image.asset?.metadata?.dimensions?.width ?? 900}
                    height={image.asset?.metadata?.dimensions?.height ?? 600}
                    sizes="(min-width: 640px) 340px, 100vw"
                    className="h-auto w-full rounded-lg border border-border"
                  />
                  {image.caption ? (
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      {image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              );
            })}
          </div>
        </section>
      ) : null}

      {project.tags && project.tags.length > 0 ? (
        <div className="mt-14 flex flex-wrap gap-1.5 border-t border-border pt-6">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
    </Container>
  );
}

function ProjectSection({
  title,
  body,
}: {
  title?: string;
  body?: RichText | null;
}) {
  if (!Array.isArray(body) || body.length === 0) return null;

  return (
    <section>
      {title ? (
        <h2 className="mb-5 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
      ) : null}
      <Prose value={body} />
    </section>
  );
}
