import Link from "next/link";

import { Container } from "@/components/layout-primitives";

export default function NotFound() {
  return (
    <Container className="pb-8">
      <div className="pt-24 sm:pt-32">
        <p className="font-mono text-xs text-muted-foreground">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          Not found
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          That page doesn&apos;t exist, or it moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm text-accent underline underline-offset-4"
        >
          Back home
        </Link>
      </div>
    </Container>
  );
}
