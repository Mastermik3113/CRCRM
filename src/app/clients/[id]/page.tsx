"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Plus,
  Trash2,
  Download,
  Edit2,
  Save,
  X,
  StickyNote,
  Clock,
  Image as ImageIcon,
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

type TabId = "overview" | "rentals" | "documents" | "notes";

interface DemoDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

interface DemoNote {
  id: string;
  content: string;
  createdAt: string;
  author: string;
}

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const client = getClientById(id);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Demo documents state
  const [documents, setDocuments] = useState<DemoDocument[]>([
    { id: "d1", name: "Drivers_License_Front.jpg", type: "Driver's License", uploadedAt: "Apr 1, 2026", size: "1.2 MB" },
    { id: "d2", name: "Drivers_License_Back.jpg", type: "Driver's License", uploadedAt: "Apr 1, 2026", size: "980 KB" },
  ]);

  // Demo notes state
  const [notes, setNotes] = useState<DemoNote[]>([
    { id: "n1", content: client?.notes ?? "", createdAt: "Apr 10, 2026 2:00 PM", author: "Admin" },
  ]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

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

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "rentals", label: "Rentals", count: rentals.length },
    { id: "documents", label: "Documents", count: documents.length },
    { id: "notes", label: "Notes", count: notes.length },
  ];

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes([
      {
        id: `n${Date.now()}`,
        content: newNote.trim(),
        createdAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
        author: "Admin",
      },
      ...notes,
    ]);
    setNewNote("");
  };

  const handleSaveEdit = (noteId: string) => {
    setNotes(notes.map((n) => (n.id === noteId ? { ...n, content: editContent } : n)));
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((n) => n.id !== noteId));
  };

  const handleUploadDoc = () => {
    const newDoc: DemoDocument = {
      id: `d${Date.now()}`,
      name: `Document_${Date.now()}.pdf`,
      type: "Other",
      uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      size: "256 KB",
    };
    setDocuments([...documents, newDoc]);
    alert("Document uploaded! (Demo mode)");
  };

  const handleDeleteDoc = (docId: string) => {
    setDocuments(documents.filter((d) => d.id !== docId));
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
          <span>/</span>
          <Link href="/clients" className="hover:text-foreground transition-colors">Clients</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{client.first_name} {client.last_name}</span>
        </div>
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

      {/* Tab Navigation - Proper distinct tabs */}
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
                <span className={cn(
                  "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                  activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ============ OVERVIEW TAB ============ */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{client.email ?? "No email"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{client.phone ?? "No phone"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{client.address ?? "No address"}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Identification</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Driver&apos;s License #</span>
                <span className="font-medium font-mono">{client.drivers_license_number ?? "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lead Source</span>
                <span className="font-medium capitalize">{client.lead_source}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className={cn("badge-dot inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", ls.bg, ls.text)}>
                  {client.lead_status}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">{formatDate(client.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============ RENTALS TAB ============ */}
      {activeTab === "rentals" && (
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
                    <TableRow key={rental.id} className="hover:bg-muted/50 transition-colors">
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
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No rental history</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ============ DOCUMENTS TAB ============ */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          {/* Upload Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Client Documents</CardTitle>
                  <CardDescription className="text-xs">Upload driver&apos;s license, ID, or other documents</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleUploadDoc}>
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Upload drop zone */}
              <label className="flex flex-col items-center justify-center h-28 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer mb-4">
                <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-sm text-muted-foreground">Drag files here or click to browse</span>
                <span className="text-xs text-muted-foreground mt-0.5">PDF, JPG, PNG up to 10MB</span>
                <input type="file" className="hidden" accept="image/*,application/pdf" multiple onChange={handleUploadDoc} />
              </label>

              {/* Document list */}
              {documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                        {doc.name.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                          <ImageIcon className="h-5 w-5 text-blue-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type} &middot; {doc.size} &middot; {doc.uploadedAt}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteDoc(doc.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No documents uploaded yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============ NOTES TAB ============ */}
      {activeTab === "notes" && (
        <div className="space-y-4">
          {/* Add Note */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Add Note</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  placeholder="Type a note about this client..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                    size="sm"
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes List */}
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    {editingNote === note.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingNote(null)}>
                            <X className="mr-1 h-3.5 w-3.5" /> Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleSaveEdit(note.id)} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                            <Save className="mr-1 h-3.5 w-3.5" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{note.createdAt}</span>
                            <span>&middot;</span>
                            <span>{note.author}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                setEditingNote(note.id);
                                setEditContent(note.content);
                              }}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex h-32 items-center justify-center">
                <div className="text-center">
                  <StickyNote className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No notes yet. Add one above.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
