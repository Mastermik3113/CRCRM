// ============================================
// Enum Types (mirror PostgreSQL enums)
// ============================================

export type VehicleStatus = "available" | "rented" | "maintenance" | "out_of_service";
export type LeadStatus = "inquiry" | "contacted" | "converted" | "lost";
export type LeadSource = "whatsapp" | "phone" | "walkin" | "other";
export type RentalStatus = "reserved" | "active" | "completed" | "cancelled";
export type RateType = "daily" | "weekly" | "monthly";
export type DepositStatus = "held" | "returned" | "partial";
export type PaymentMethod = "cash" | "zelle" | "check";
export type DocumentType = "registration" | "insurance" | "other";
export type ExpenseCategory =
  | "repair"
  | "insurance"
  | "fuel"
  | "office"
  | "other"
  | "rent"
  | "software"
  | "parking"
  | "marketing"
  | "payroll"
  | "utilities"
  | "supplies"
  | "legal"
  | "maintenance";
export type Frequency = "weekly" | "monthly" | "quarterly" | "yearly";

// ============================================
// Row Types (what SELECT returns)
// ============================================

export interface Vehicle {
  id: string;
  vin: string;
  license_plate: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  odometer: number;
  status: VehicleStatus;
  insurance_expiry: string | null;
  registration_expiry: string | null;
  daily_rate: number | null;
  weekly_rate: number | null;
  monthly_rate: number | null;
  image_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  drivers_license_number: string | null;
  dl_image_url: string | null;
  lead_status: LeadStatus;
  lead_source: LeadSource;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Rental {
  id: string;
  vehicle_id: string;
  client_id: string;
  start_date: string;
  end_date: string;
  actual_return_date: string | null;
  rate_type: RateType;
  rate_amount: number;
  total_amount: number;
  manual_override_amount: number | null;
  status: RentalStatus;
  security_deposit_amount: number;
  deposit_status: DepositStatus;
  contract_pdf_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  rental_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  reference_number: string | null;
  notes: string | null;
  created_at: string;
}

export interface VehicleDocument {
  id: string;
  vehicle_id: string;
  document_type: DocumentType;
  file_url: string;
  file_name: string;
  expiry_date: string | null;
  created_at: string;
}

export interface ServiceLog {
  id: string;
  vehicle_id: string;
  service_type: string;
  description: string | null;
  cost: number;
  service_date: string;
  next_service_date: string | null;
  odometer_at_service: number | null;
  created_at: string;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  expense_date: string;
  vehicle_id: string | null;
  receipt_url: string | null;
  vendor: string | null;
  notes: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  created_at: string;
}

export interface RecurringExpense {
  id: string;
  name: string;
  vendor: string;
  category: ExpenseCategory;
  amount: number;
  frequency: Frequency;
  next_due: string;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Insert Types (omit auto-generated fields)
// ============================================

export type VehicleInsert = Omit<Vehicle, "id" | "created_at" | "updated_at">;
export type ClientInsert = Omit<Client, "id" | "created_at" | "updated_at">;
export type RentalInsert = Omit<Rental, "id" | "created_at" | "updated_at">;
export type PaymentInsert = Omit<Payment, "id" | "created_at">;
export type VehicleDocumentInsert = Omit<VehicleDocument, "id" | "created_at">;
export type ServiceLogInsert = Omit<ServiceLog, "id" | "created_at">;
export type ExpenseInsert = Omit<Expense, "id" | "created_at">;
export type RecurringExpenseInsert = Omit<RecurringExpense, "id" | "created_at" | "updated_at">;

// ============================================
// Update Types (all fields optional)
// ============================================

export type VehicleUpdate = Partial<VehicleInsert>;
export type ClientUpdate = Partial<ClientInsert>;
export type RentalUpdate = Partial<RentalInsert>;
export type PaymentUpdate = Partial<PaymentInsert>;
export type ExpenseUpdate = Partial<ExpenseInsert>;

// ============================================
// Storage Bucket Names
// ============================================

export type BucketName =
  | "vehicle-documents"
  | "vehicle-images"
  | "client-documents"
  | "rental-contracts"
  | "expense-receipts";
