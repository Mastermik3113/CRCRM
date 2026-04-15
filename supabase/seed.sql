-- ============================================================================
-- seed.sql — Demo data for a fresh Car Rental CRM Supabase project
-- ============================================================================
-- Idempotent: ON CONFLICT DO NOTHING. Safe to re-run.
-- Uses deterministic UUIDs so FK links resolve across tables.
--   vehicles:           10000000-0000-0000-0000-00000000000X
--   clients:            20000000-0000-0000-0000-00000000000X
--   rentals:            30000000-0000-0000-0000-00000000000X
--   payments:           40000000-0000-0000-0000-00000000000X
--   service_logs:       50000000-0000-0000-0000-00000000000X
--   recurring_expenses: 60000000-0000-0000-0000-00000000000X
--   one-time expenses:  70000000-0000-0000-0000-00000000000X
-- ============================================================================

-- ---------------------------------------------------------------------------
-- VEHICLES
-- ---------------------------------------------------------------------------
INSERT INTO vehicles (id, vin, license_plate, make, model, year, color, odometer, status, insurance_expiry, registration_expiry, daily_rate, weekly_rate, monthly_rate, notes)
VALUES
  ('10000000-0000-0000-0000-000000000001','1HGBH41JXMN109186','ABC-1234','Toyota','Camry',2023,'White',12450,'rented','2026-04-17','2026-09-15',65,390,1400,'Excellent condition, popular with business clients'),
  ('10000000-0000-0000-0000-000000000002','2HGFC2F59MH523456','XYZ-5678','Honda','Civic',2022,'Silver',28900,'available','2026-04-24','2026-11-20',55,330,1200,'Great fuel economy, ideal for daily commuters'),
  ('10000000-0000-0000-0000-000000000003','1FTFW1ET5MFA12345','DEF-9012','Ford','F-150',2021,'Black',45200,'rented','2026-07-30','2026-08-10',85,510,1800,'Truck bed liner installed, tow package included'),
  ('10000000-0000-0000-0000-000000000004','5YJ3E1EA1MF789012','GHI-3456','Tesla','Model 3',2024,'Red',5800,'available','2027-01-15','2027-02-28',95,570,2100,'Long range battery, autopilot enabled'),
  ('10000000-0000-0000-0000-000000000005','WBAPH5C55BA345678','JKL-7890','BMW','3 Series',2023,'Blue',18700,'available','2026-12-01','2027-03-15',90,540,1950,'Premium package, leather interior'),
  ('10000000-0000-0000-0000-000000000006','1C4RJFBG5MC901234','MNO-1234','Jeep','Grand Cherokee',2022,'Green',35600,'rented','2026-06-20','2026-10-05',80,480,1700,'4WD, trail rated, great for outdoor adventures'),
  ('10000000-0000-0000-0000-000000000007','3N1AB7AP5MY567890','PQR-5678','Nissan','Altima',2023,'Gray',15300,'maintenance','2026-08-15','2026-12-20',55,330,1200,'Scheduled for brake pad replacement'),
  ('10000000-0000-0000-0000-000000000008','1G1YY22G855109876','STU-9012','Chevrolet','Malibu',2022,'White',31200,'available','2026-11-10','2027-01-25',50,300,1100,'Budget-friendly option, clean interior'),
  ('10000000-0000-0000-0000-000000000009','5UXCR6C05M9A23456','VWX-3456','BMW','X5',2024,'Black',8900,'available','2027-03-01','2027-05-15',120,720,2600,'Luxury SUV, M Sport package, premium sound'),
  ('10000000-0000-0000-0000-000000000010','JTDKN3DU5M1A78901','YZA-7890','Toyota','Corolla',2023,'Blue',22100,'available','2026-09-25','2027-01-10',45,270,950,'Most affordable option, great gas mileage'),
  ('10000000-0000-0000-0000-000000000011','WA1LAAF77MD345678','BCD-1234','Audi','Q5',2023,'White',14500,'rented','2026-10-15','2027-02-20',110,660,2400,'Prestige trim, virtual cockpit, Bang & Olufsen audio'),
  ('10000000-0000-0000-0000-000000000012','4T1BF1FK5MU890123','EFG-5678','Toyota','RAV4',2024,'Silver',6200,'available','2027-02-10','2027-04-30',75,450,1600,'Hybrid, excellent MPG, Adventure trim')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- CLIENTS
