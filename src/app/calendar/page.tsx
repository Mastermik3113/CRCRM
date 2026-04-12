import { Calendar, GanttChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">Vehicle availability and rental timeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs font-medium">
            <GanttChart className="mr-1.5 h-3.5 w-3.5" />
            Timeline
          </Button>
          <Button variant="outline" size="sm" className="text-xs font-medium">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            Monthly
          </Button>
        </div>
      </div>

      <Card className="card-hover">
        <CardContent className="flex h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <GanttChart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Gantt Timeline & Calendar</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md">
              Visual timeline showing vehicle availability and active rentals.
              Toggle between Gantt and monthly calendar views.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
