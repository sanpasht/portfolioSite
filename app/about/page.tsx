import type { Metadata } from "next";
import Image from "next/image";

import { EditButton } from "@/components/edit-button";
import { Container } from "@/components/layout-primitives";
import { Prose } from "@/components/prose";
import { TableOfContents } from "@/components/table-of-contents";
import { getAboutPage, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { extractHeadings, toPlainText } from "@/lib/portable-text-utils";
import { urlForImage } from "@/sanity/lib/image";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [about, settings] = await Promise.all([getAboutPage(), getSettings()]);

  return buildMetadata({
    seo: about.seo,
    title: about.heading || "About",
    description:
      about.lede || toPlainText(about.body).slice(0, 160) || settings.description,
    path: "/about",
    siteName: settings.name,
  });
}

export default async function AboutPage() {
  const about = await getAboutPage();
  const headings = extractHeadings(about.body);
  const portrait = urlForImage(about.portrait);

  return (
    <Container className="pb-8">
      <header className="mb-10 pt-14 sm:pt-20">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {about.heading}
          </h1>
          <EditButton id="aboutPage" type="aboutPage" />
        </div>
        {about.lede ? (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {about.lede}
          </p>
        ) : null}
      </header>

      {portrait ? (
        <figure className="mb-10">
          <Image
            src={portrait.width(900).url()}
            alt={about.portrait?.alt ?? ""}
            width={about.portrait?.asset?.metadata?.dimensions?.width ?? 900}
            height={about.portrait?.asset?.metadata?.dimensions?.height ?? 1200}
            sizes="(min-width: 640px) 320px, 100vw"
            priority
            className="h-auto w-full max-w-xs rounded-lg border border-border"
          />
        </figure>
      ) : null}

      <TableOfContents headings={headings} />

      <Prose value={about.body} />
    </Container>
  );
}
