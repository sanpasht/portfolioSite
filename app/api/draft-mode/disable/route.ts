import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();

  const redirectTo = new URL("/", request.url);
  return NextResponse.redirect(redirectTo);
}
