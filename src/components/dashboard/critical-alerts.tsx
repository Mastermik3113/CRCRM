import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, FileWarning, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "insurance" | "registration" | "service";
  message: string;
  daysLeft: number;
  vehicleLabel: string;
}

const iconMap = {
  insurance: FileWarning,
  registration: FileWarning,
  service: Wrench,
};

const demoAlerts: Alert[] = [
  {
    id: "1",
    type: "insurance",
    message: "Insurance expiring soon",
    daysLeft: 5,
    vehicleLabel: "2023 Toyota Camry (ABC-1234)",
  },
  {
    id: "2",
    type: "registration",
    message: "Registration expiring soon",
    daysLeft: 12,
    vehicleLabel: "2022 Honda Civic (XYZ-5678)",
  },
  {
    id: "3",
    type: "service",
    message: "Oil change overdue",
    daysLeft: -3,
    vehicleLabel: "2021 Ford F-150 (DEF-9012)",
  },
];

export function CriticalAlerts() {
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
        <div className="space-y-2">
          {demoAlerts.map((alert) => {
            const Icon = iconMap[alert.type];
            const isOverdue = alert.daysLeft < 0;
            return (
              <div
                key={alert.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                  isOverdue && "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30"
                )}
              >
                <Icon
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
      </CardContent>
    </Card>
  );
}
