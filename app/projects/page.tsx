import type { Metadata } from "next";

import { FadeIn } from "@/components/fade-in";
import { Container, PageHeader } from "@/components/layout-primitives";
import { ProjectCard } from "@/components/project-card";
import { getProjects, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: "Projects",
    description: `Things ${settings.name} has designed and built — systems work, embedded projects, and tools.`,
    path: "/projects",
    siteName: settings.name,
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <Container className="pb-8">
      <PageHeader
        title="Projects"
        description="Things I've built, with the reasoning behind them. Write-ups cover architecture, what was hard, and what I'd do differently."
      />

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No published projects yet.
        </p>
      ) : (
        <FadeIn>
          <ul>
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </ul>
        </FadeIn>
      )}
    </Container>
  );
}
