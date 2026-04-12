import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

const fleetData = [
  { label: "Available", value: 8, color: "bg-emerald-500", textColor: "text-emerald-500", percentage: 67 },
  { label: "Rented", value: 3, color: "bg-blue-500", textColor: "text-blue-500", percentage: 25 },
  { label: "Maintenance", value: 1, color: "bg-amber-500", textColor: "text-amber-500", percentage: 8 },
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
            <CardDescription className="text-xs">Current vehicle status breakdown</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Horizontal stacked bar */}
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

        {/* Legend */}
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
