"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Car, DollarSign, Wrench, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  getVehicleById,
  getRentalsByVehicle,
  getServiceLogsByVehicle,
  getPaymentsByRental,
  getClientById,
  demoVehicles,
} from "@/lib/demo-data";

const statusStyles: Record<string, { bg: string; text: string }> = {
  available: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400" },
  rented: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400" },
  maintenance: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400" },
  out_of_service: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400" },
};

const rentalStatusStyles: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400" },
  completed: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" },
  reserved: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400" },
  cancelled: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400" },
};

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const vehicle = getVehicleById(id);

  if (!vehicle) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Vehicle not found</p>
      </div>
    );
  }

  const rentals = getRentalsByVehicle(id);
  const serviceLogs = getServiceLogsByVehicle(id);

  // Calculate revenue
  const totalRevenue = rentals.reduce((sum, r) => {
    const payments = getPaymentsByRental(r.id);
    return sum + payments.reduce((ps, p) => ps + p.amount, 0);
  }, 0);
  const totalServiceCost = serviceLogs.reduce((sum, s) => sum + s.cost, 0);
  const netProfit = totalRevenue - totalServiceCost;
  const style = statusStyles[vehicle.status] ?? statusStyles.available;

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Link href="/vehicles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <span className={cn("badge-dot inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", style.bg, style.text)}>
              {vehicle.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {vehicle.color} &middot; {vehicle.license_plate} &middot; VIN: {vehicle.vin}
          </p>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Revenue Collected</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service Costs</p>
            <p className="text-xl font-bold text-red-500 mt-1">{formatCurrency(totalServiceCost)}</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Net Profit</p>
            <p className={cn("text-xl font-bold mt-1", netProfit >= 0 ? "text-emerald-600" : "text-red-500")}>
              {formatCurrency(netProfit)}
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Rentals</p>
            <p className="text-xl font-bold mt-1">{rentals.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rentals">Rentals ({rentals.length})</TabsTrigger>
          <TabsTrigger value="service">Service Log ({serviceLogs.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Vehicle Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Make", vehicle.make],
                  ["Model", vehicle.model],
                  ["Year", vehicle.year],
                  ["Color", vehicle.color ?? "—"],
                  ["VIN", vehicle.vin],
                  ["License Plate", vehicle.license_plate],
                  ["Odometer", `${vehicle.odometer.toLocaleString()} mi`],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Rates & Compliance</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Daily Rate", vehicle.daily_rate ? `$${vehicle.daily_rate}` : "—"],
                  ["Weekly Rate", vehicle.weekly_rate ? `$${vehicle.weekly_rate}` : "—"],
                  ["Monthly Rate", vehicle.monthly_rate ? `$${vehicle.monthly_rate}` : "—"],
                  ["Insurance Expiry", vehicle.insurance_expiry ? formatDate(vehicle.insurance_expiry) : "—"],
                  ["Registration Expiry", vehicle.registration_expiry ? formatDate(vehicle.registration_expiry) : "—"],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
                {vehicle.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{vehicle.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rentals Tab */}
        <TabsContent value="rentals" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Client</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Period</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Rate</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Collected</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentals.map((rental) => {
                    const client = getClientById(rental.client_id);
                    const payments = getPaymentsByRental(rental.id);
                    const collected = payments.reduce((s, p) => s + p.amount, 0);
                    const rs = rentalStatusStyles[rental.status] ?? rentalStatusStyles.active;
                    return (
                      <TableRow key={rental.id}>
                        <TableCell>
                          <Link href={`/clients/${rental.client_id}`} className="text-sm font-medium hover:text-primary transition-colors">
                            {client ? `${client.first_name} ${client.last_name}` : "Unknown"}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(rental.start_date)} — {formatDate(rental.end_date)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(rental.rate_amount)}/{rental.rate_type === "monthly" ? "mo" : rental.rate_type === "weekly" ? "wk" : "day"}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-emerald-600">{formatCurrency(collected)}</TableCell>
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

        {/* Service Log Tab */}
        <TabsContent value="service" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Service</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Date</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Odometer</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Cost</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Next Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{log.service_type}</p>
                          {log.description && <p className="text-xs text-muted-foreground">{log.description}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(log.service_date)}</TableCell>
                      <TableCell className="text-sm">{log.odometer_at_service?.toLocaleString()} mi</TableCell>
                      <TableCell className="text-sm font-medium text-red-500">{formatCurrency(log.cost)}</TableCell>
                      <TableCell className="text-sm">{log.next_service_date ? formatDate(log.next_service_date) : "—"}</TableCell>
                    </TableRow>
                  ))}
                  {serviceLogs.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No service records</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-4">
          <Card className="card-hover">
            <CardContent className="flex h-48 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                  <FileText className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="mt-3 text-base font-semibold">No documents uploaded</h3>
                <p className="mt-1 text-sm text-muted-foreground">Upload registration, insurance, and other vehicle documents</p>
                <Button className="mt-3" variant="outline" size="sm">Upload Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
