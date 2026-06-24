-- =============================================================
-- TELCOCARE PM — Seed Data
-- =============================================================

-- Insert demo users (passwords handled by Supabase Auth separately)
INSERT INTO users (id, email, full_name, role, phone, region, is_active) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@telcocare.com', 'Super Admin', 'super_admin', '+254 700 000 001', NULL, TRUE),
  ('00000000-0000-0000-0000-000000000002', 'manager@telcocare.com', 'Tom Mbeki', 'maintenance_manager', '+254 700 000 002', NULL, TRUE),
  ('00000000-0000-0000-0000-000000000003', 'supervisor@telcocare.com', 'Alice Kariuki', 'regional_supervisor', '+254 700 000 003', 'Nairobi', TRUE),
  ('00000000-0000-0000-0000-000000000004', 'tech@telcocare.com', 'John Odhiambo', 'field_technician', '+254 712 345 678', 'Nyanza', TRUE),
  ('00000000-0000-0000-0000-000000000005', 'mary.w@telcocare.com', 'Mary Wanjiku', 'field_technician', '+254 723 456 789', 'Nairobi', TRUE),
  ('00000000-0000-0000-0000-000000000006', 'peter.k@telcocare.com', 'Peter Kamau', 'field_technician', '+254 734 567 890', 'Coast', TRUE),
  ('00000000-0000-0000-0000-000000000007', 'grace.a@telcocare.com', 'Grace Akinyi', 'field_technician', '+254 745 678 901', 'Rift Valley', TRUE),
  ('00000000-0000-0000-0000-000000000008', 'david.m@telcocare.com', 'David Mwangi', 'field_technician', '+254 756 789 012', 'Rift Valley', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert tower sites
INSERT INTO tower_sites (site_id, site_name, region, county, latitude, longitude, status, tower_type, installation_date, assigned_technician_id) VALUES
  ('KSM-001', 'Kisumu North', 'Nyanza', 'Kisumu', -0.1022, 34.7617, 'active', 'monopole', '2018-03-15', '00000000-0000-0000-0000-000000000004'),
  ('NRB-045', 'Westlands Tower', 'Nairobi', 'Nairobi', -1.2634, 36.8041, 'active', 'self_support', '2016-07-20', '00000000-0000-0000-0000-000000000005'),
  ('MSA-012', 'Mombasa CBD', 'Coast', 'Mombasa', -4.0435, 39.6682, 'under_maintenance', 'rooftop', '2017-11-08', '00000000-0000-0000-0000-000000000006'),
  ('ELD-003', 'Eldoret South', 'Rift Valley', 'Uasin Gishu', 0.5143, 35.2698, 'active', 'guyed_tower', '2019-01-25', '00000000-0000-0000-0000-000000000007'),
  ('NKR-007', 'Nakuru Central', 'Rift Valley', 'Nakuru', -0.3031, 36.0800, 'active', 'monopole', '2020-05-12', '00000000-0000-0000-0000-000000000008'),
  ('NYR-002', 'Nyeri Hill', 'Central', 'Nyeri', -0.4169, 36.9558, 'active', 'self_support', '2015-09-30', NULL),
  ('KRN-018', 'Kirinyaga East', 'Central', 'Kirinyaga', -0.6167, 37.3667, 'inactive', 'monopole', '2021-02-14', NULL),
  ('HOM-005', 'Homa Bay Central', 'Nyanza', 'Homa Bay', -0.5273, 34.4571, 'active', 'guyed_tower', '2022-08-03', NULL)
ON CONFLICT (site_id) DO NOTHING;

-- Insert PM schedules (get site IDs dynamically)
INSERT INTO pm_schedules (site_id, pm_type, frequency, next_due_date, last_completed_date, assigned_technician_id, is_active)
SELECT
  ts.id,
  'daily'::pm_type,
  'daily'::pm_type,
  CURRENT_DATE + 1,
  CURRENT_DATE,
  ts.assigned_technician_id,
  TRUE
FROM tower_sites ts WHERE ts.status = 'active'
ON CONFLICT (site_id, pm_type) DO NOTHING;

INSERT INTO pm_schedules (site_id, pm_type, frequency, next_due_date, last_completed_date, assigned_technician_id, is_active)
SELECT
  ts.id,
  'weekly'::pm_type,
  'weekly'::pm_type,
  CURRENT_DATE + 7,
  CURRENT_DATE - 7,
  ts.assigned_technician_id,
  TRUE
FROM tower_sites ts WHERE ts.status = 'active'
ON CONFLICT (site_id, pm_type) DO NOTHING;

INSERT INTO pm_schedules (site_id, pm_type, frequency, next_due_date, last_completed_date, assigned_technician_id, is_active)
SELECT
  ts.id,
  'monthly'::pm_type,
  'monthly'::pm_type,
  CURRENT_DATE + 30,
  CURRENT_DATE - 30,
  ts.assigned_technician_id,
  TRUE
FROM tower_sites ts WHERE ts.status = 'active'
ON CONFLICT (site_id, pm_type) DO NOTHING;
