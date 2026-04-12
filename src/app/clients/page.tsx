import { Users, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">Manage clients and track leads</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Tabs for views */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs font-medium">All Clients</Button>
              <Button variant="ghost" size="sm" className="text-xs font-medium">Leads Pipeline</Button>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search clients..." className="pl-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No clients yet</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              Add your first client to start tracking rentals and leads
            </p>
            <Button className="mt-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Client
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
