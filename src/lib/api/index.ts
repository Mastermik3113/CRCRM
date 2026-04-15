// ============================================================================
// Supabase data-access layer
// ----------------------------------------------------------------------------
// Typed CRUD helpers for every entity. Pages import from here instead of
// touching the Supabase client directly.
// ============================================================================

import { createClient } from "@/lib/supabase/client";
import type {
  Vehicle,
  VehicleInsert,
  Client,
  ClientInsert,
  Rental,
  RentalInsert,
  Payment,
  PaymentInsert,
  ServiceLog,
  ServiceLogInsert,
  Expense,
  ExpenseInsert,
  RecurringExpense,
  RecurringExpenseInsert,
} from "@/types/database";

function sb() {
  return createClient();
}

// ---------- vehicles -------------------------------------------------------

export async function listVehicles(): Promise<Vehicle[]> {
  const { data, error } = await sb()
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Vehicle[];
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  const { data, error } = await sb().from("vehicles").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Vehicle) ?? null;
}

export async function createVehicle(v: VehicleInsert): Promise<Vehicle> {
  const { data, error } = await sb().from("vehicles").insert(v).select("*").single();
  if (error) throw error;
  return data as Vehicle;
}

export async function updateVehicle(id: string, patch: Partial<VehicleInsert>): Promise<Vehicle> {
  const { data, error } = await sb().from("vehicles").update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  return data as Vehicle;
}

export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await sb().from("vehicles").delete().eq("id", id);
  if (error) throw error;
}

// ---------- clients --------------------------------------------------------

export async function listClients(): Promise<Client[]> {
  const { data, error } = await sb().from("clients").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Client[];
}

export async function getClient(id: string): Promise<Client | null> {
  const { data, error } = await sb().from("clients").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Client) ?? null;
}

export async function createClientRow(c: ClientInsert): Promise<Client> {
  const { data, error } = await sb().from("clients").insert(c).select("*").single();
  if (error) throw error;
  return data as Client;
}

export async function updateClient(id: string, patch: Partial<ClientInsert>): Promise<Client> {
  const { data, error } = await sb().from("clients").update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  return data as Client;
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await sb().from("clients").delete().eq("id", id);
  if (error) throw error;
}

// ---------- rentals --------------------------------------------------------

export async function listRentals(): Promise<Rental[]> {
  const { data, error } = await sb().from("rentals").select("*").order("start_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Rental[];
}

export async function getRental(id: string): Promise<Rental | null> {
  const { data, error } = await sb().from("rentals").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as Rental) ?? null;
}

export async function createRental(r: RentalInsert): Promise<Rental> {
  const { data, error } = await sb().from("rentals").insert(r).select("*").single();
  if (error) throw error;
  return data as Rental;
}

export async function updateRental(id: string, patch: Partial<RentalInsert>): Promise<Rental> {
  const { data, error } = await sb().from("rentals").update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  return data as Rental;
}

export async function deleteRental(id: string): Promise<void> {
  const { error } = await sb().from("rentals").delete().eq("id", id);
  if (error) throw error;
}

// ---------- payments -------------------------------------------------------

export async function listPayments(): Promise<Payment[]> {
  const { data, error } = await sb().from("payments").select("*").order("payment_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Payment[];
}

export async function createPayment(p: PaymentInsert): Promise<Payment> {
  const { data, error } = await sb().from("payments").insert(p).select("*").single();
  if (error) throw error;
  return data as Payment;
}

export async function deletePayment(id: string): Promise<void> {
  const { error } = await sb().from("payments").delete().eq("id", id);
  if (error) throw error;
}

// ---------- service logs ---------------------------------------------------

export async function listServiceLogs(): Promise<ServiceLog[]> {
  const { data, error } = await sb().from("service_logs").select("*").order("service_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ServiceLog[];
}

export async function listServiceLogsByVehicle(vehicleId: string): Promise<ServiceLog[]> {
  const { data, error } = await sb()
    .from("service_logs")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .order("service_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ServiceLog[];
}

export async function createServiceLog(s: ServiceLogInsert): Promise<ServiceLog> {
  const { data, error } = await sb().from("service_logs").insert(s).select("*").single();
  if (error) throw error;
  return data as ServiceLog;
}

export async function updateServiceLog(id: string, patch: Partial<ServiceLogInsert>): Promise<ServiceLog> {
  const { data, error } = await sb().from("service_logs").update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  return data as ServiceLog;
}

export async function deleteServiceLog(id: string): Promise<void> {
  const { error } = await sb().from("service_logs").delete().eq("id", id);
  if (error) throw error;
}

// ---------- expenses -------------------------------------------------------

export async function listExpenses(): Promise<Expense[]> {
  const { data, error } = await sb().from("expenses").select("*").order("expense_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Expense[];
}

export async function createExpense(e: ExpenseInsert): Promise<Expense> {
  const { data, error } = await sb().from("expenses").insert(e).select("*").single();
  if (error) throw error;
  return data as Expense;
}

export async function updateExpense(id: string, patch: Partial<ExpenseInsert>): Promise<Expense> {
  const { data, error } = await sb().from("expenses").update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  return data as Expense;
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await sb().from("expenses").delete().eq("id", id);
  if (error) throw error;
}

// ---------- recurring expenses ---------------------------------------------

export async function listRecurringExpenses(): Promise<RecurringExpense[]> {
  const { data, error } = await sb().from("recurring_expenses").select("*").order("next_due", { ascending: true });
  if (error) throw error;
  return (data ?? []) as RecurringExpense[];
}

export async function createRecurringExpense(r: RecurringExpenseInsert): Promise<RecurringExpense> {
  const { data, error } = await sb().from("recurring_expenses").insert(r).select("*").single();
  if (error) throw error;
  return data as RecurringExpense;
}

export async function updateRecurringExpense(id: string, patch: Partial<RecurringExpenseInsert>): Promise<RecurringExpense> {
  const { data, error } = await sb().from("recurring_expenses").update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  return data as RecurringExpense;
}

export async function deleteRecurringExpense(id: string): Promise<void> {
  const { error } = await sb().from("recurring_expenses").delete().eq("id", id);
  if (error) throw error;
}
