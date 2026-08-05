/**
 * The Studio owns its whole viewport. No site chrome, no site typography.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
