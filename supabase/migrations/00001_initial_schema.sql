-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================
CREATE TYPE vehicle_status AS ENUM ('available', 'rented', 'maintenance', 'out_of_service');
CREATE TYPE lead_status AS ENUM ('inquiry', 'contacted', 'converted', 'lost');
CREATE TYPE lead_source AS ENUM ('whatsapp', 'phone', 'walkin', 'other');
CREATE TYPE rental_status AS ENUM ('reserved', 'active', 'completed', 'cancelled');
CREATE TYPE rate_type AS ENUM ('daily', 'weekly', 'monthly');
CREATE TYPE deposit_status AS ENUM ('held', 'returned', 'partial');
CREATE TYPE payment_method AS ENUM ('cash', 'zelle', 'check');
CREATE TYPE document_type AS ENUM ('registration', 'insurance', 'other');
CREATE TYPE expense_category AS ENUM ('repair', 'insurance', 'fuel', 'office', 'other');

-- ============================================
-- VEHICLES
-- ============================================
CREATE TABLE vehicles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vin                 VARCHAR(17) UNIQUE NOT NULL,
  license_plate       VARCHAR(20) UNIQUE NOT NULL,
  make                VARCHAR(50) NOT NULL,
  model               VARCHAR(50) NOT NULL,
  year                SMALLINT NOT NULL CHECK (year >= 1900 AND year <= 2100),
  color               VARCHAR(30),
  odometer            INTEGER NOT NULL DEFAULT 0 CHECK (odometer >= 0),
  status              vehicle_status NOT NULL DEFAULT 'available',
  insurance_expiry    DATE,
  registration_expiry DATE,
  daily_rate          NUMERIC(10,2) CHECK (daily_rate >= 0),
  weekly_rate         NUMERIC(10,2) CHECK (weekly_rate >= 0),
  monthly_rate        NUMERIC(10,2) CHECK (monthly_rate >= 0),
  image_url           TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- CLIENTS
-- ============================================
CREATE TABLE clients (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name             VARCHAR(100) NOT NULL,
  last_name              VARCHAR(100) NOT NULL,
  email                  VARCHAR(255) UNIQUE,
  phone                  VARCHAR(30),
  address                TEXT,
  drivers_license_number VARCHAR(50),
  dl_image_url           TEXT,
  lead_status            lead_status NOT NULL DEFAULT 'inquiry',
  lead_source            lead_source NOT NULL DEFAULT 'other',
  notes                  TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- RENTALS
-- ============================================
CREATE TABLE rentals (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id              UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  client_id               UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  start_date              DATE NOT NULL,
  end_date                DATE NOT NULL,
  actual_return_date      DATE,
  rate_type               rate_type NOT NULL DEFAULT 'daily',
  rate_amount             NUMERIC(10,2) NOT NULL CHECK (rate_amount >= 0),
  total_amount            NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  manual_override_amount  NUMERIC(10,2) CHECK (manual_override_amount >= 0),
  status                  rental_status NOT NULL DEFAULT 'reserved',
  security_deposit_amount NUMERIC(10,2) DEFAULT 0 CHECK (security_deposit_amount >= 0),
  deposit_status          deposit_status DEFAULT 'held',
  contract_pdf_url        TEXT,
  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE payments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rental_id        UUID NOT NULL REFERENCES rentals(id) ON DELETE RESTRICT,
  amount           NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  payment_method   payment_method NOT NULL,
  payment_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_number VARCHAR(100),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- VEHICLE DOCUMENTS
-- ============================================
CREATE TABLE vehicle_documents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id    UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_url      TEXT NOT NULL,
  file_name     VARCHAR(255) NOT NULL,
  expiry_date   DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- SERVICE LOGS
-- ============================================
CREATE TABLE service_logs (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id          UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  service_type        VARCHAR(100) NOT NULL,
  description         TEXT,
  cost                NUMERIC(10,2) DEFAULT 0 CHECK (cost >= 0),
  service_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  next_service_date   DATE,
  odometer_at_service INTEGER CHECK (odometer_at_service >= 0),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- EXPENSES
-- ============================================
CREATE TABLE expenses (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category     expense_category NOT NULL,
  description  TEXT NOT NULL,
  amount       NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  vehicle_id   UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  receipt_url  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- AUDIT LOG
-- ============================================
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID,
  action      VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id   UUID,
  old_values  JSONB,
  new_values  JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_insurance_expiry ON vehicles(insurance_expiry);
CREATE INDEX idx_vehicles_registration_expiry ON vehicles(registration_expiry);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_lead_status ON clients(lead_status);

CREATE INDEX idx_rentals_vehicle_id ON rentals(vehicle_id);
CREATE INDEX idx_rentals_client_id ON rentals(client_id);
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_rentals_dates ON rentals(start_date, end_date);

CREATE INDEX idx_payments_rental_id ON payments(rental_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

CREATE INDEX idx_vehicle_documents_vehicle_id ON vehicle_documents(vehicle_id);
CREATE INDEX idx_vehicle_documents_expiry ON vehicle_documents(expiry_date);

CREATE INDEX idx_service_logs_vehicle_id ON service_logs(vehicle_id);
CREATE INDEX idx_service_logs_next_service ON service_logs(next_service_date);

CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_vehicle_id ON expenses(vehicle_id);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- ============================================
-- AUTO UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_rentals_updated_at
  BEFORE UPDATE ON rentals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
