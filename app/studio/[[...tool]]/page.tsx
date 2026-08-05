import type { Metadata, Viewport } from "next";
import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";
import { isSanityConfigured, projectId } from "@/sanity/env";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  if (!isSanityConfigured) {
    return <StudioSetupNotice />;
  }

  return <NextStudio config={config} />;
}

/**
 * Rendered instead of the Studio on a fresh clone, so the first run explains
 * itself rather than throwing.
 */
function StudioSetupNotice() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 font-sans">
      <h1 className="text-xl font-semibold tracking-tight">
        Studio isn&apos;t connected yet
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Set <code className="font-mono">NEXT_PUBLIC_SANITY_PROJECT_ID</code> in{" "}
        <code className="font-mono">.env.local</code> and restart the dev
        server. Until then the site renders its built-in seed content.
      </p>
      <pre className="mt-6 overflow-x-auto rounded-md border border-border bg-muted p-4 font-mono text-xs">
        {`npx sanity@latest init --env .env.local`}
      </pre>
      <p className="mt-4 text-sm text-muted-foreground">
        Current project id: <code className="font-mono">{projectId || "—"}</code>
      </p>
    </main>
  );
}
