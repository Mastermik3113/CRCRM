-- ============================================================================
-- 00003 — Back Office: recurring expenses, extended categories, vendor/notes
-- ============================================================================
-- Adds everything needed for the Back Office page:
--   * New recurring_expenses table with a frequency enum
--   * Extends expense_category with business-level categories
--   * Adds vendor + notes columns to expenses
-- Idempotent: safe to run multiple times.
-- ============================================================================

-- ---------- frequency enum -------------------------------------------------
DO $$ BEGIN
  CREATE TYPE frequency AS ENUM ('weekly', 'monthly', 'quarterly', 'yearly');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- extend expense_category ----------------------------------------
-- ALTER TYPE ... ADD VALUE cannot run inside a transaction, but the
-- Supabase SQL Editor runs each top-level statement in its own tx, so this
-- works fine when pasted top-to-bottom.
ALTER TYPE expense_category ADD VALUE IF NOT EXISTS 'rent';
ALTER TYPE expense_category ADD VALUE IF NOT EXISTS 'software';
ALTER TYPE expense_category ADD VALUE IF NOT EXISTS 'parking';
ALTER TYPE expense_category ADD VALUE IF NOT EXISTS 'marketing';
ALTER TYPE expense_category ADD VALUE IF NOT EXISTS 'payroll';
ALTER TYPE expense_category ADD VALUE IF NOT EXISTS 'utilities';
ALTER TYPE expense_category ADD VALUE IF NOT EXISTS 'supplies';
ALTER TYPE expense_category ADD VALUE IF NOT EXISTS 'legal';
ALTER TYPE expense_category ADD VALUE IF NOT EXISTS 'maintenance';

-- ---------- extend expenses table ------------------------------------------
ALTER TABLE expenses
  ADD COLUMN IF NOT EXISTS vendor TEXT,
  ADD COLUMN IF NOT EXISTS notes  TEXT;

-- ---------- recurring_expenses table ---------------------------------------
CREATE TABLE IF NOT EXISTS recurring_expenses (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       VARCHAR(200) NOT NULL,
  vendor     VARCHAR(200) NOT NULL,
  category   expense_category NOT NULL,
  amount     NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  frequency  frequency NOT NULL DEFAULT 'monthly',
  next_due   DATE NOT NULL,
  active     BOOLEAN NOT NULL DEFAULT true,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recurring_expenses_active    ON recurring_expenses(active);
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_next_due  ON recurring_expenses(next_due);
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_category  ON recurring_expenses(category);

-- updated_at trigger (function already defined in 00001)
DROP TRIGGER IF EXISTS set_recurring_expenses_updated_at ON recurring_expenses;
CREATE TRIGGER set_recurring_expenses_updated_at
  BEFORE UPDATE ON recurring_expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
