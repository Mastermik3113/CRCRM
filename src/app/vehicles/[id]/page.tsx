"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Upload,
  Download,
  Trash2,
  Edit2,
  Save,
  X,
  Plus,
  StickyNote,
  Clock,
  Loader2,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  getVehicle,
  listServiceLogsByVehicle,
  listRentals,
  listPayments,
  listClients,
  updateVehicle,
  createServiceLog,
  updateServiceLog,
  deleteServiceLog,
} from "@/lib/api";
import { EditVehicleDialog } from "@/components/forms/edit-vehicle-dialog";
import { ServiceLogDialog } from "@/components/forms/service-log-dialog";
import type { ServiceLog, Vehicle, Rental, Payment, Client } from "@/types/database";

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

type TabId = "overview" | "rentals" | "service" | "documents" | "notes";

interface DemoDocument {
  id: string;
  name: string;
  type: string;
  expiry?: string;
  uploadedAt: string;
  size: string;
}

interface DemoNote {
  id: string;
  content: string;
  createdAt: string;
  author: string;
}

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [editVehicleOpen, setEditVehicleOpen] = useState(false);

  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceDialogMode, setServiceDialogMode] = useState<"add" | "edit">("add");
  const [editingServiceLog, setEditingServiceLog] = useState<ServiceLog | null>(null);

  const [documents, setDocuments] = useState<DemoDocument[]>([]);

  const [notes, setNotes] = useState<DemoNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [v, logs, allRentals, allPayments, allClients] = await Promise.all([
          getVehicle(id),
          listServiceLogsByVehicle(id),
          listRentals(),
          listPayments(),
          listClients(),
        ]);
        if (cancelled) return;
        setVehicle(v);
        setServiceLogs(logs);
        setRentals(allRentals.filter((r) => r.vehicle_id === id));
        setPayments(allPayments);
        setClients(allClients);
        if (v?.notes) {
          setNotes([{ id: "vn1", content: v.notes, createdAt: new Date(v.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }), author: "Admin" }]);
        }
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Failed to load vehicle");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (loadError || !vehicle) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">{loadError ?? "Vehicle not found"}</p>
      </div>
    );
  }

  const getClientById = (cid: string) => clients.find((c) => c.id === cid);

  const openAddServiceLog = () => {
    setServiceDialogMode("add");
    setEditingServiceLog(null);
    setServiceDialogOpen(true);
  };

  const openEditServiceLog = (log: ServiceLog) => {
    setServiceDialogMode("edit");
    setEditingServiceLog(log);
    setServiceDialogOpen(true);
  };

  const handleSaveServiceLog = async (saved: ServiceLog) => {
    try {
      const existing = serviceLogs.find((l) => l.id === saved.id);
      const persisted = existing
        ? await updateServiceLog(saved.id, {
            vehicle_id: saved.vehicle_id,
            service_type: saved.service_type,
            description: saved.description,
            cost: saved.cost,
            service_date: saved.service_date,
            next_service_date: saved.next_service_date,
            odometer_at_service: saved.odometer_at_service,
          })
        : await createServiceLog({
            vehicle_id: saved.vehicle_id,
            service_type: saved.service_type,
            description: saved.description,
            cost: saved.cost,
            service_date: saved.service_date,
            next_service_date: saved.next_service_date,
            odometer_at_service: saved.odometer_at_service,
          });
      setServiceLogs((prev) => {
        const next = existing ? prev.map((l) => (l.id === persisted.id ? persisted : l)) : [persisted, ...prev];
        return next.sort((a, b) => b.service_date.localeCompare(a.service_date));
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to save service log");
    }
  };

  const handleDeleteServiceLog = async (logId: string) => {
    try {
      await deleteServiceLog(logId);
      setServiceLogs((prev) => prev.filter((l) => l.id !== logId));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete service log");
    }
  };

  const handleSaveVehicle = async (updated: Vehicle) => {
    try {
      const persisted = await updateVehicle(updated.id, {
        vin: updated.vin,
        license_plate: updated.license_plate,
        make: updated.make,
        model: updated.model,
        year: updated.year,
        color: updated.color,
        odometer: updated.odometer,
        status: updated.status,
        insurance_expiry: updated.insurance_expiry,
        registration_expiry: updated.registration_expiry,
        daily_rate: updated.daily_rate,
        weekly_rate: updated.weekly_rate,
        monthly_rate: updated.monthly_rate,
        image_url: updated.image_url,
        notes: updated.notes,
      });
      setVehicle(persisted);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update vehicle");
    }
  };

  const totalRevenue = rentals.reduce((sum, r) => {
    const pay = payments.filter((p) => p.rental_id === r.id);
    return sum + pay.reduce((ps, p) => ps + Number(p.amount), 0);
  }, 0);
  const totalServiceCost = serviceLogs.reduce((sum, s) => sum + Number(s.cost), 0);
  const netProfit = totalRevenue - totalServiceCost;
  const style = statusStyles[vehicle.status] ?? statusStyles.available;

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "rentals", label: "Rentals", count: rentals.length },
    { id: "service", label: "Service Log", count: serviceLogs.length },
    { id: "documents", label: "Documents", count: documents.length },
    { id: "notes", label: "Notes", count: notes.length },
  ];

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes([{ id: `vn${Date.now()}`, content: newNote.trim(), createdAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }), author: "Admin" }, ...notes]);
    setNewNote("");
  };

  const handleUploadDoc = () => {
    setDocuments([...documents, { id: `vd${Date.now()}`, name: `Document_${Date.now()}.pdf`, type: "Other", uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), size: "256 KB" }]);
    alert("Document uploaded! (Demo mode)");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
          <span>/</span>
          <Link href="/vehicles" className="hover:text-foreground transition-colors">Vehicles</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/vehicles">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
              <span className={cn("badge-dot inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", style.bg, style.text)}>
                {vehicle.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{vehicle.color} &middot; {vehicle.license_plate} &middot; VIN: {vehicle.vin}</p>
          </div>
          <Button
            onClick={() => setEditVehicleOpen(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit Vehicle
          </Button>
        </div>
      </div>

      {/* Revenue Cards */}
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
            <p className={cn("text-xl font-bold mt-1", netProfit >= 0 ? "text-emerald-600" : "text-red-500")}>{formatCurrency(netProfit)}</p>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Rentals</p>
            <p className="text-xl font-bold mt-1">{rentals.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex gap-0 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn("ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold", activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Vehicle Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {([["Make", vehicle.make], ["Model", vehicle.model], ["Year", vehicle.year], ["Color", vehicle.color ?? "—"], ["VIN", vehicle.vin], ["License Plate", vehicle.license_plate], ["Odometer", `${vehicle.odometer.toLocaleString()} mi`]] as [string, string | number][]).map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Rates & Compliance</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {([["Daily Rate", vehicle.daily_rate ? `$${vehicle.daily_rate}` : "—"], ["Weekly Rate", vehicle.weekly_rate ? `$${vehicle.weekly_rate}` : "—"], ["Monthly Rate", vehicle.monthly_rate ? `$${vehicle.monthly_rate}` : "—"], ["Insurance Expiry", vehicle.insurance_expiry ? formatDate(vehicle.insurance_expiry) : "—"], ["Registration Expiry", vehicle.registration_expiry ? formatDate(vehicle.registration_expiry) : "—"]] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* RENTALS */}
      {activeTab === "rentals" && (
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
                  const collected = payments
                    .filter((p) => p.rental_id === rental.id)
                    .reduce((s, p) => s + Number(p.amount), 0);
                  const rs = rentalStatusStyles[rental.status] ?? rentalStatusStyles.active;
                  return (
                    <TableRow key={rental.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <Link href={`/clients/${rental.client_id}`} className="text-sm font-medium hover:text-primary transition-colors">
                          {client ? `${client.first_name} ${client.last_name}` : "Unknown"}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(rental.start_date)} — {formatDate(rental.end_date)}</TableCell>
                      <TableCell className="text-sm">{formatCurrency(rental.rate_amount)}/{rental.rate_type === "monthly" ? "mo" : rental.rate_type === "weekly" ? "wk" : "day"}</TableCell>
                      <TableCell className="text-sm font-medium text-emerald-600">{formatCurrency(collected)}</TableCell>
                      <TableCell>
                        <span className={cn("badge-dot inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", rs.bg, rs.text)}>{rental.status}</span>
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
      )}

      {/* SERVICE LOG */}
      {activeTab === "service" && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Service History</CardTitle>
              <Button variant="outline" size="sm" onClick={openAddServiceLog}>
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Service Record
              </Button>
            </div>
          </CardHeader>
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
                  <TableRow
                    key={log.id}
                    onClick={() => openEditServiceLog(log)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <p className="text-sm font-medium">{log.service_type}</p>
                      {log.description && <p className="text-xs text-muted-foreground">{log.description}</p>}
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
      )}

      {/* DOCUMENTS */}
      {activeTab === "documents" && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Vehicle Documents</CardTitle>
                <CardDescription className="text-xs">Registration, insurance, and other documents</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleUploadDoc}>
                <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <label className="flex flex-col items-center justify-center h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer mb-4">
              <Upload className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-sm text-muted-foreground">Drag files here or click to browse</span>
              <input type="file" className="hidden" accept="image/*,application/pdf" multiple onChange={handleUploadDoc} />
            </label>
            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                      {doc.name.match(/\.(jpg|jpeg|png|webp)$/i) ? <ImageIcon className="h-5 w-5 text-blue-500" /> : <FileText className="h-5 w-5 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.type} &middot; {doc.size} &middot; {doc.uploadedAt}
                        {doc.expiry && <> &middot; Expires: {doc.expiry}</>}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Download className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDocuments(documents.filter(d => d.id !== doc.id))}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No documents uploaded yet</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* NOTES */}
      {activeTab === "notes" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Add Note</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder="Type a note about this vehicle..." value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={3} className="resize-none" />
              <div className="flex justify-end mt-3">
                <Button onClick={handleAddNote} disabled={!newNote.trim()} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white" size="sm">
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    {editingNote === note.id ? (
                      <div className="space-y-3">
                        <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3} className="resize-none" />
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingNote(null)}><X className="mr-1 h-3.5 w-3.5" /> Cancel</Button>
                          <Button size="sm" onClick={() => { setNotes(notes.map(n => n.id === note.id ? { ...n, content: editContent } : n)); setEditingNote(null); }} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"><Save className="mr-1 h-3.5 w-3.5" /> Save</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /><span>{note.createdAt}</span><span>&middot;</span><span>{note.author}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => { setEditingNote(note.id); setEditContent(note.content); }}><Edit2 className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => setNotes(notes.filter(n => n.id !== note.id))}><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card><CardContent className="flex h-32 items-center justify-center"><div className="text-center"><StickyNote className="mx-auto h-8 w-8 text-muted-foreground mb-2" /><p className="text-sm text-muted-foreground">No notes yet. Add one above.</p></div></CardContent></Card>
          )}
        </div>
      )}

      {/* Dialogs */}
      <EditVehicleDialog
        open={editVehicleOpen}
        onOpenChange={setEditVehicleOpen}
        vehicle={vehicle}
        onSave={handleSaveVehicle}
      />
      <ServiceLogDialog
        open={serviceDialogOpen}
        onOpenChange={setServiceDialogOpen}
        mode={serviceDialogMode}
        vehicleId={vehicle.id}
        log={editingServiceLog}
        currentOdometer={vehicle.odometer}
        onSave={handleSaveServiceLog}
        onDelete={handleDeleteServiceLog}
      />
    </div>
  );
}
