"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Car, Key, DollarSign, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { CriticalAlerts } from "@/components/dashboard/critical-alerts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { FleetChart } from "@/components/dashboard/fleet-chart";
import { formatCurrency } from "@/lib/utils";
import { listVehicles, listRentals, listPayments } from "@/lib/api";
import type { Vehicle, Rental, Payment } from "@/types/database";

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [v, r, p] = await Promise.all([listVehicles(), listRentals(), listPayments()]);
        setVehicles(v);
        setRentals(r);
        setPayments(p);
      } catch {
        // silent — empty state is fine
      }
    })();
  }, []);

  const totalVehicles = vehicles.length;
  const maintenanceCount = vehicles.filter((v) => v.status === "maintenance").length;
  const activeRentals = rentals.filter((r) => r.status === "active").length;
  const reservedCount = rentals.filter((r) => r.status === "reserved").length;

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const revenueThisMonth = payments
    .filter((p) => p.payment_date.startsWith(monthKey))
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pendingAmount = rentals
    .filter((r) => r.status === "active")
    .reduce((sum, r) => {
      const total = Number(r.manual_override_amount ?? r.total_amount);
      const paid = payments
        .filter((p) => p.rental_id === r.id)
        .reduce((s, p) => s + Number(p.amount), 0);
      return sum + Math.max(0, total - paid);
    }, 0);

  const pendingInvoices = rentals.filter((r) => {
    if (r.status !== "active") return false;
    const total = Number(r.manual_override_amount ?? r.total_amount);
    const paid = payments.filter((p) => p.rental_id === r.id).reduce((s, p) => s + Number(p.amount), 0);
    return paid < total;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here&apos;s your fleet overview.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/vehicles" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
          <StatCard
            title="Total Vehicles"
            value={String(totalVehicles)}
            change={`${maintenanceCount} in maintenance`}
            changeType="neutral"
            icon={Car}
            iconColor="text-blue-600"
            iconBg="bg-blue-50 dark:bg-blue-950"
          />
        </Link>
        <Link href="/bookings" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
          <StatCard
            title="Active Rentals"
            value={String(activeRentals)}
            change={`${reservedCount} upcoming reserved`}
            changeType="positive"
            icon={Key}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50 dark:bg-emerald-950"
          />
        </Link>
        <Link href="/payments" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
          <StatCard
            title="Revenue This Month"
            value={formatCurrency(revenueThisMonth)}
            change={payments.length > 0 ? `${payments.length} payments` : "No payments yet"}
            changeType="positive"
            icon={DollarSign}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50 dark:bg-emerald-950"
          />
        </Link>
        <Link href="/payments?filter=pending" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
          <StatCard
            title="Pending Payments"
            value={formatCurrency(pendingAmount)}
            change={`${pendingInvoices} invoices outstanding`}
            changeType={pendingAmount > 0 ? "negative" : "neutral"}
            icon={Clock}
            iconColor="text-amber-600"
            iconBg="bg-amber-50 dark:bg-amber-950"
          />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <FleetChart vehicles={vehicles} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CriticalAlerts vehicles={vehicles} />
        <RecentActivity />
      </div>
    </div>
  );
}
