import { Car, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">Manage your fleet</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <Car className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No vehicles yet</h3>
          <p className="text-sm text-muted-foreground">
            Add your first vehicle to get started
          </p>
        </div>
      </div>
    </div>
  );
}
