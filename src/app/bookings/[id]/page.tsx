export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
      <p className="text-muted-foreground">
        Rental details, payments, and contract
      </p>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Booking detail view coming soon</p>
      </div>
    </div>
  );
}
