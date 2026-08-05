import type { Metadata } from "next";
import {
  ArrowUpRight,
  Github,
  Link as LinkIcon,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";

import { EditButton } from "@/components/edit-button";
import { Container } from "@/components/layout-primitives";
import { Prose } from "@/components/prose";
import { getContactPage, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import type { SocialLink } from "@/lib/types";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [contact, settings] = await Promise.all([
    getContactPage(),
    getSettings(),
  ]);

  return buildMetadata({
    seo: contact.seo,
    title: contact.heading || "Contact",
    description: `Get in touch with ${settings.name}.`,
    path: "/contact",
    siteName: settings.name,
  });
}

const icons = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  twitter: Twitter,
  link: LinkIcon,
} as const;

export default async function ContactPage() {
  const [contact, settings] = await Promise.all([
    getContactPage(),
    getSettings(),
  ]);

  // The page's own list wins when set; otherwise the site-wide links.
  const links: SocialLink[] =
    contact.links && contact.links.length > 0
      ? contact.links
      : (settings.socialLinks ?? []);

  return (
    <Container className="pb-8">
      <header className="mb-8 pt-14 sm:pt-20">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {contact.heading}
          </h1>
          <EditButton id="contactPage" type="contactPage" />
        </div>
      </header>

      {contact.body ? <Prose value={contact.body} /> : null}

      <ul className="mt-10 divide-y divide-border border-y border-border">
        <ContactRow
          icon="mail"
          label="Email"
          value={settings.email}
          href={`mailto:${settings.email}`}
        />
        {links
          .filter((link) => link.icon !== "mail")
          .map((link) => (
            <ContactRow
              key={link._key ?? link.url}
              icon={link.icon}
              label={link.label}
              value={link.url.replace(/^https?:\/\/(www\.)?/, "")}
              href={link.url}
            />
          ))}
      </ul>

      {contact.responseNote ? (
        <p className="mt-8 text-sm text-muted-foreground">
          {contact.responseNote}
        </p>
      ) : null}
    </Container>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon?: string | null;
  label: string;
  value: string;
  href: string;
}) {
  const Icon = icons[(icon as keyof typeof icons) ?? "link"] ?? LinkIcon;
  const external = href.startsWith("http");

  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="-mx-3 flex items-center gap-3 rounded-lg px-3 py-4 transition-colors hover:bg-subtle"
      >
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-sm font-medium">{label}</span>
        <span className="ml-auto truncate text-sm text-muted-foreground">
          {value}
        </span>
        {external ? (
          <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" />
        ) : null}
      </a>
    </li>
  );
}
