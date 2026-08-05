import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/sanity/lib/client";
import { readToken } from "@/sanity/env";

/**
 * Entered from the Studio's Presentation tool. `defineEnableDraftMode` validates
 * the signed preview URL against Sanity before setting the cookie, so this route
 * can't be used to read drafts without a Studio session.
 */
const handler =
  client && readToken
    ? defineEnableDraftMode({ client: client.withConfig({ token: readToken }) })
        .GET
    : async () =>
        new Response(
          "Draft mode needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN.",
          { status: 501 },
        );

export const GET = handler;
