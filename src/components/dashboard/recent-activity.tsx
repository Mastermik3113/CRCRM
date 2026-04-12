import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  type: "rental" | "payment" | "return";
  description: string;
  date: string;
  status: string;
}

// Demo data - will be replaced with real Supabase queries
const demoActivities: Activity[] = [
  {
    id: "1",
    type: "rental",
    description: "New rental: 2023 Toyota Camry to John Smith",
    date: "Apr 12, 2026",
    status: "Active",
  },
  {
    id: "2",
    type: "payment",
    description: "Payment received: $1,200 via Zelle",
    date: "Apr 11, 2026",
    status: "Completed",
  },
  {
    id: "3",
    type: "return",
    description: "Vehicle returned: 2022 Honda Civic by Jane Doe",
    date: "Apr 10, 2026",
    status: "Completed",
  },
  {
    id: "4",
    type: "rental",
    description: "New rental: 2021 Ford F-150 to Mike Johnson",
    date: "Apr 9, 2026",
    status: "Active",
  },
  {
    id: "5",
    type: "payment",
    description: "Payment received: $800 via Cash",
    date: "Apr 8, 2026",
    status: "Completed",
  },
];

const statusVariant: Record<string, "default" | "secondary"> = {
  Active: "default",
  Completed: "secondary",
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest transactions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {demoActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between gap-4 rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
              <Badge variant={statusVariant[activity.status] ?? "secondary"} className="shrink-0">
                {activity.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
