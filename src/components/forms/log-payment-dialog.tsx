"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createPayment } from "@/lib/api";
import type { Payment, PaymentMethod, Rental, Client, Vehicle } from "@/types/database";

interface LogPaymentDialogProps {
  rentals: Rental[];
  clients: Client[];
  vehicles: Vehicle[];
  onCreated?: (payment: Payment) => void;
}

export function LogPaymentDialog({ rentals, clients, vehicles, onCreated }: LogPaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rentalId, setRentalId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const activeRentals = rentals.filter((r) => r.status === "active" || r.status === "reserved");

  const reset = () => {
    setRentalId(""); setAmount(""); setMethod("cash");
    setPaymentDate(new Date().toISOString().split("T")[0]);
    setReference(""); setNotes(""); setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const created = await createPayment({
        rental_id: rentalId,
        amount: Number(amount) || 0,
        payment_method: method,
        payment_date: paymentDate,
        reference_number: reference.trim() || null,
        notes: notes.trim() || null,
      });
      onCreated?.(created);
      reset();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger
        render={
          <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md" />
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Log Payment
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Log Payment</DialogTitle>
          <DialogDescription>Record a payment received for a rental.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="lp_rental">Rental *</Label>
            <select
              id="lp_rental"
              required
              value={rentalId}
              onChange={(e) => setRentalId(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="">Select a rental...</option>
              {activeRentals.map((r) => {
                const client = clients.find((c) => c.id === r.client_id);
                const vehicle = vehicles.find((v) => v.id === r.vehicle_id);
                const label = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Unknown";
                return (
                  <option key={r.id} value={r.id}>
                    {client ? `${client.first_name} ${client.last_name}` : "Unknown"} — {label}
                  </option>
                );
              })}
            </select>
            {activeRentals.length === 0 && (
              <p className="text-xs text-muted-foreground">No active or reserved rentals. Create one first.</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lp_amount">Amount ($) *</Label>
              <Input id="lp_amount" type="number" step="0.01" min="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lp_method">Payment Method *</Label>
              <select
                id="lp_method"
                required
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="cash">Cash</option>
                <option value="zelle">Zelle</option>
                <option value="check">Check</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lp_date">Date *</Label>
              <Input id="lp_date" type="date" required value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lp_ref">Reference #</Label>
              <Input id="lp_ref" value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lp_notes">Notes</Label>
            <Textarea id="lp_notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              {saving ? "Saving..." : "Log Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
