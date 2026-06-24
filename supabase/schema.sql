-- =============================================================
-- TELCOCARE PM — PostgreSQL Database Schema
-- Supabase / PostgreSQL
-- =============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- ENUMS
-- =============================================================

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'maintenance_manager',
  'regional_supervisor',
  'field_technician'
);

CREATE TYPE site_status AS ENUM (
  'active',
  'inactive',
  'under_maintenance',
  'decommissioned'
);

CREATE TYPE tower_type AS ENUM (
  'monopole',
  'guyed_tower',
  'self_support',
  'rooftop',
  'camouflaged'
);

CREATE TYPE pm_type AS ENUM (
  'daily',
  'weekly',
  'monthly'
);

CREATE TYPE work_order_status AS ENUM (
  'open',
  'assigned',
  'in_progress',
  'pending_approval',
  'completed',
  'overdue'
);

CREATE TYPE priority_level AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE checklist_category AS ENUM (
  'generator',
  'dc_system',
  'battery',
  'solar',
  'cleaning',
  'rms'
);

CREATE TYPE checklist_response AS ENUM (
  'yes',
  'no',
  'na'
);

CREATE TYPE notification_type AS ENUM (
  'pm_due',
  'pm_overdue',
  'work_order_assigned',
  'approval_required',
  'pm_completed',
  'system'
);

-- =============================================================
-- USERS TABLE
-- =============================================================

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id  UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'field_technician',
  phone         TEXT,
  avatar_url    TEXT,
  region        TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_region ON users(region);
CREATE INDEX idx_users_deleted ON users(deleted_at) WHERE deleted_at IS NULL;

-- =============================================================
-- TOWER SITES TABLE
-- =============================================================

