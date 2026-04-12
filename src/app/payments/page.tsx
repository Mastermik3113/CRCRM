import { CreditCard, Search, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogPaymentDialog } from "@/components/forms/log-payment-dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">Track payments and security deposits</p>
        </div>
        <LogPaymentDialog />
      </div>

      {/* Payment Summary */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatCard
          title="Collected This Month"
          value="$10,850"
          change="+8% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          title="Pending"
          value="$3,400"
          change="4 outstanding"
          changeType="negative"
          icon={CreditCard}
          iconColor="text-amber-600"
          iconBg="bg-amber-50 dark:bg-amber-950"
        />
        <StatCard
          title="Deposits Held"
          value="$4,500"
          change="6 active deposits"
          changeType="neutral"
          icon={CreditCard}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-950"
        />
      </div>

      <Card className="card-hover">
        <CardContent className="flex h-48 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No payments recorded</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Payments will appear here once bookings are created
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
