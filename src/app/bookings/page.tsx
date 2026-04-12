import { CalendarCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage reservations and active rentals
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No bookings yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first booking to get started
          </p>
        </div>
      </div>
    </div>
  );
}
