// ============================================================================
// Data shapes and local-state helpers
// ----------------------------------------------------------------------------
// This file used to contain hard-coded demo rows. It now exports empty arrays
// so the app starts in a clean "fresh start" state — users add real records
// through the UI. Types, helpers, and the back-office expense definitions stay
// here so existing imports keep working.
// ============================================================================

import type {
  Vehicle,
  Client,
  Rental,
  Payment,
  ServiceLog,
  ExpenseCategory,
} from "@/types/database";

// ---------- core entities: start empty ------------------------------------
export const demoVehicles: Vehicle[] = [];
export const demoClients: Client[] = [];
export const demoRentals: Rental[] = [];
export const demoPayments: Payment[] = [];
export const demoServiceLogs: ServiceLog[] = [];

// ---------- helpers -------------------------------------------------------

export function getVehicleById(id: string): Vehicle | undefined {
  return demoVehicles.find((v) => v.id === id);
}

export function getClientById(id: string): Client | undefined {
  return demoClients.find((c) => c.id === id);
}

export function getRentalsByVehicle(vehicleId: string): Rental[] {
  return demoRentals.filter((r) => r.vehicle_id === vehicleId);
}

export function getRentalsByClient(clientId: string): Rental[] {
  return demoRentals.filter((r) => r.client_id === clientId);
}

export function getPaymentsByRental(rentalId: string): Payment[] {
  return demoPayments.filter((p) => p.rental_id === rentalId);
}

export function getServiceLogsByVehicle(vehicleId: string): ServiceLog[] {
  return demoServiceLogs.filter((s) => s.vehicle_id === vehicleId);
}

export function getClientTotalSpend(clientId: string): number {
  const rentals = getRentalsByClient(clientId);
  return rentals.reduce((sum, r) => {
    const payments = getPaymentsByRental(r.id);
    return sum + payments.reduce((ps, p) => ps + p.amount, 0);
  }, 0);
}

export function getVehicleLabel(v: Vehicle): string {
  return `${v.year} ${v.make} ${v.model}`;
}

// ============================================================================
// Back Office — expense types & empty seeds
// ============================================================================

export type { ExpenseCategory } from "@/types/database";
export type Frequency = "weekly" | "monthly" | "quarterly" | "yearly";

export interface RecurringExpense {
  id: string;
  name: string;
  vendor: string;
  category: ExpenseCategory;
  amount: number;
  frequency: Frequency;
  next_due: string;
  active: boolean;
  notes?: string | null;
}

export interface OneTimeExpense {
  id: string;
  description: string;
  vendor: string | null;
  category: ExpenseCategory;
  amount: number;
  expense_date: string;
  vehicle_id: string | null;
  notes?: string | null;
}

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  insurance: "Insurance",
  rent: "Rent",
  software: "Software",
  fuel: "Fuel",
  maintenance: "Maintenance",
  repair: "Repair",
  parking: "Parking",
  marketing: "Marketing",
  payroll: "Payroll",
  utilities: "Utilities",
  supplies: "Supplies",
  legal: "Legal",
  office: "Office",
  other: "Other",
};

export const demoRecurringExpenses: RecurringExpense[] = [];
export const demoOneTimeExpenses: OneTimeExpense[] = [];

export function getMonthlyRecurringTotal(): number {
  return demoRecurringExpenses
    .filter((r) => r.active)
    .reduce((sum, r) => {
      switch (r.frequency) {
        case "weekly":
          return sum + r.amount * 4.33;
        case "monthly":
          return sum + r.amount;
        case "quarterly":
          return sum + r.amount / 3;
        case "yearly":
          return sum + r.amount / 12;
      }
    }, 0);
}
