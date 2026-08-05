import type { Metadata, Viewport } from "next";
import { draftMode } from "next/headers";
import { Inter, JetBrains_Mono } from "next/font/google";
import { VisualEditing } from "next-sanity/visual-editing";

import "./globals.css";

import { DraftModeBar } from "@/components/draft-mode-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.name} · ${settings.role}`,
      template: `%s · ${settings.name}`,
    },
    description: settings.description,
    authors: [{ name: settings.name }],
    creator: settings.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: settings.name,
      title: `${settings.name} · ${settings.role}`,
      description: settings.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.name} · ${settings.role}`,
      description: settings.description,
    },
    alternates: {
      canonical: "/",
      types: { "application/rss+xml": `${siteUrl}/rss.xml` },
    },
    icons: { icon: "/favicon.ico" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfdfc" },
    { media: "(prefers-color-scheme: dark)", color: "#111214" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, { isEnabled: isDraft }] = await Promise.all([
    getSettings(),
    draftMode(),
  ]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm"
          >
            Skip to content
          </a>

          <DraftModeBar />
          <SiteHeader name={settings.name} />

          <main id="main" className="flex-1">
            {children}
          </main>

          <SiteFooter settings={settings} />

          {isDraft ? <VisualEditing /> : null}
        </ThemeProvider>
      </body>
    </html>
  );
}
