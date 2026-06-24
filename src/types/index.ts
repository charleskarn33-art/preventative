export * from './database'

export interface KPIData {
  totalSites: number
  pmCompliance: number
  upcomingPM: number
  completedPM: number
  overduePM: number
  openWorkOrders: number
  activeTechnicians: number
}

export interface SiteWithTechnician {
  id: string
  site_id: string
  site_name: string
  region: string
  county: string
  latitude: number | null
  longitude: number | null
  status: string
  tower_type: string
  installation_date: string | null
  technician?: {
    id: string
    full_name: string
    email: string
  }
}

export interface WorkOrderWithDetails {
  id: string
  work_order_number: string
  site: { site_name: string; site_id: string; region: string }
  pm_type: string
  technician?: { full_name: string; email: string }
  supervisor?: { full_name: string }
  status: string
  priority: string
  due_date: string
  created_at: string
}

export interface ChecklistItem {
  key: string
  label: string
  category: string
}

export interface GeneratorMeasurements {
  // No specific measurements for generator beyond checklist items
}

export interface DCSystemMeasurements {
  amp_load_phase_1: number | null
  amp_load_phase_2: number | null
  amp_load_phase_3: number | null
  amp_load_phase_4: number | null
  amp_load_phase_5: number | null
  amp_load_phase_6: number | null
  amp_load_phase_7: number | null
}

export interface BatteryMeasurements {
  battery_1_voltage: number | null
  battery_2_voltage: number | null
  battery_3_voltage: number | null
  battery_4_voltage: number | null
  battery_5_voltage: number | null
  battery_6_voltage: number | null
  battery_7_voltage: number | null
  battery_8_voltage: number | null
}

export interface SolarMeasurements {
  damaged_panels_count: number | null
}
