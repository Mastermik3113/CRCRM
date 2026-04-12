import { Car, Key, DollarSign, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { CriticalAlerts } from "@/components/dashboard/critical-alerts";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your rental business
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value="12"
          description="3 in maintenance"
          icon={Car}
        />
        <StatCard
          title="Active Rentals"
          value="8"
          description="2 ending this week"
          icon={Key}
        />
        <StatCard
          title="Revenue This Month"
          value="$14,250"
          description="+12% from last month"
          icon={DollarSign}
        />
        <StatCard
          title="Pending Payments"
          value="$3,400"
          description="4 invoices outstanding"
          icon={Clock}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CriticalAlerts />
        <RecentActivity />
      </div>
    </div>
  );
}
