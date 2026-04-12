import { Car, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-sm text-muted-foreground">Manage your fleet inventory</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by make, model, plate..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs font-medium">
                All
              </Button>
              <Button variant="ghost" size="sm" className="text-xs font-medium text-emerald-600">
                Available
              </Button>
              <Button variant="ghost" size="sm" className="text-xs font-medium text-blue-600">
                Rented
              </Button>
              <Button variant="ghost" size="sm" className="text-xs font-medium text-amber-600">
                Maintenance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      <Card className="card-hover">
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Car className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No vehicles yet</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Add your first vehicle to start managing your fleet
            </p>
            <Button className="mt-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Vehicle
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
