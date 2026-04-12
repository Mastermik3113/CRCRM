import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-emerald-600",
  iconBg = "bg-emerald-50",
}: StatCardProps) {
  return (
    <Card className="card-hover border border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <p
                className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  changeType === "positive" && "text-emerald-600",
                  changeType === "negative" && "text-red-500",
                  changeType === "neutral" && "text-muted-foreground"
                )}
              >
                {changeType === "positive" && "↑"}
                {changeType === "negative" && "↓"}
                {change}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl",
              iconBg
            )}
          >
            <Icon className={cn("h-5.5 w-5.5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
