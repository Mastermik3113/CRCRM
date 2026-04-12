export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Client Profile</h1>
      <p className="text-muted-foreground">
        Client details, documents, and rental history
      </p>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Client profile view coming soon</p>
      </div>
    </div>
  );
}
