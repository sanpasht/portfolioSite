import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook target. Publishing in the Studio revalidates the cached pages
 * within seconds. No redeploy, no code change.
 *
 * Set up once at sanity.io/manage -> API -> Webhooks:
 *   URL:     https://<your-domain>/api/revalidate
 *   Trigger: create, update, delete
 *   Secret:  same value as SANITY_REVALIDATE_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      request,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    if (!body?._type) {
      return new NextResponse("Missing _type in payload", { status: 400 });
    }

    // Coarse on purpose: this site is small, and a full refresh is cheaper to
    // reason about than per-document tag bookkeeping.
    //
    // Next 16 wants a cacheLife profile as the second argument. "max" purges
    // every entry carrying the tag regardless of its own profile, which is what
    // a publish webhook means by "this content changed".
    revalidateTag("sanity", "max");
    revalidateTag(body._type, "max");

    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (error) {
    console.error("[revalidate]", error);
    return new NextResponse("Revalidation failed", { status: 500 });
  }
}
