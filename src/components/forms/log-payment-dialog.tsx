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
import { demoRentals, getClientById, getVehicleById, getVehicleLabel } from "@/lib/demo-data";

export function LogPaymentDialog() {
  const [open, setOpen] = useState(false);

  const activeRentals = demoRentals.filter((r) => r.status === "active" || r.status === "reserved");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Payment logged successfully! (Demo mode - not persisted to database)");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Label htmlFor="rental">Rental *</Label>
            <select id="rental" required className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm">
              <option value="">Select a rental...</option>
              {activeRentals.map((r) => {
                const client = getClientById(r.client_id);
                const vehicle = getVehicleById(r.vehicle_id);
                return (
                  <option key={r.id} value={r.id}>
                    {client ? `${client.first_name} ${client.last_name}` : "Unknown"} — {vehicle ? getVehicleLabel(vehicle) : "Unknown"}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input id="amount" type="number" step="0.01" placeholder="0.00" min="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method *</Label>
              <select id="method" required className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm">
                <option value="cash">Cash</option>
                <option value="zelle">Zelle</option>
                <option value="check">Check</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment_date">Date *</Label>
              <Input id="payment_date" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference #</Label>
              <Input id="reference" placeholder="e.g. CHK-1234" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="receipt">Receipt Upload</Label>
            <Input id="receipt" type="file" accept="image/*,application/pdf" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pay_notes">Notes</Label>
            <Textarea id="pay_notes" placeholder="Payment details..." rows={2} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">Log Payment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
