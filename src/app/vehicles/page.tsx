"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { demoVehicles, getRentalsByVehicle, getPaymentsByRental, getServiceLogsByVehicle } from "@/lib/demo-data";
import type { VehicleStatus } from "@/types/database";

const statusStyles: Record<VehicleStatus, { bg: string; text: string; label: string }> = {
  available: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", label: "Available" },
  rented: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400", label: "Rented" },
  maintenance: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400", label: "Maintenance" },
  out_of_service: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400", label: "Out of Service" },
};

type FilterStatus = "all" | VehicleStatus;

export default function VehiclesPage() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = demoVehicles.filter((v) => {
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
    all: demoVehicles.length,
    available: demoVehicles.filter((v) => v.status === "available").length,
    rented: demoVehicles.filter((v) => v.status === "rented").length,
    maintenance: demoVehicles.filter((v) => v.status === "maintenance").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-sm text-muted-foreground">{demoVehicles.length} vehicles in your fleet</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
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
                const rentals = getRentalsByVehicle(vehicle.id);
                const revenue = rentals.reduce((sum, r) => {
                  const payments = getPaymentsByRental(r.id);
                  return sum + payments.reduce((ps, p) => ps + p.amount, 0);
                }, 0);
                const costs = getServiceLogsByVehicle(vehicle.id).reduce((s, l) => s + l.cost, 0);
                const net = revenue - costs;
                return (
                  <TableRow key={vehicle.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <Link href={`/vehicles/${vehicle.id}`} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Car className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                          <p className="text-xs text-muted-foreground">{vehicle.color} &middot; VIN: ...{vehicle.vin.slice(-6)}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">{vehicle.license_plate}</TableCell>
                    <TableCell>
                      <span className={cn("badge-dot inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", style.bg, style.text)}>
                        {style.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{vehicle.odometer.toLocaleString()} mi</TableCell>
                    <TableCell className="text-sm font-medium">${vehicle.daily_rate}/day</TableCell>
                    <TableCell className="text-sm">${vehicle.monthly_rate}/mo</TableCell>
                    <TableCell className="text-sm font-medium text-emerald-600">{revenue > 0 ? formatCurrency(revenue) : "—"}</TableCell>
                    <TableCell className="text-sm text-red-500">{costs > 0 ? formatCurrency(costs) : "—"}</TableCell>
                    <TableCell className={cn("text-sm font-medium", net > 0 ? "text-emerald-600" : net < 0 ? "text-red-500" : "text-muted-foreground")}>
                      {revenue > 0 || costs > 0 ? formatCurrency(net) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
