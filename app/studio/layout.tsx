/**
 * The Studio owns its whole viewport — no site chrome, no site typography.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
