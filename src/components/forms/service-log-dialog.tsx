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
import type { ServiceLog } from "@/types/database";

type Mode = "add" | "edit";

export interface ServiceLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  vehicleId: string;
  log?: ServiceLog | null;
  currentOdometer?: number;
  onSave: (log: ServiceLog) => void;
  onDelete?: (logId: string) => void;
}

export function ServiceLogDialog({
  open,
  onOpenChange,
  mode,
  vehicleId,
  log,
  currentOdometer,
  onSave,
  onDelete,
}: ServiceLogDialogProps) {
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [nextServiceDate, setNextServiceDate] = useState("");
  const [odometer, setOdometer] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && log) {
      setServiceType(log.service_type);
      setDescription(log.description ?? "");
      setCost(String(log.cost));
      setServiceDate(log.service_date);
      setNextServiceDate(log.next_service_date ?? "");
      setOdometer(log.odometer_at_service != null ? String(log.odometer_at_service) : "");
    } else {
      setServiceType("");
      setDescription("");
      setCost("");
      setServiceDate(new Date().toISOString().split("T")[0]);
      setNextServiceDate("");
      setOdometer(currentOdometer != null ? String(currentOdometer) : "");
    }
  }, [open, mode, log, currentOdometer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saved: ServiceLog = {
      id: mode === "edit" && log ? log.id : `sl${Date.now()}`,
      vehicle_id: vehicleId,
      service_type: serviceType.trim(),
      description: description.trim() || null,
      cost: Number(cost) || 0,
      service_date: serviceDate,
      next_service_date: nextServiceDate || null,
      odometer_at_service: odometer ? Number(odometer) : null,
      created_at: mode === "edit" && log ? log.created_at : new Date().toISOString(),
    };
    onSave(saved);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!log || !onDelete) return;
    if (confirm("Delete this service record? This cannot be undone.")) {
      onDelete(log.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Service Record" : "Add Service Record"}</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Update the service details below." : "Log a new maintenance record for this vehicle."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="svc_type">Service Type *</Label>
            <Input
              id="svc_type"
              placeholder="e.g. Oil Change, Brake Pads, Tire Rotation"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="svc_desc">Description</Label>
            <Textarea
              id="svc_desc"
              placeholder="Details, parts replaced, shop..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="svc_date">Service Date *</Label>
              <Input id="svc_date" type="date" required value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc_cost">Cost ($) *</Label>
              <Input id="svc_cost" type="number" step="0.01" min="0" required value={cost} onChange={(e) => setCost(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="svc_odo">Odometer (mi)</Label>
              <Input id="svc_odo" type="number" min="0" value={odometer} onChange={(e) => setOdometer(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc_next">Next Due</Label>
              <Input id="svc_next" type="date" value={nextServiceDate} onChange={(e) => setNextServiceDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-between sm:justify-between gap-2 pt-2">
            {mode === "edit" && onDelete ? (
              <Button type="button" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleDelete}>
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                {mode === "edit" ? "Save Changes" : "Add Record"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
