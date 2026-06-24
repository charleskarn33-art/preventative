-- =============================================================
-- TELCOCARE PM — Row Level Security (RLS) Policies
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tower_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pm_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pm_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE auth_user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function to get current user's id
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE auth_user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function to get current user's region
CREATE OR REPLACE FUNCTION get_user_region()
RETURNS TEXT AS $$
  SELECT region FROM users WHERE auth_user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- =============================================================
-- USERS POLICIES
-- =============================================================

-- Super admin can see all users
CREATE POLICY "super_admin_all_users" ON users
  FOR ALL TO authenticated
  USING (get_user_role() = 'super_admin');

-- Users can see their own profile
CREATE POLICY "users_own_profile" ON users
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

-- Managers can see all users
CREATE POLICY "managers_view_users" ON users
  FOR SELECT TO authenticated
  USING (get_user_role() IN ('maintenance_manager', 'regional_supervisor'));

-- =============================================================
-- TOWER SITES POLICIES
-- =============================================================

-- Super admin and managers can do anything
CREATE POLICY "admin_manager_all_sites" ON tower_sites
  FOR ALL TO authenticated
  USING (get_user_role() IN ('super_admin', 'maintenance_manager'));

-- Supervisors see sites in their region
CREATE POLICY "supervisor_regional_sites" ON tower_sites
  FOR SELECT TO authenticated
  USING (
    get_user_role() = 'regional_supervisor' AND
    region = get_user_region()
  );

-- Technicians see only assigned sites
CREATE POLICY "technician_assigned_sites" ON tower_sites
  FOR SELECT TO authenticated
  USING (
    get_user_role() = 'field_technician' AND
    assigned_technician_id = get_user_id()
  );

-- =============================================================
-- WORK ORDERS POLICIES
-- =============================================================

-- Admin and managers see all work orders
CREATE POLICY "admin_manager_all_wo" ON work_orders
  FOR ALL TO authenticated
  USING (get_user_role() IN ('super_admin', 'maintenance_manager'));

-- Supervisors see work orders in their region (via site)
CREATE POLICY "supervisor_regional_wo" ON work_orders
  FOR SELECT TO authenticated
  USING (
    get_user_role() = 'regional_supervisor' AND
    site_id IN (
      SELECT id FROM tower_sites WHERE region = get_user_region()
    )
  );

-- Supervisors can approve (update) work orders in their region
CREATE POLICY "supervisor_approve_wo" ON work_orders
  FOR UPDATE TO authenticated
  USING (
    get_user_role() = 'regional_supervisor' AND
    site_id IN (SELECT id FROM tower_sites WHERE region = get_user_region())
  );

-- Technicians see only their assigned work orders
CREATE POLICY "technician_own_wo" ON work_orders
  FOR SELECT TO authenticated
  USING (
    get_user_role() = 'field_technician' AND
    technician_id = get_user_id()
  );

-- Technicians can update their own work orders (e.g., start, complete)
CREATE POLICY "technician_update_own_wo" ON work_orders
  FOR UPDATE TO authenticated
  USING (
    get_user_role() = 'field_technician' AND
    technician_id = get_user_id() AND
    status IN ('assigned', 'in_progress')
  );

-- =============================================================
-- CHECKLIST RESPONSES POLICIES
-- =============================================================

-- Admin and managers
CREATE POLICY "admin_manager_all_checklist" ON checklist_responses
  FOR ALL TO authenticated
  USING (get_user_role() IN ('super_admin', 'maintenance_manager'));

-- Supervisors view checklists for their region's work orders
CREATE POLICY "supervisor_view_checklists" ON checklist_responses
  FOR SELECT TO authenticated
  USING (
    get_user_role() = 'regional_supervisor' AND
    work_order_id IN (
      SELECT wo.id FROM work_orders wo
      JOIN tower_sites ts ON wo.site_id = ts.id
      WHERE ts.region = get_user_region()
    )
  );

-- Technicians manage their own checklists
CREATE POLICY "technician_own_checklists" ON checklist_responses
  FOR ALL TO authenticated
  USING (
    get_user_role() = 'field_technician' AND
    work_order_id IN (
      SELECT id FROM work_orders WHERE technician_id = get_user_id()
    )
  );

-- =============================================================
-- NOTIFICATIONS POLICIES
-- =============================================================

-- Users only see their own notifications
CREATE POLICY "own_notifications" ON notifications
  FOR ALL TO authenticated
  USING (user_id = get_user_id());

-- =============================================================
-- ATTACHMENTS POLICIES
-- =============================================================

-- Admin and managers
CREATE POLICY "admin_manager_attachments" ON attachments
  FOR ALL TO authenticated
  USING (get_user_role() IN ('super_admin', 'maintenance_manager'));

-- Technicians can upload/view attachments on their work orders
CREATE POLICY "technician_own_attachments" ON attachments
  FOR ALL TO authenticated
  USING (
    work_order_id IN (
      SELECT id FROM work_orders WHERE technician_id = get_user_id()
    )
  );

-- Supervisors can view
CREATE POLICY "supervisor_view_attachments" ON attachments
  FOR SELECT TO authenticated
  USING (
    get_user_role() = 'regional_supervisor' AND
    work_order_id IN (
      SELECT wo.id FROM work_orders wo
      JOIN tower_sites ts ON wo.site_id = ts.id
      WHERE ts.region = get_user_region()
    )
  );
