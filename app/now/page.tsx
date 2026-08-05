import type { Metadata } from "next";

import { EditButton } from "@/components/edit-button";
import { EntryList, ReadingList } from "@/components/entry-list";
import { FadeIn } from "@/components/fade-in";
import { Container, Section } from "@/components/layout-primitives";
import { Prose } from "@/components/prose";
import { Badge } from "@/components/ui/badge";
import { getNowPage, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [now, settings] = await Promise.all([getNowPage(), getSettings()]);

  return buildMetadata({
    seo: now.seo,
    title: now.heading || "Now",
    description: `What ${settings.name} is working on, reading, and thinking about right now.`,
    path: "/now",
    siteName: settings.name,
  });
}

export default async function NowPage() {
  const now = await getNowPage();

  // `filled` is checked here rather than inside the children so an empty
  // section drops out of the page entirely, heading included.
  const filled = (list?: unknown[] | null) => Array.isArray(list) && list.length > 0;

  const sections: { title: string; show: boolean; content: React.ReactNode }[] = [
    {
      title: "Current Focus",
      show: filled(now.currentFocus),
      content: <EntryList items={now.currentFocus} />,
    },
    {
      title: "Building",
      show: filled(now.building),
      content: <EntryList items={now.building} />,
    },
    {
      title: "Learning",
      show: filled(now.learning),
      content: <EntryList items={now.learning} />,
    },
    {
      title: "Research",
      show: filled(now.research),
      content: <EntryList items={now.research} />,
    },
    {
      title: "Reading",
      show: filled(now.reading),
      content: <ReadingList items={now.reading} />,
    },
    {
      title: "Courses",
      show: filled(now.courses),
      content: <EntryList items={now.courses} />,
    },
    {
      title: "Goals",
      show: filled(now.goals),
      content: <EntryList items={now.goals} />,
    },
    {
      title: "Technologies",
      show: filled(now.technologies),
      content: (
        <div className="flex flex-wrap gap-1.5">
          {(now.technologies ?? []).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      ),
    },
    {
      title: "Recently Finished",
      show: filled(now.recentlyFinished),
      content: <EntryList items={now.recentlyFinished} />,
    },
    {
      title: "Thoughts",
      show: filled(now.thoughts),
      content: <Prose value={now.thoughts} />,
    },
  ];

  const visible = sections.filter((section) => section.show);

  return (
    <Container className="pb-8">
      <header className="mb-8 pt-14 sm:pt-20">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {now.heading}
          </h1>
          <EditButton id="nowPage" type="nowPage" />
        </div>

        {now.lastUpdated ? (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Last updated{" "}
            <time dateTime={now.lastUpdated}>{formatDate(now.lastUpdated)}</time>
          </p>
        ) : null}
      </header>

      {now.intro ? <Prose value={now.intro} /> : null}

      {visible.map((section, index) => (
        <FadeIn key={section.title} delay={index < 3 ? index * 0.04 : 0}>
          <Section title={section.title}>{section.content}</Section>
        </FadeIn>
      ))}
    </Container>
  );
}
