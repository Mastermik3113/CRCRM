"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Vehicle, VehicleStatus } from "@/types/database";

export interface EditVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle;
  onSave: (vehicle: Vehicle) => void;
}

const statusOptions: { value: VehicleStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "rented", label: "Rented" },
  { value: "maintenance", label: "Maintenance" },
  { value: "out_of_service", label: "Out of Service" },
];

export function EditVehicleDialog({ open, onOpenChange, vehicle, onSave }: EditVehicleDialogProps) {
  const [form, setForm] = useState<Vehicle>(vehicle);

  useEffect(() => {
    if (open) setForm(vehicle);
  }, [open, vehicle]);

  const set = <K extends keyof Vehicle>(key: K, value: Vehicle[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, updated_at: new Date().toISOString() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>Update vehicle information, rates, and compliance details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Vehicle Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ev_make">Make *</Label>
                <Input id="ev_make" required value={form.make} onChange={(e) => set("make", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ev_model">Model *</Label>
                <Input id="ev_model" required value={form.model} onChange={(e) => set("model", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ev_year">Year *</Label>
                <Input id="ev_year" type="number" min="1900" max="2100" required value={form.year} onChange={(e) => set("year", Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ev_color">Color</Label>
                <Input id="ev_color" value={form.color ?? ""} onChange={(e) => set("color", e.target.value || null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ev_odo">Odometer (mi)</Label>
                <Input id="ev_odo" type="number" min="0" value={form.odometer} onChange={(e) => set("odometer", Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ev_vin">VIN *</Label>
                <Input id="ev_vin" maxLength={17} required value={form.vin} onChange={(e) => set("vin", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ev_plate">License Plate *</Label>
                <Input id="ev_plate" required value={form.license_plate} onChange={(e) => set("license_plate", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev_status">Status</Label>
              <select
                id="ev_status"
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
                value={form.status}
                onChange={(e) => set("status", e.target.value as VehicleStatus)}
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rates */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Rental Rates</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ev_daily">Daily Rate ($)</Label>
                <Input id="ev_daily" type="number" step="0.01" min="0" value={form.daily_rate ?? ""} onChange={(e) => set("daily_rate", e.target.value ? Number(e.target.value) : null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ev_weekly">Weekly Rate ($)</Label>
                <Input id="ev_weekly" type="number" step="0.01" min="0" value={form.weekly_rate ?? ""} onChange={(e) => set("weekly_rate", e.target.value ? Number(e.target.value) : null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ev_monthly">Monthly Rate ($)</Label>
                <Input id="ev_monthly" type="number" step="0.01" min="0" value={form.monthly_rate ?? ""} onChange={(e) => set("monthly_rate", e.target.value ? Number(e.target.value) : null)} />
              </div>
            </div>
          </div>

          {/* Compliance */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Compliance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ev_ins">Insurance Expiry</Label>
                <Input id="ev_ins" type="date" value={form.insurance_expiry ?? ""} onChange={(e) => set("insurance_expiry", e.target.value || null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ev_reg">Registration Expiry</Label>
                <Input id="ev_reg" type="date" value={form.registration_expiry ?? ""} onChange={(e) => set("registration_expiry", e.target.value || null)} />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="ev_notes">Notes</Label>
            <Textarea id="ev_notes" rows={3} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value || null)} />
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
