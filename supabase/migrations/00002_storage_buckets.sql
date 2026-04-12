-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('vehicle-documents', 'vehicle-documents', false),
  ('vehicle-images', 'vehicle-images', true),
  ('client-documents', 'client-documents', false),
  ('rental-contracts', 'rental-contracts', false),
  ('expense-receipts', 'expense-receipts', false);

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Vehicle images: public read, authenticated write
CREATE POLICY "Public read vehicle images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-images');

CREATE POLICY "Authenticated upload vehicle images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete vehicle images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

-- Private buckets: authenticated users full access
CREATE POLICY "Authenticated access vehicle documents"
  ON storage.objects FOR ALL
  USING (bucket_id = 'vehicle-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated access client documents"
  ON storage.objects FOR ALL
  USING (bucket_id = 'client-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated access rental contracts"
  ON storage.objects FOR ALL
  USING (bucket_id = 'rental-contracts' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated access expense receipts"
  ON storage.objects FOR ALL
  USING (bucket_id = 'expense-receipts' AND auth.role() = 'authenticated');
