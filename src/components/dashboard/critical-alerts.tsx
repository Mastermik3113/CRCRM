import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, FileWarning, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/database";

interface Alert {
  id: string;
  type: "insurance" | "registration";
  message: string;
  daysLeft: number;
  vehicleLabel: string;
}

export function CriticalAlerts({ vehicles = [] }: { vehicles?: Vehicle[] }) {
  const now = Date.now();
  const days = (iso: string | null) => {
    if (!iso) return null;
    return Math.round((new Date(iso).getTime() - now) / (24 * 60 * 60 * 1000));
  };

  const alerts: Alert[] = [];
  for (const v of vehicles) {
    const label = `${v.year} ${v.make} ${v.model} (${v.license_plate})`;
    const ins = days(v.insurance_expiry);
    if (ins !== null && ins <= 30) {
      alerts.push({ id: `${v.id}-ins`, type: "insurance", message: "Insurance expiring soon", daysLeft: ins, vehicleLabel: label });
    }
    const reg = days(v.registration_expiry);
    if (reg !== null && reg <= 30) {
      alerts.push({ id: `${v.id}-reg`, type: "registration", message: "Registration expiring soon", daysLeft: reg, vehicleLabel: label });
    }
  }
  alerts.sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <CardTitle className="text-base">Critical Alerts</CardTitle>
            <CardDescription className="text-xs">Requires immediate attention</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <p className="text-sm text-muted-foreground">All clear. Nothing expiring soon.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert) => {
              const isOverdue = alert.daysLeft < 0;
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                    isOverdue && "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30"
                  )}
                >
                  <FileWarning
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isOverdue ? "text-red-500" : "text-amber-500"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {alert.vehicleLabel}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "badge-dot shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      isOverdue
                        ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                    )}
                  >
                    {isOverdue
                      ? `${Math.abs(alert.daysLeft)}d overdue`
                      : `${alert.daysLeft}d left`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
