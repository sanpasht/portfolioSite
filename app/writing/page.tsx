import type { Metadata } from "next";

import { Container, PageHeader } from "@/components/layout-primitives";
import { PostSearch } from "@/components/post-search";
import { getPosts, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: "Writing",
    description: `Essays and notes by ${settings.name} on systems programming, performance, and mathematics.`,
    path: "/writing",
    siteName: settings.name,
  });
}

export default async function WritingPage() {
  const posts = await getPosts();

  return (
    <Container className="pb-8">
      <PageHeader
        title="Writing"
        description="Notes on systems programming, performance, correctness, and the mathematics underneath them."
      />

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing published yet.</p>
      ) : (
        <PostSearch posts={posts} />
      )}
    </Container>
  );
}
