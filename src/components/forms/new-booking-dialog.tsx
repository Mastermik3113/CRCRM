"use client";

import { useState } from "react";
import { Plus, ChevronRight, ChevronLeft } from "lucide-react";
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
import { demoVehicles, demoClients } from "@/lib/demo-data";

export function NewBookingDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const availableVehicles = demoVehicles.filter((v) => v.status === "available");
  const activeClients = demoClients.filter((c) => c.lead_status === "converted");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Booking created successfully! (Demo mode - not persisted to database)");
    setOpen(false);
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setStep(1); }}>
      <DialogTrigger
        render={
          <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md" />
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        New Booking
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Booking — Step {step} of 3</DialogTitle>
          <DialogDescription>
            {step === 1 && "Select a vehicle and client for this rental."}
            {step === 2 && "Set the rental dates and rate."}
            {step === 3 && "Review and confirm the booking details."}
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-emerald-500" : "bg-muted"}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Vehicle & Client */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Select Vehicle *</Label>
                <select id="vehicle" required className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm">
                  <option value="">Choose a vehicle...</option>
                  {availableVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} — {v.license_plate} (${v.daily_rate}/day)
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Select Client *</Label>
                <select id="client" required className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm">
                  <option value="">Choose a client...</option>
                  {activeClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name} — {c.phone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Dates & Rate */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input id="start_date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date *</Label>
                  <Input id="end_date" type="date" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rate_type">Rate Type *</Label>
                  <select id="rate_type" required className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate_amount">Rate Amount ($) *</Label>
                  <Input id="rate_amount" type="number" step="0.01" placeholder="0.00" min="0" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_amount">Total Amount ($) *</Label>
                  <Input id="total_amount" type="number" step="0.01" placeholder="0.00" min="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Security Deposit ($)</Label>
                  <Input id="deposit" type="number" step="0.01" placeholder="500.00" min="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="override">Manual Override Amount ($)</Label>
                <Input id="override" type="number" step="0.01" placeholder="Leave blank for standard pricing" min="0" />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
                <p className="text-sm font-medium">Review your booking details and click Confirm to create.</p>
                <p className="text-xs text-muted-foreground">In production, this step would show a full summary of the selected vehicle, client, dates, and pricing. A rental agreement PDF would be generated upon confirmation.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking_notes">Booking Notes</Label>
                <Textarea id="booking_notes" placeholder="Any special instructions or notes..." rows={3} />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => step === 1 ? setOpen(false) : setStep(step - 1)}
            >
              {step === 1 ? "Cancel" : <><ChevronLeft className="mr-1 h-4 w-4" /> Back</>}
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                Confirm Booking
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
