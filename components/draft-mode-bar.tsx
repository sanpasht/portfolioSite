import { draftMode } from "next/headers";

export async function DraftModeBar() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-accent px-4 py-1.5 text-xs text-accent-foreground">
      <span>Draft mode: you&apos;re seeing unpublished content.</span>
      <a href="/api/draft-mode/disable" className="underline underline-offset-2">
        Exit
      </a>
    </div>
  );
}