-- ---------------------------------------------------------------------------
INSERT INTO clients (id, first_name, last_name, email, phone, address, drivers_license_number, lead_status, lead_source, notes)
VALUES
  ('20000000-0000-0000-0000-000000000001','John','Smith','john.smith@email.com','(305) 555-0101','123 Ocean Drive, Miami, FL 33139','S530-1234-5678','converted','walkin','Loyal customer, always returns vehicles clean. Prefers sedans.'),
  ('20000000-0000-0000-0000-000000000002','Maria','Garcia','maria.garcia@email.com','(305) 555-0202','456 Brickell Ave, Miami, FL 33131','G260-9876-5432','converted','whatsapp','Business executive, needs luxury vehicles for client meetings'),
  ('20000000-0000-0000-0000-000000000003','Mike','Johnson','mike.j@email.com','(786) 555-0303','789 Collins Ave, Miami Beach, FL 33140','J525-1111-2222','converted','phone','Contractor, usually rents trucks for job sites'),
  ('20000000-0000-0000-0000-000000000004','Sarah','Williams','sarah.w@email.com','(305) 555-0404','321 Coral Way, Miami, FL 33145','W452-3333-4444','converted','walkin','Rents monthly for her real estate business'),
  ('20000000-0000-0000-0000-000000000005','David','Chen','david.chen@email.com','(786) 555-0505','555 NW 1st Ave, Miami, FL 33136','C550-5555-6666','converted','whatsapp','Tech startup founder, prefers Tesla or BMW'),
  ('20000000-0000-0000-0000-000000000006','Jessica','Brown','jbrown@email.com','(305) 555-0606','888 Biscayne Blvd, Miami, FL 33132','B650-7777-8888','converted','phone','Nurse at Jackson Memorial, needs reliable transportation'),
  ('20000000-0000-0000-0000-000000000007','Roberto','Martinez','r.martinez@email.com','(786) 555-0707','1200 SW 8th St, Miami, FL 33135','M365-9999-0000','inquiry','whatsapp','Inquired about monthly rates for an SUV'),
  ('20000000-0000-0000-0000-000000000008','Emily','Taylor','emily.t@email.com','(305) 555-0808','2400 SW 3rd Ave, Miami, FL 33129','T100-1212-3434','contacted','phone','Called about weekly sedan rentals, following up Friday'),
  ('20000000-0000-0000-0000-000000000009','Andre','Wilson','andre.w@email.com','(786) 555-0909','3100 NE 2nd Ave, Miami, FL 33137','W900-5656-7878','lost','walkin','Walked in, wanted daily rate under $30. Could not match.'),
  ('20000000-0000-0000-0000-000000000010','Lisa','Anderson','lisa.a@email.com','(305) 555-1010','4500 Ponce de Leon Blvd, Coral Gables, FL 33146','A200-9090-1212','converted','walkin','Attorney, rents for depositions and court appearances')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- RENTALS
-- ---------------------------------------------------------------------------
INSERT INTO rentals (id, vehicle_id, client_id, start_date, end_date, actual_return_date, rate_type, rate_amount, total_amount, manual_override_amount, status, security_deposit_amount, deposit_status, notes)
VALUES
  ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','2026-04-01','2026-04-30',NULL,'monthly',1400,1400,NULL,'active',500,'held','Monthly rental, loyal customer discount applied'),
  ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000003','2026-04-05','2026-04-19',NULL,'weekly',510,1020,NULL,'active',500,'held','Needs truck for construction site'),
  ('30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000004','2026-04-03','2026-05-03',NULL,'monthly',1700,1700,1500,'active',500,'held','Repeat customer discount - $200 off monthly rate'),
  ('30000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000011','20000000-0000-0000-0000-000000000002','2026-04-07','2026-04-21',NULL,'weekly',660,1320,NULL,'active',750,'held','Luxury rental for client events'),
  ('30000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000006','2026-03-01','2026-03-31','2026-03-30','monthly',1200,1200,NULL,'completed',400,'returned',NULL),
  ('30000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000005','2026-03-10','2026-03-24','2026-03-24','weekly',570,1140,NULL,'completed',500,'returned','Returned on time, no issues'),
  ('30000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000010','2026-03-15','2026-03-22','2026-03-22','weekly',540,540,NULL,'completed',500,'returned','Used for out-of-town depositions'),
  ('30000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000009','20000000-0000-0000-0000-000000000002','2026-04-15','2026-04-22',NULL,'weekly',720,720,NULL,'reserved',750,'held','Upcoming reservation for client event week')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- PAYMENTS
