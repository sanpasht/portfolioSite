import { redirect } from "next/navigation";

import { getSettings } from "@/lib/content";

/**
 * /resume is a redirect rather than a page so the destination stays a CMS
 * field — swap the PDF in Sanity and the link updates everywhere at once.
 */
export async function GET() {
  const settings = await getSettings();
  redirect(settings.resumeUrl || "/resume.pdf");
}
