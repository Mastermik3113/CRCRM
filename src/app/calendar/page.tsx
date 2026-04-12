import { Calendar } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Vehicle availability and rental timeline
        </p>
      </div>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Calendar View</h3>
          <p className="text-sm text-muted-foreground">
            Visual timeline coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
