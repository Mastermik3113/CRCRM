export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Vehicle Details</h1>
      <p className="text-muted-foreground">
        Vehicle profile, documents, and service history
      </p>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Vehicle detail view coming soon</p>
      </div>
    </div>
  );
}
