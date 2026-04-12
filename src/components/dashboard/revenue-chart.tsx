import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const data = [8200, 9100, 7800, 11500, 12800, 14250];
const maxValue = Math.max(...data);

export function RevenueChart() {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-base">Revenue</CardTitle>
              <CardDescription className="text-xs">Monthly rental income</CardDescription>
            </div>
          </div>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-md">
            +12% this month
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3 h-[180px] pt-4">
          {data.map((value, i) => (
            <div key={months[i]} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[11px] font-medium text-muted-foreground">
                ${(value / 1000).toFixed(1)}k
              </span>
              <div className="w-full relative">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-500 hover:from-emerald-600 hover:to-emerald-500"
                  style={{ height: `${(value / maxValue) * 120}px` }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">
                {months[i]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
