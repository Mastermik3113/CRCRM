import { Building2, Plus, Receipt, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";

export default function BackOfficePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Back Office</h1>
          <p className="text-sm text-muted-foreground">Expenses, reporting, and business operations</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Log Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatCard
          title="Total Expenses (Month)"
          value="$4,320"
          change="-5% from last month"
          changeType="positive"
          icon={TrendingDown}
          iconColor="text-red-600"
          iconBg="bg-red-50 dark:bg-red-950"
        />
        <StatCard
          title="Net Profit (Month)"
          value="$9,930"
          change="+18% from last month"
          changeType="positive"
          icon={Receipt}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          title="Profit Margin"
          value="69.7%"
          change="Healthy range"
          changeType="neutral"
          icon={Building2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-950"
        />
      </div>

      {/* Expense categories + table */}
      <Card className="card-hover">
        <CardContent className="flex h-48 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Expense Tracking</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Log and categorize business expenses with receipt uploads
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
