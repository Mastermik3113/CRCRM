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
import { demoVehicles } from "@/lib/demo-data";

export function LogExpenseDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Expense logged successfully! (Demo mode - not persisted to database)");
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
        Log Expense
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Log Expense</DialogTitle>
          <DialogDescription>Record a business expense.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select id="category" required className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm">
                <option value="repair">Repair</option>
                <option value="insurance">Insurance</option>
                <option value="fuel">Fuel</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp_amount">Amount ($) *</Label>
              <Input id="exp_amount" type="number" step="0.01" placeholder="0.00" min="0.01" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp_description">Description *</Label>
            <Input id="exp_description" placeholder="e.g. Oil change for Camry" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exp_date">Date *</Label>
              <Input id="exp_date" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp_vehicle">Related Vehicle</Label>
              <select id="exp_vehicle" className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm">
                <option value="">None (general expense)</option>
                {demoVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.year} {v.make} {v.model} — {v.license_plate}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp_receipt">Receipt Upload</Label>
            <Input id="exp_receipt" type="file" accept="image/*,application/pdf" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">Log Expense</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