-- ---------------------------------------------------------------------------
INSERT INTO payments (id, rental_id, amount, payment_method, payment_date, reference_number, notes)
VALUES
  ('40000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',1400,'zelle','2026-04-01','ZEL-20260401-001','Full monthly payment'),
  ('40000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002',510,'cash','2026-04-05',NULL,'First week payment'),
  ('40000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003',1500,'check','2026-04-03','CHK-4521','Full month (discounted)'),
  ('40000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000004',660,'zelle','2026-04-07','ZEL-20260407-001','First week'),
  ('40000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000005',1200,'zelle','2026-03-01','ZEL-20260301-001','Full month'),
  ('40000000-0000-0000-0000-000000000006','30000000-0000-0000-0000-000000000006',1140,'cash','2026-03-10',NULL,'2 weeks upfront'),
  ('40000000-0000-0000-0000-000000000007','30000000-0000-0000-0000-000000000007',540,'check','2026-03-15','CHK-4498','Law firm payment')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- SERVICE LOGS
-- ---------------------------------------------------------------------------
INSERT INTO service_logs (id, vehicle_id, service_type, description, cost, service_date, next_service_date, odometer_at_service)
VALUES
  ('50000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000007','Brake Pads','Front and rear brake pad replacement',420,'2026-04-11','2027-04-11',15300),
  ('50000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000003','Oil Change','Full synthetic oil change + filter',85,'2026-03-20','2026-06-20',44500),
  ('50000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','Tire Rotation','4-tire rotation + alignment check',60,'2026-03-15','2026-09-15',11800),
  ('50000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000008','Oil Change','Conventional oil change',55,'2026-02-10','2026-05-10',29800)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- RECURRING EXPENSES
-- ---------------------------------------------------------------------------
INSERT INTO recurring_expenses (id, name, vendor, category, amount, frequency, next_due, active, notes)
VALUES
  ('60000000-0000-0000-0000-000000000001','Fleet Insurance','Progressive Commercial','insurance',1850,'monthly','2026-05-01',true,'Covers all 12 vehicles, liability + collision'),
  ('60000000-0000-0000-0000-000000000002','Office Rent','Parkway Properties LLC','rent',2400,'monthly','2026-05-01',true,NULL),
  ('60000000-0000-0000-0000-000000000003','Parking Lot Lease','Downtown Parking Co','parking',650,'monthly','2026-05-01',true,'30 reserved spots'),
  ('60000000-0000-0000-0000-000000000004','QuickBooks Online','Intuit','software',90,'monthly','2026-04-22',true,NULL),
  ('60000000-0000-0000-0000-000000000005','CRM Subscription','Car Rental CRM','software',149,'monthly','2026-04-28',true,NULL),
  ('60000000-0000-0000-0000-000000000006','Google Workspace','Google','software',36,'monthly','2026-04-18',true,'3 seats @ $12/mo'),
  ('60000000-0000-0000-0000-000000000007','Google Ads','Google','marketing',400,'monthly','2026-05-01',true,NULL),
  ('60000000-0000-0000-0000-000000000008','DOT Commercial Registration','State DOT','legal',520,'yearly','2026-09-15',true,NULL),
  ('60000000-0000-0000-0000-000000000009','Office Electric & Internet','City Utilities','utilities',180,'monthly','2026-04-25',true,NULL)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- ONE-TIME EXPENSES
-- ---------------------------------------------------------------------------
INSERT INTO expenses (id, description, vendor, category, amount, expense_date, vehicle_id, notes)
VALUES
  ('70000000-0000-0000-0000-000000000001','New tire set — Ford F-150','Goodyear','maintenance',720,'2026-04-11','10000000-0000-0000-0000-000000000003',NULL),
  ('70000000-0000-0000-0000-000000000002','Detailing — full fleet wash','Shine Pro Detailing','maintenance',340,'2026-04-08',NULL,NULL),
  ('70000000-0000-0000-0000-000000000003','Printer toner + office supplies','Staples','supplies',128,'2026-04-05',NULL,NULL),
  ('70000000-0000-0000-0000-000000000004','Diesel refill — box truck','Shell','fuel',212,'2026-04-03','10000000-0000-0000-0000-000000000011',NULL),
  ('70000000-0000-0000-0000-000000000005','Attorney review — new lease template','Marks & Partners','legal',450,'2026-03-28',NULL,NULL)
ON CONFLICT (id) DO NOTHING;
