"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddVehicleDialog } from "@/components/forms/add-vehicle-dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";
import { listVehicles, listRentals, listPayments, listServiceLogs } from "@/lib/api";
import type {
  Vehicle,
  Rental,
  Payment,
  ServiceLog,
  VehicleStatus,
} from "@/types/database";

const statusStyles: Record<VehicleStatus, { bg: string; text: string; label: string }> = {
  available: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", label: "Available" },
  rented: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400", label: "Rented" },
  maintenance: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400", label: "Maintenance" },
  out_of_service: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400", label: "Out of Service" },
};

type FilterStatus = "all" | VehicleStatus;

export default function VehiclesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [v, r, p, s] = await Promise.all([
        listVehicles(),
        listRentals(),
        listPayments(),
        listServiceLogs(),
      ]);
      setVehicles(v);
      setRentals(r);
      setPayments(p);
      setServiceLogs(s);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onVehicleCreated = (v: Vehicle) => {
    setVehicles((prev) => [v, ...prev]);
  };

  const filtered = vehicles.filter((v) => {
    if (filter !== "all" && v.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.license_plate.toLowerCase().includes(q) ||
        v.vin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: vehicles.length,
    available: vehicles.filter((v) => v.status === "available").length,
    rented: vehicles.filter((v) => v.status === "rented").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
  };

  const revenueFor = (vehicleId: string) => {
    const rs = rentals.filter((r) => r.vehicle_id === vehicleId);
    return rs.reduce((sum, r) => {
      const pay = payments.filter((p) => p.rental_id === r.id);
      return sum + pay.reduce((ps, p) => ps + Number(p.amount), 0);
    }, 0);
  };
  const costsFor = (vehicleId: string) =>
    serviceLogs.filter((l) => l.vehicle_id === vehicleId).reduce((s, l) => s + Number(l.cost), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-sm text-muted-foreground">{vehicles.length} vehicles in your fleet</p>
        </div>
        <AddVehicleDialog onCreated={onVehicleCreated} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by make, model, plate, VIN..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "available", "rented", "maintenance"] as FilterStatus[]).map((s) => (
                <Button
                  key={s}
                  variant={filter === s ? "outline" : "ghost"}
                  size="sm"
                  className={cn(
                    "text-xs font-medium",
                    filter === s && "border-primary text-primary"
                  )}
                  onClick={() => setFilter(s)}
                >
                  {s === "all" ? "All" : statusStyles[s].label}
                  <span className="ml-1.5 text-muted-foreground">
                    {s === "all" ? counts.all : counts[s as keyof typeof counts]}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Vehicle</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Plate</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Status</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Odometer</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Daily Rate</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Monthly Rate</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Revenue</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Costs</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((vehicle) => {
                  const style = statusStyles[vehicle.status];
                  const revenue = revenueFor(vehicle.id);
                  const costs = costsFor(vehicle.id);
                  const net = revenue - costs;
                  return (
                    <TableRow
                      key={vehicle.id}
                      onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Car className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                            <p className="text-xs text-muted-foreground">{vehicle.color ?? ""} &middot; VIN: ...{vehicle.vin.slice(-6)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">{vehicle.license_plate}</TableCell>
                      <TableCell>
                        <span className={cn("badge-dot inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", style.bg, style.text)}>
                          {style.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{vehicle.odometer.toLocaleString()} mi</TableCell>
                      <TableCell className="text-sm font-medium">{vehicle.daily_rate != null ? `$${vehicle.daily_rate}/day` : "—"}</TableCell>
                      <TableCell className="text-sm">{vehicle.monthly_rate != null ? `$${vehicle.monthly_rate}/mo` : "—"}</TableCell>
                      <TableCell className="text-sm font-medium text-emerald-600">{revenue > 0 ? formatCurrency(revenue) : "—"}</TableCell>
                      <TableCell className="text-sm text-red-500">{costs > 0 ? formatCurrency(costs) : "—"}</TableCell>
                      <TableCell className={cn("text-sm font-medium", net > 0 ? "text-emerald-600" : net < 0 ? "text-red-500" : "text-muted-foreground")}>
                        {revenue > 0 || costs > 0 ? formatCurrency(net) : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      {vehicles.length === 0 ? "No vehicles yet. Add your first vehicle to get started." : "No vehicles match your filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
