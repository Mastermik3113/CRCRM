"use client";

import { useEffect, useState } from "react";
import { CreditCard, DollarSign, Loader2 } from "lucide-react";
import { LogPaymentDialog } from "@/components/forms/log-payment-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { listPayments, listRentals, listClients, listVehicles } from "@/lib/api";
import type { Payment, Rental, Client, Vehicle } from "@/types/database";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [p, r, c, v] = await Promise.all([listPayments(), listRentals(), listClients(), listVehicles()]);
      setPayments(p);
      setRentals(r);
      setClients(c);
      setVehicles(v);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onPaymentCreated = (p: Payment) => setPayments((prev) => [p, ...prev]);

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const collectedThisMonth = payments
    .filter((p) => p.payment_date.startsWith(monthKey))
    .reduce((s, p) => s + Number(p.amount), 0);

  const pending = rentals
    .filter((r) => r.status === "active")
    .reduce((sum, r) => {
      const total = Number(r.manual_override_amount ?? r.total_amount);
      const paid = payments.filter((p) => p.rental_id === r.id).reduce((s, p) => s + Number(p.amount), 0);
      return sum + Math.max(0, total - paid);
    }, 0);

  const pendingCount = rentals.filter((r) => {
    if (r.status !== "active") return false;
    const total = Number(r.manual_override_amount ?? r.total_amount);
    const paid = payments.filter((p) => p.rental_id === r.id).reduce((s, p) => s + Number(p.amount), 0);
    return paid < total;
  }).length;

  const depositsHeld = rentals
    .filter((r) => r.deposit_status === "held")
    .reduce((s, r) => s + Number(r.security_deposit_amount), 0);
  const depositCount = rentals.filter((r) => r.deposit_status === "held").length;

  const sorted = [...payments].sort((a, b) => b.payment_date.localeCompare(a.payment_date));

  const getClient = (cid: string) => clients.find((c) => c.id === cid);
  const getVehicle = (vid: string) => vehicles.find((v) => v.id === vid);
  const getRental = (rid: string) => rentals.find((r) => r.id === rid);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">Track payments and security deposits</p>
        </div>
        <LogPaymentDialog rentals={rentals} clients={clients} vehicles={vehicles} onCreated={onPaymentCreated} />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatCard
          title="Collected This Month"
          value={formatCurrency(collectedThisMonth)}
          change={`${payments.filter((p) => p.payment_date.startsWith(monthKey)).length} payments`}
          changeType="positive"
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          title="Pending"
          value={formatCurrency(pending)}
          change={`${pendingCount} outstanding`}
          changeType={pending > 0 ? "negative" : "neutral"}
          icon={CreditCard}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-950"
        />
        <StatCard
          title="Deposits Held"
          value={formatCurrency(depositsHeld)}
          change={`${depositCount} active deposits`}
          changeType="neutral"
          icon={CreditCard}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-950"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex h-48 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No payments recorded yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Click &quot;Log Payment&quot; to record your first payment.
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Date</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Client</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Vehicle</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Method</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Reference</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((p) => {
                  const rental = getRental(p.rental_id);
                  const client = rental ? getClient(rental.client_id) : null;
                  const vehicle = rental ? getVehicle(rental.vehicle_id) : null;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm">{formatDate(p.payment_date)}</TableCell>
                      <TableCell className="text-sm">
                        {client ? `${client.first_name} ${client.last_name}` : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "—"}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                          "bg-muted text-muted-foreground"
                        )}>
                          {p.payment_method}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{p.reference_number ?? "—"}</TableCell>
                      <TableCell className="text-sm font-medium text-right text-emerald-600">
                        {formatCurrency(Number(p.amount))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
