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
import { createRental } from "@/lib/api";
import type { Rental, RateType, Vehicle, Client } from "@/types/database";

interface NewBookingDialogProps {
  vehicles: Vehicle[];
  clients: Client[];
  onCreated?: (rental: Rental) => void;
}

export function NewBookingDialog({ vehicles, clients, onCreated }: NewBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vehicleId, setVehicleId] = useState("");
  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rateType, setRateType] = useState<RateType>("daily");
  const [rateAmount, setRateAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [deposit, setDeposit] = useState("");
  const [override, setOverride] = useState("");
  const [notes, setNotes] = useState("");

  const availableVehicles = vehicles.filter((v) => v.status === "available");

  const reset = () => {
    setStep(1);
    setVehicleId(""); setClientId(""); setStartDate(""); setEndDate("");
    setRateType("daily"); setRateAmount(""); setTotalAmount("");
    setDeposit(""); setOverride(""); setNotes(""); setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const created = await createRental({
        vehicle_id: vehicleId,
        client_id: clientId,
        start_date: startDate,
        end_date: endDate,
        actual_return_date: null,
        rate_type: rateType,
        rate_amount: Number(rateAmount) || 0,
        total_amount: Number(totalAmount) || 0,
        manual_override_amount: override ? Number(override) : null,
        status: "reserved",
        security_deposit_amount: deposit ? Number(deposit) : 0,
        deposit_status: "held",
        contract_pdf_url: null,
        notes: notes.trim() || null,
      });
      onCreated?.(created);
      reset();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
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

        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-emerald-500" : "bg-muted"}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nb_vehicle">Select Vehicle *</Label>
                <select
                  id="nb_vehicle"
                  required
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="">Choose a vehicle...</option>
                  {availableVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} — {v.license_plate}{v.daily_rate != null ? ` ($${v.daily_rate}/day)` : ""}
                    </option>
                  ))}
                </select>
                {availableVehicles.length === 0 && (
                  <p className="text-xs text-muted-foreground">No available vehicles. Add one from the Vehicles page.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nb_client">Select Client *</Label>
                <select
                  id="nb_client"
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="">Choose a client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.first_name} {c.last_name}{c.phone ? ` — ${c.phone}` : ""}
                    </option>
                  ))}
                </select>
                {clients.length === 0 && (
                  <p className="text-xs text-muted-foreground">No clients yet. Add one from the Clients page.</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nb_start">Start Date *</Label>
                  <Input id="nb_start" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nb_end">End Date *</Label>
                  <Input id="nb_end" type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nb_rate_type">Rate Type *</Label>
                  <select
                    id="nb_rate_type"
                    required
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value as RateType)}
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nb_rate">Rate Amount ($) *</Label>
                  <Input id="nb_rate" type="number" step="0.01" min="0" required value={rateAmount} onChange={(e) => setRateAmount(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nb_total">Total Amount ($) *</Label>
                  <Input id="nb_total" type="number" step="0.01" min="0" required value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nb_deposit">Security Deposit ($)</Label>
                  <Input id="nb_deposit" type="number" step="0.01" min="0" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nb_override">Manual Override Amount ($)</Label>
                <Input id="nb_override" type="number" step="0.01" min="0" placeholder="Leave blank for standard pricing" value={override} onChange={(e) => setOverride(e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
                <p className="text-sm font-medium">Ready to create this booking?</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>Vehicle: {vehicles.find((v) => v.id === vehicleId)?.year} {vehicles.find((v) => v.id === vehicleId)?.make} {vehicles.find((v) => v.id === vehicleId)?.model}</li>
                  <li>Client: {clients.find((c) => c.id === clientId)?.first_name} {clients.find((c) => c.id === clientId)?.last_name}</li>
                  <li>Period: {startDate} → {endDate}</li>
                  <li>Rate: ${rateAmount} / {rateType}</li>
                  <li>Total: ${override || totalAmount}</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nb_notes">Booking Notes</Label>
                <Textarea id="nb_notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
          )}

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => (step === 1 ? setOpen(false) : setStep(step - 1))}
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
              <Button type="submit" disabled={saving} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                {saving ? "Creating..." : "Confirm Booking"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