CREATE TABLE tower_sites (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id                 TEXT NOT NULL UNIQUE,
  site_name               TEXT NOT NULL,
  region                  TEXT NOT NULL,
  county                  TEXT NOT NULL,
  latitude                NUMERIC(10, 7),
  longitude               NUMERIC(10, 7),
  status                  site_status NOT NULL DEFAULT 'active',
  tower_type              tower_type NOT NULL,
  installation_date       DATE,
  assigned_technician_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_tower_sites_region ON tower_sites(region);
CREATE INDEX idx_tower_sites_status ON tower_sites(status);
CREATE INDEX idx_tower_sites_tech ON tower_sites(assigned_technician_id);
CREATE INDEX idx_tower_sites_deleted ON tower_sites(deleted_at) WHERE deleted_at IS NULL;

-- =============================================================
-- PM SCHEDULES TABLE
-- =============================================================

CREATE TABLE pm_schedules (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id                 UUID NOT NULL REFERENCES tower_sites(id) ON DELETE CASCADE,
  pm_type                 pm_type NOT NULL,
  frequency               pm_type NOT NULL,
  next_due_date           DATE NOT NULL,
  last_completed_date     DATE,
  assigned_technician_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  created_by              UUID REFERENCES users(id),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at              TIMESTAMPTZ,
  UNIQUE(site_id, pm_type)
);

CREATE INDEX idx_pm_schedules_site ON pm_schedules(site_id);
CREATE INDEX idx_pm_schedules_due ON pm_schedules(next_due_date);
CREATE INDEX idx_pm_schedules_active ON pm_schedules(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_pm_schedules_deleted ON pm_schedules(deleted_at) WHERE deleted_at IS NULL;

-- =============================================================
-- WORK ORDERS TABLE
-- =============================================================

CREATE TABLE work_orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_order_number   TEXT NOT NULL UNIQUE,
  site_id             UUID NOT NULL REFERENCES tower_sites(id) ON DELETE RESTRICT,
  pm_schedule_id      UUID REFERENCES pm_schedules(id) ON DELETE SET NULL,
  pm_type             pm_type NOT NULL,
  technician_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  supervisor_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  status              work_order_status NOT NULL DEFAULT 'open',
  priority            priority_level NOT NULL DEFAULT 'medium',
  due_date            DATE NOT NULL,
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  approved_at         TIMESTAMPTZ,
  notes               TEXT,
  supervisor_notes    TEXT,
  technician_signature TEXT,
  gps_latitude        NUMERIC(10, 7),
  gps_longitude       NUMERIC(10, 7),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_work_orders_site ON work_orders(site_id);
CREATE INDEX idx_work_orders_tech ON work_orders(technician_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_due ON work_orders(due_date);
CREATE INDEX idx_work_orders_pm_type ON work_orders(pm_type);
CREATE INDEX idx_work_orders_deleted ON work_orders(deleted_at) WHERE deleted_at IS NULL;

-- =============================================================
-- CHECKLIST RESPONSES TABLE
-- =============================================================

CREATE TABLE checklist_responses (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_order_id       UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  category            checklist_category NOT NULL,
  question_key        TEXT NOT NULL,
  question_text       TEXT NOT NULL,
  response            checklist_response,
  comment             TEXT,
  corrective_action   TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(work_order_id, category, question_key)
);

CREATE INDEX idx_checklist_wo ON checklist_responses(work_order_id);
CREATE INDEX idx_checklist_category ON checklist_responses(category);
CREATE INDEX idx_checklist_response ON checklist_responses(response);

-- =============================================================
-- MEASUREMENTS TABLE (DC amps / Battery voltages / Solar)
-- =============================================================

CREATE TABLE pm_measurements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_order_id   UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  category        checklist_category NOT NULL,
  field_key       TEXT NOT NULL,
  field_label     TEXT NOT NULL,
  value           NUMERIC,
  unit            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(work_order_id, category, field_key)
);

CREATE INDEX idx_measurements_wo ON pm_measurements(work_order_id);

-- =============================================================
-- ATTACHMENTS TABLE
-- =============================================================

CREATE TABLE attachments (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_order_id           UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  checklist_response_id   UUID REFERENCES checklist_responses(id) ON DELETE SET NULL,
  file_name               TEXT NOT NULL,
  file_url                TEXT NOT NULL,
  file_type               TEXT NOT NULL,
  file_size               BIGINT,
  uploaded_by             UUID NOT NULL REFERENCES users(id),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attachments_wo ON attachments(work_order_id);
CREATE INDEX idx_attachments_response ON attachments(checklist_response_id);

-- =============================================================
-- MAINTENANCE LOGS TABLE
-- =============================================================

CREATE TABLE maintenance_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id         UUID NOT NULL REFERENCES tower_sites(id) ON DELETE CASCADE,
  work_order_id   UUID REFERENCES work_orders(id) ON DELETE SET NULL,
  action          TEXT NOT NULL,
  performed_by    UUID NOT NULL REFERENCES users(id),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_maint_logs_site ON maintenance_logs(site_id);
CREATE INDEX idx_maint_logs_wo ON maintenance_logs(work_order_id);

-- =============================================================
-- NOTIFICATIONS TABLE
-- =============================================================

CREATE TABLE notifications (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title                   TEXT NOT NULL,
  message                 TEXT NOT NULL,
  type                    notification_type NOT NULL DEFAULT 'system',
  is_read                 BOOLEAN NOT NULL DEFAULT FALSE,
  related_work_order_id   UUID REFERENCES work_orders(id) ON DELETE SET NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;

-- =============================================================
-- ACTIVITY LOGS TABLE
-- =============================================================

CREATE TABLE activity_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_created ON activity_logs(created_at DESC);

-- =============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_tower_sites_updated_at BEFORE UPDATE ON tower_sites FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_pm_schedules_updated_at BEFORE UPDATE ON pm_schedules FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_work_orders_updated_at BEFORE UPDATE ON work_orders FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_checklist_updated_at BEFORE UPDATE ON checklist_responses FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- =============================================================
-- WORK ORDER NUMBER SEQUENCE
-- =============================================================

CREATE SEQUENCE work_order_seq START 1;

CREATE OR REPLACE FUNCTION generate_work_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.work_order_number IS NULL OR NEW.work_order_number = '' THEN
    NEW.work_order_number := 'WO-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('work_order_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER work_order_number_trigger
  BEFORE INSERT ON work_orders
  FOR EACH ROW EXECUTE FUNCTION generate_work_order_number();
