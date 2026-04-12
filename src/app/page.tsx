import { Car, Key, DollarSign, Clock, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { CriticalAlerts } from "@/components/dashboard/critical-alerts";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { FleetChart } from "@/components/dashboard/fleet-chart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here&apos;s your fleet overview.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value="12"
          change="2 new this month"
          changeType="neutral"
          icon={Car}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-950"
        />
        <StatCard
          title="Active Rentals"
          value="8"
          change="+3 from last week"
          changeType="positive"
          icon={Key}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          title="Revenue This Month"
          value="$14,250"
          change="+12% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          title="Pending Payments"
          value="$3,400"
          change="4 invoices outstanding"
          changeType="negative"
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-950"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <FleetChart />
      </div>

      {/* Alerts + Activity Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CriticalAlerts />
        <RecentActivity />
      </div>
    </div>
  );
}
