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
import { createVehicle } from "@/lib/api";
import type { Vehicle, VehicleStatus } from "@/types/database";

interface AddVehicleDialogProps {
  onCreated?: (vehicle: Vehicle) => void;
}

export function AddVehicleDialog({ onCreated }: AddVehicleDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [odometer, setOdometer] = useState("");
  const [vin, setVin] = useState("");
  const [plate, setPlate] = useState("");
  const [status, setStatus] = useState<VehicleStatus>("available");
  const [dailyRate, setDailyRate] = useState("");
  const [weeklyRate, setWeeklyRate] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [insExpiry, setInsExpiry] = useState("");
  const [regExpiry, setRegExpiry] = useState("");
  const [notes, setNotes] = useState("");

  const reset = () => {
    setMake(""); setModel(""); setYear(""); setColor(""); setOdometer("");
    setVin(""); setPlate(""); setStatus("available");
    setDailyRate(""); setWeeklyRate(""); setMonthlyRate("");
    setInsExpiry(""); setRegExpiry(""); setNotes("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const created = await createVehicle({
        make: make.trim(),
        model: model.trim(),
        year: Number(year),
        color: color.trim() || null,
        odometer: odometer ? Number(odometer) : 0,
        vin: vin.trim(),
        license_plate: plate.trim(),
        status,
        daily_rate: dailyRate ? Number(dailyRate) : null,
        weekly_rate: weeklyRate ? Number(weeklyRate) : null,
        monthly_rate: monthlyRate ? Number(monthlyRate) : null,
        insurance_expiry: insExpiry || null,
        registration_expiry: regExpiry || null,
        image_url: null,
        notes: notes.trim() || null,
      });
      onCreated?.(created);
      reset();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create vehicle");
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
        Add Vehicle
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>Enter vehicle details to add to your fleet.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="av_make">Make *</Label>
                <Input id="av_make" required value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g. Toyota" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="av_model">Model *</Label>
                <Input id="av_model" required value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Camry" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="av_year">Year *</Label>
                <Input id="av_year" type="number" min="1900" max="2100" required value={year} onChange={(e) => setYear(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="av_color">Color</Label>
                <Input id="av_color" value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="av_odo">Odometer (mi)</Label>
                <Input id="av_odo" type="number" min="0" value={odometer} onChange={(e) => setOdometer(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="av_vin">VIN *</Label>
                <Input id="av_vin" maxLength={17} required value={vin} onChange={(e) => setVin(e.target.value)} placeholder="17-character VIN" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="av_plate">License Plate *</Label>
                <Input id="av_plate" required value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="e.g. ABC-1234" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="av_status">Status</Label>
              <select
                id="av_status"
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_service">Out of Service</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Rental Rates</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="av_daily">Daily Rate ($)</Label>
                <Input id="av_daily" type="number" step="0.01" min="0" value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="av_weekly">Weekly Rate ($)</Label>
                <Input id="av_weekly" type="number" step="0.01" min="0" value={weeklyRate} onChange={(e) => setWeeklyRate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="av_monthly">Monthly Rate ($)</Label>
                <Input id="av_monthly" type="number" step="0.01" min="0" value={monthlyRate} onChange={(e) => setMonthlyRate(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Compliance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="av_ins">Insurance Expiry</Label>
                <Input id="av_ins" type="date" value={insExpiry} onChange={(e) => setInsExpiry(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="av_reg">Registration Expiry</Label>
                <Input id="av_reg" type="date" value={regExpiry} onChange={(e) => setRegExpiry(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="av_notes">Notes</Label>
            <Textarea id="av_notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              {saving ? "Saving..." : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
