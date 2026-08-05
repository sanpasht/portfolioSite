import { draftMode } from "next/headers";
import { PenLine } from "lucide-react";

import { isSanityConfigured } from "@/sanity/env";

/**
 * One-click jump from a page to the document behind it.
 *
 * Only rendered in draft mode, which can only be entered through the Studio's
 * Presentation tool — so it never appears for a signed-out visitor.
 */
export async function EditButton({
  id,
  type,
}: {
  id?: string | null;
  type: string;
}) {
  const { isEnabled } = await draftMode();
  if (!isEnabled || !isSanityConfigured || !id) return null;

  // Draft documents carry a `drafts.` prefix; the intent link wants the base id.
  const documentId = id.replace(/^drafts\./, "");

  return (
    <a
      href={`/studio/intent/edit/id=${documentId};type=${type}/`}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      <PenLine className="size-3" />
      Edit
    </a>
  );
}
