import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackOfficePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Back Office</h1>
          <p className="text-muted-foreground">
            Expenses, reporting, and business operations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Log Expense
        </Button>
      </div>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Back Office</h3>
          <p className="text-sm text-muted-foreground">
            Expense tracking and P&L reporting coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
