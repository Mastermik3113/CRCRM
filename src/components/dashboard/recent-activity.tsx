import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "rental" | "payment" | "return";
  description: string;
  date: string;
  status: string;
}

const demoActivities: ActivityItem[] = [
  { id: "1", type: "rental", description: "New rental: 2023 Toyota Camry → John Smith", date: "2 hours ago", status: "Active" },
  { id: "2", type: "payment", description: "Payment received: $1,200 via Zelle", date: "5 hours ago", status: "Completed" },
  { id: "3", type: "return", description: "Vehicle returned: 2022 Honda Civic", date: "Yesterday", status: "Completed" },
  { id: "4", type: "rental", description: "New rental: 2021 Ford F-150 → Mike Johnson", date: "Yesterday", status: "Active" },
  { id: "5", type: "payment", description: "Payment received: $800 via Cash", date: "2 days ago", status: "Completed" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Completed: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export function RecentActivity() {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription className="text-xs">Latest transactions and updates</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {demoActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
              <span
                className={cn(
                  "badge-dot shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  statusStyles[activity.status]
                )}
              >
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
