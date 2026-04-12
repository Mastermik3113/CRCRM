import { CalendarCheck, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground">Manage reservations and active rentals</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      {/* Status Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="text-xs font-medium">All</Button>
              <Button variant="ghost" size="sm" className="text-xs font-medium text-blue-600">Reserved</Button>
              <Button variant="ghost" size="sm" className="text-xs font-medium text-emerald-600">Active</Button>
              <Button variant="ghost" size="sm" className="text-xs font-medium text-slate-600">Completed</Button>
              <Button variant="ghost" size="sm" className="text-xs font-medium text-red-600">Cancelled</Button>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search bookings..." className="pl-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <CalendarCheck className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No bookings yet</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Create your first booking to start tracking rentals
            </p>
            <Button className="mt-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create First Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
