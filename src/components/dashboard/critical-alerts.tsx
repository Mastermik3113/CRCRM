import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, FileWarning, Wrench } from "lucide-react";

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

// Demo alerts - will be replaced with real data from Supabase
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
  const alerts = demoAlerts;

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Critical Alerts
          </CardTitle>
          <CardDescription>No active alerts</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Critical Alerts
        </CardTitle>
        <CardDescription>
          Items requiring immediate attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = iconMap[alert.type];
            const isOverdue = alert.daysLeft < 0;
            return (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${isOverdue ? "text-destructive" : "text-amber-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {alert.vehicleLabel}
                  </p>
                </div>
                <Badge variant={isOverdue ? "destructive" : "secondary"} className="shrink-0">
                  {isOverdue ? `${Math.abs(alert.daysLeft)}d overdue` : `${alert.daysLeft}d left`}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
