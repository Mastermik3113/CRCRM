export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen flex bg-background">{children}</div>;
}
