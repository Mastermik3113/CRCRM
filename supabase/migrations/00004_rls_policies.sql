-- ============================================================================
-- 00004 — Row Level Security policies
-- ============================================================================
-- Single-tenant back-office: any authenticated user has full access.
-- Anon role has no access. Re-run safe.
-- ============================================================================

ALTER TABLE vehicles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients            ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals            ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_documents  ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log          ENABLE ROW LEVEL SECURITY;

-- Drop-then-create so this file is idempotent
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'vehicles','clients','rentals','payments','vehicle_documents',
    'service_logs','expenses','recurring_expenses','audit_log'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "authenticated full access" ON %I;', t);
    EXECUTE format(
      'CREATE POLICY "authenticated full access" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true);',
      t
    );
  END LOOP;
END $$;
