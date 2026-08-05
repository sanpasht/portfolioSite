import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ProjectSummary } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  "in-progress": "In progress",
  shipped: "Shipped",
  maintained: "Maintained",
  research: "Research",
  archived: "Archived",
};

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <li className="group border-b border-border last:border-0">
      <Link
        href={`/projects/${project.slug}`}
        className="-mx-3 block rounded-lg px-3 py-5 transition-colors hover:bg-subtle"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-base font-medium tracking-tight">
            {project.title}
          </h3>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {formatShortDate(project.date)}
          </span>
        </div>

        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {project.shortDescription}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {project.status ? (
            <Badge variant="accent">
              {statusLabels[project.status] ?? project.status}
            </Badge>
          ) : null}
          {(project.technologies ?? []).slice(0, 5).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </Link>
    </li>
  );
}

export function ProjectLinks({
  githubUrl,
  demoUrl,
}: {
  githubUrl?: string | null;
  demoUrl?: string | null;
}) {
  if (!githubUrl && !demoUrl) return null;

  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {githubUrl ? (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-accent transition-opacity hover:opacity-80"
        >
          Source <ArrowUpRight className="size-3.5" />
        </a>
      ) : null}
      {demoUrl ? (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-accent transition-opacity hover:opacity-80"
        >
          Demo <ArrowUpRight className="size-3.5" />
        </a>
      ) : null}
    </div>
  );
}
