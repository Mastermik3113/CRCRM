"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewBookingDialog } from "@/components/forms/new-booking-dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { listRentals, listClients, listVehicles, listPayments } from "@/lib/api";
import type { Rental, RentalStatus, Client, Vehicle, Payment } from "@/types/database";

const statusStyles: Record<RentalStatus, { bg: string; text: string; label: string }> = {
  reserved: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400", label: "Reserved" },
  active: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", label: "Active" },
  completed: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", label: "Completed" },
  cancelled: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400", label: "Cancelled" },
};

type FilterStatus = "all" | RentalStatus;

export default function BookingsPage() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [r, c, v, p] = await Promise.all([listRentals(), listClients(), listVehicles(), listPayments()]);
      setRentals(r);
      setClients(c);
      setVehicles(v);
      setPayments(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRentalCreated = (r: Rental) => setRentals((prev) => [r, ...prev]);

  const getClient = (cid: string) => clients.find((c) => c.id === cid);
  const getVehicle = (vid: string) => vehicles.find((v) => v.id === vid);
  const vehicleLabel = (v: Vehicle) => `${v.year} ${v.make} ${v.model}`;

  const filtered = rentals.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const client = getClient(r.client_id);
      const vehicle = getVehicle(r.vehicle_id);
      return (
        (client ? `${client.first_name} ${client.last_name}`.toLowerCase().includes(q) : false) ||
        (vehicle ? vehicleLabel(vehicle).toLowerCase().includes(q) : false)
      );
    }
    return true;
  });

  const counts = {
    all: rentals.length,
    active: rentals.filter((r) => r.status === "active").length,
    reserved: rentals.filter((r) => r.status === "reserved").length,
    completed: rentals.filter((r) => r.status === "completed").length,
    cancelled: rentals.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            {counts.active} active &middot; {counts.reserved} reserved &middot; {counts.completed} completed
          </p>
        </div>
        <NewBookingDialog vehicles={vehicles} clients={clients} onCreated={onRentalCreated} />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by client or vehicle..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "active", "reserved", "completed"] as FilterStatus[]).map((s) => (
                <Button
                  key={s}
                  variant={filter === s ? "outline" : "ghost"}
                  size="sm"
                  className={cn("text-xs font-medium", filter === s && "border-primary text-primary")}
                  onClick={() => setFilter(s)}
                >
                  {s === "all" ? "All" : statusStyles[s].label}
                  <span className="ml-1.5 text-muted-foreground">{counts[s as keyof typeof counts]}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Client</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Vehicle</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Period</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Total</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Paid</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Deposit</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((rental) => {
                  const client = getClient(rental.client_id);
                  const vehicle = getVehicle(rental.vehicle_id);
                  const paid = payments.filter((p) => p.rental_id === rental.id).reduce((s, p) => s + Number(p.amount), 0);
                  const total = Number(rental.manual_override_amount ?? rental.total_amount);
                  const ss = statusStyles[rental.status];
                  return (
                    <TableRow key={rental.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <Link href={`/clients/${rental.client_id}`} className="text-sm font-medium hover:text-primary transition-colors">
                          {client ? `${client.first_name} ${client.last_name}` : "—"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/vehicles/${rental.vehicle_id}`} className="text-sm hover:text-primary transition-colors">
                          {vehicle ? vehicleLabel(vehicle) : "—"}
                        </Link>
                        <p className="text-xs text-muted-foreground">{vehicle?.license_plate}</p>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(rental.start_date)} — {formatDate(rental.end_date)}
                      </TableCell>
                      <TableCell className="text-sm font-medium">{formatCurrency(total)}</TableCell>
                      <TableCell className={cn("text-sm font-medium", paid >= total ? "text-emerald-600" : "text-amber-600")}>
                        {formatCurrency(paid)}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                          rental.deposit_status === "held" ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" :
                          rental.deposit_status === "returned" ? "bg-slate-100 text-slate-600 dark:bg-slate-800" :
                          "bg-amber-50 text-amber-600 dark:bg-amber-950"
                        )}>
                          {formatCurrency(Number(rental.security_deposit_amount))} ({rental.deposit_status})
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn("badge-dot inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", ss.bg, ss.text)}>
                          {ss.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {rentals.length === 0 ? "No bookings yet. Create your first rental to get started." : "No bookings match your filters."}
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
