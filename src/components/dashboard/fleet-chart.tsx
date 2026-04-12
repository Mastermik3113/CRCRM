import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { demoVehicles } from "@/lib/demo-data";

const total = demoVehicles.length;
const available = demoVehicles.filter((v) => v.status === "available").length;
const rented = demoVehicles.filter((v) => v.status === "rented").length;
const maintenance = demoVehicles.filter((v) => v.status === "maintenance").length;
const outOfService = demoVehicles.filter((v) => v.status === "out_of_service").length;

const fleetData = [
  { label: "Available", value: available, color: "bg-emerald-500", percentage: Math.round((available / total) * 100) },
  { label: "Rented", value: rented, color: "bg-blue-500", percentage: Math.round((rented / total) * 100) },
  { label: "Maintenance", value: maintenance, color: "bg-amber-500", percentage: Math.round((maintenance / total) * 100) },
  ...(outOfService > 0 ? [{ label: "Out of Service", value: outOfService, color: "bg-red-500", percentage: Math.round((outOfService / total) * 100) }] : []),
];

export function FleetChart() {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950">
            <PieChart className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <CardTitle className="text-base">Fleet Utilization</CardTitle>
            <CardDescription className="text-xs">{total} vehicles total</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4 mb-6">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
            {fleetData.map((item) => (
              <div
                key={item.label}
                className={cn("h-full transition-all duration-500", item.color)}
                style={{ width: `${item.percentage}%` }}
              />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {fleetData.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("h-3 w-3 rounded-full", item.color)} />
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{item.value}</span>
                <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
