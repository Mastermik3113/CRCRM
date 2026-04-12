import { Car, Key, DollarSign, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { CriticalAlerts } from "@/components/dashboard/critical-alerts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { FleetChart } from "@/components/dashboard/fleet-chart";
import { formatCurrency } from "@/lib/utils";
import {
  demoVehicles,
  demoRentals,
  demoPayments,
} from "@/lib/demo-data";

// Compute real stats
const totalVehicles = demoVehicles.length;
const maintenanceCount = demoVehicles.filter((v) => v.status === "maintenance").length;
const activeRentals = demoRentals.filter((r) => r.status === "active").length;
const reservedCount = demoRentals.filter((r) => r.status === "reserved").length;

// Revenue this month (April 2026 payments)
const thisMonthPayments = demoPayments.filter((p) => p.payment_date.startsWith("2026-04"));
const revenueThisMonth = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);

// Pending = total of active rentals - total paid for those rentals
const pendingAmount = demoRentals
  .filter((r) => r.status === "active")
  .reduce((sum, r) => {
    const total = r.manual_override_amount ?? r.total_amount;
    const paid = demoPayments
      .filter((p) => p.rental_id === r.id)
      .reduce((s, p) => s + p.amount, 0);
    return sum + Math.max(0, total - paid);
  }, 0);

const pendingInvoices = demoRentals.filter((r) => {
  if (r.status !== "active") return false;
  const total = r.manual_override_amount ?? r.total_amount;
  const paid = demoPayments.filter((p) => p.rental_id === r.id).reduce((s, p) => s + p.amount, 0);
  return paid < total;
}).length;

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here&apos;s your fleet overview.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value={String(totalVehicles)}
          change={`${maintenanceCount} in maintenance`}
          changeType="neutral"
          icon={Car}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          title="Active Rentals"
          value={String(activeRentals)}
          change={`${reservedCount} upcoming reserved`}
          changeType="positive"
          icon={Key}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          title="Revenue This Month"
          value={formatCurrency(revenueThisMonth)}
          change="+12% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          title="Pending Payments"
          value={formatCurrency(pendingAmount)}
          change={`${pendingInvoices} invoices outstanding`}
          changeType={pendingAmount > 0 ? "negative" : "neutral"}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-950"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <FleetChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CriticalAlerts />
        <RecentActivity />
      </div>
    </div>
  );
}
