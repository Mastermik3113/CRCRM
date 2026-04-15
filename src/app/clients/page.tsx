"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Mail, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddClientDialog } from "@/components/forms/add-client-dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";
import { listClients, listRentals, listPayments } from "@/lib/api";
import type { Client, LeadStatus, Rental, Payment } from "@/types/database";

const leadStyles: Record<LeadStatus, { bg: string; text: string; label: string }> = {
  inquiry: { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400", label: "Inquiry" },
  contacted: { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400", label: "Contacted" },
  converted: { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-400", label: "Converted" },
  lost: { bg: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-400", label: "Lost" },
};

type FilterStatus = "all" | LeadStatus;

export default function ClientsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [c, r, p] = await Promise.all([listClients(), listRentals(), listPayments()]);
      setClients(c);
      setRentals(r);
      setPayments(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onClientCreated = (c: Client) => setClients((prev) => [c, ...prev]);

  const rentalCountFor = (cid: string) => rentals.filter((r) => r.client_id === cid).length;
  const totalSpendFor = (cid: string) => {
    const rs = rentals.filter((r) => r.client_id === cid);
    return rs.reduce((sum, r) => sum + payments.filter((p) => p.rental_id === r.id).reduce((ps, p) => ps + Number(p.amount), 0), 0);
  };

  const filtered = clients.filter((c) => {
    if (filter !== "all" && c.lead_status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.first_name.toLowerCase().includes(q) ||
        c.last_name.toLowerCase().includes(q) ||
        (c.email?.toLowerCase().includes(q) ?? false) ||
        (c.phone?.includes(q) ?? false)
      );
    }
    return true;
  });

  const counts = {
    all: clients.length,
    converted: clients.filter((c) => c.lead_status === "converted").length,
    inquiry: clients.filter((c) => c.lead_status === "inquiry").length,
    contacted: clients.filter((c) => c.lead_status === "contacted").length,
    lost: clients.filter((c) => c.lead_status === "lost").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">
            {clients.length} clients &middot; {counts.converted} active &middot; {counts.inquiry + counts.contacted} leads
          </p>
        </div>
        <AddClientDialog onCreated={onClientCreated} />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "converted", "inquiry", "contacted"] as FilterStatus[]).map((s) => (
                <Button
                  key={s}
                  variant={filter === s ? "outline" : "ghost"}
                  size="sm"
                  className={cn("text-xs font-medium", filter === s && "border-primary text-primary")}
                  onClick={() => setFilter(s)}
                >
                  {s === "all" ? "All" : leadStyles[s].label}
                  <span className="ml-1.5 text-muted-foreground">
                    {s === "all" ? counts.all : counts[s as keyof typeof counts]}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Client</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Contact</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Status</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Source</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Rentals</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Total Spend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((client) => {
                  const style = leadStyles[client.lead_status];
                  const totalSpend = totalSpendFor(client.id);
                  return (
                    <TableRow
                      key={client.id}
                      onClick={() => router.push(`/clients/${client.id}`)}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold shrink-0">
                            {client.first_name[0]}{client.last_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{client.first_name} {client.last_name}</p>
                            <p className="text-xs text-muted-foreground">DL: {client.drivers_license_number ?? "N/A"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          {client.email && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {client.email}
                            </p>
                          )}
                          {client.phone && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {client.phone}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={cn("badge-dot inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", style.bg, style.text)}>
                          {style.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs capitalize text-muted-foreground">{client.lead_source}</TableCell>
                      <TableCell className="text-sm">{rentalCountFor(client.id)}</TableCell>
                      <TableCell className="text-sm font-medium">
                        {totalSpend > 0 ? formatCurrency(totalSpend) : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {clients.length === 0 ? "No clients yet. Add your first client to get started." : "No clients match your filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
