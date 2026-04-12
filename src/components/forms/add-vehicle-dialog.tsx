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

export function AddVehicleDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: just close the dialog
    alert("Vehicle added successfully! (Demo mode - not persisted to database)");
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
        Add Vehicle
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>Enter vehicle details to add to your fleet.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Vehicle Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input id="make" placeholder="e.g. Toyota" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input id="model" placeholder="e.g. Camry" required />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input id="year" type="number" placeholder="2024" min="1900" max="2100" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" placeholder="e.g. White" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="odometer">Odometer (mi)</Label>
                <Input id="odometer" type="number" placeholder="0" min="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vin">VIN *</Label>
                <Input id="vin" placeholder="17-character VIN" maxLength={17} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plate">License Plate *</Label>
                <Input id="plate" placeholder="e.g. ABC-1234" required />
              </div>
            </div>
          </div>

          {/* Rates */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Rental Rates</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="daily_rate">Daily Rate ($)</Label>
                <Input id="daily_rate" type="number" step="0.01" placeholder="0.00" min="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weekly_rate">Weekly Rate ($)</Label>
                <Input id="weekly_rate" type="number" step="0.01" placeholder="0.00" min="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_rate">Monthly Rate ($)</Label>
                <Input id="monthly_rate" type="number" step="0.01" placeholder="0.00" min="0" />
              </div>
            </div>
          </div>

          {/* Insurance & Registration */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Compliance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insurance_expiry">Insurance Expiry</Label>
                <Input id="insurance_expiry" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration_expiry">Registration Expiry</Label>
                <Input id="registration_expiry" type="date" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Any additional details about this vehicle..." rows={3} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              Add Vehicle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
