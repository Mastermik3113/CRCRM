"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, CreditCard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  getClientById,
  getRentalsByClient,
  getPaymentsByRental,
  getVehicleById,
  getClientTotalSpend,
  getVehicleLabel,
} from "@/lib/demo-data";

const rentalStatusStyles: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400" },
  completed: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" },
  reserved: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400" },
  cancelled: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400" },
};

const leadStyles: Record<string, { bg: string; text: string }> = {
  inquiry: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400" },
  contacted: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400" },
  converted: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400" },
  lost: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400" },
};

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const client = getClientById(id);

  if (!client) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Client not found</p>
      </div>
    );
  }

  const rentals = getRentalsByClient(id);
  const totalSpend = getClientTotalSpend(id);
  const activeRentals = rentals.filter((r) => r.status === "active").length;
  const ls = leadStyles[client.lead_status] ?? leadStyles.inquiry;

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-lg font-bold">
              {client.first_name[0]}{client.last_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {client.first_name} {client.last_name}
                </h1>
                <span className={cn("badge-dot inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", ls.bg, ls.text)}>
                  {client.lead_status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Client since {formatDate(client.created_at)} &middot; via {client.lead_source}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="card-hover">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Spend</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalSpend)}</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Rentals</p>
            <p className="text-xl font-bold mt-1">{rentals.length}</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Active Rentals</p>
            <p className="text-xl font-bold text-blue-600 mt-1">{activeRentals}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rentals">Rentals ({rentals.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{client.email ?? "No email"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone ?? "No phone"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{client.address ?? "No address"}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Driver&apos;s License</span>
                <span className="font-medium font-mono">{client.drivers_license_number ?? "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lead Source</span>
                <span className="font-medium capitalize">{client.lead_source}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rentals */}
        <TabsContent value="rentals" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Vehicle</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Period</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Amount</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Paid</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentals.map((rental) => {
                    const vehicle = getVehicleById(rental.vehicle_id);
                    const payments = getPaymentsByRental(rental.id);
                    const paid = payments.reduce((s, p) => s + p.amount, 0);
                    const rs = rentalStatusStyles[rental.status] ?? rentalStatusStyles.active;
                    return (
                      <TableRow key={rental.id}>
                        <TableCell>
                          <Link href={`/vehicles/${rental.vehicle_id}`} className="text-sm font-medium hover:text-primary transition-colors">
                            {vehicle ? getVehicleLabel(vehicle) : "Unknown"}
                          </Link>
                          <p className="text-xs text-muted-foreground">{vehicle?.license_plate}</p>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(rental.start_date)} — {formatDate(rental.end_date)}
                        </TableCell>
                        <TableCell className="text-sm">{formatCurrency(rental.total_amount)}</TableCell>
                        <TableCell className="text-sm font-medium text-emerald-600">{formatCurrency(paid)}</TableCell>
                        <TableCell>
                          <span className={cn("badge-dot inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", rs.bg, rs.text)}>
                            {rental.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {rentals.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No rental history</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="mt-4">
          <Card className="card-hover">
            <CardContent className="flex h-48 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                  <FileText className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="mt-3 text-base font-semibold">No documents uploaded</h3>
                <p className="mt-1 text-sm text-muted-foreground">Upload driver&apos;s license and other documents</p>
                <Button className="mt-3" variant="outline" size="sm">Upload Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes */}
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm">{client.notes ?? "No notes added."}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
