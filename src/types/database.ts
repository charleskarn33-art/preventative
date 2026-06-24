export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: UserRole
          phone: string | null
          avatar_url: string | null
          region: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      tower_sites: {
        Row: {
          id: string
          site_id: string
          site_name: string
          region: string
          county: string
          latitude: number | null
          longitude: number | null
          status: SiteStatus
          tower_type: TowerType
          installation_date: string | null
          assigned_technician_id: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['tower_sites']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tower_sites']['Insert']>
      }
      pm_schedules: {
        Row: {
          id: string
          site_id: string
          pm_type: PMType
          frequency: PMFrequency
          next_due_date: string
          last_completed_date: string | null
          assigned_technician_id: string | null
          is_active: boolean
          template_id: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['pm_schedules']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pm_schedules']['Insert']>
      }
      work_orders: {
        Row: {
          id: string
          work_order_number: string
          site_id: string
          pm_schedule_id: string | null
          pm_type: PMType
          technician_id: string | null
          supervisor_id: string | null
          status: WorkOrderStatus
          priority: Priority
          due_date: string
          started_at: string | null
          completed_at: string | null
          approved_at: string | null
          notes: string | null
          supervisor_notes: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['work_orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['work_orders']['Insert']>
      }
      checklist_responses: {
        Row: {
          id: string
          work_order_id: string
          category: ChecklistCategory
          question_key: string
          response: ChecklistResponse
          comment: string | null
          corrective_action: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['checklist_responses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['checklist_responses']['Insert']>
      }
      attachments: {
        Row: {
          id: string
          work_order_id: string
          checklist_response_id: string | null
          file_name: string
          file_url: string
          file_type: string
          file_size: number | null
          uploaded_by: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['attachments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['attachments']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: NotificationType
          is_read: boolean
          related_work_order_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      maintenance_logs: {
        Row: {
          id: string
          site_id: string
          work_order_id: string
          action: string
          performed_by: string
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['maintenance_logs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['maintenance_logs']['Insert']>
      }
    }
  }
}

export type UserRole = 'super_admin' | 'maintenance_manager' | 'regional_supervisor' | 'field_technician'
export type SiteStatus = 'active' | 'inactive' | 'under_maintenance' | 'decommissioned'
export type TowerType = 'monopole' | 'guyed_tower' | 'self_support' | 'rooftop' | 'camouflaged'
export type PMType = 'daily' | 'weekly' | 'monthly'
export type PMFrequency = 'daily' | 'weekly' | 'monthly'
export type WorkOrderStatus = 'open' | 'assigned' | 'in_progress' | 'pending_approval' | 'completed' | 'overdue'
export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type ChecklistCategory = 'generator' | 'dc_system' | 'battery' | 'solar' | 'cleaning' | 'rms'
export type ChecklistResponse = 'yes' | 'no' | 'na'
export type NotificationType = 'pm_due' | 'pm_overdue' | 'work_order_assigned' | 'approval_required' | 'pm_completed' | 'system'
