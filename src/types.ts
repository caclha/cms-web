export type UserRole = 
  | 'denomination_admin' 
  | 'denomination_overseer' 
  | 'organization_admin' 
  | 'pastor' 
  | 'treasurer';

export interface Tenant {
  id: string;
  name: string;
  denomination: string;
  city: string;
  state: string;
  logoUrl?: string;
  primaryColor: string; // e.g. '#e11d48' for red, '#4f46e5' for indigo
  memberCount: number;
  establishedYear: number;
  code?: string;
  address?: string;
  country?: string;
  email?: string;
  phone?: string;
  website?: string;
  pastorInCharge?: string;
  status?: 'active' | 'inactive';
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  tenantId?: string; // Null if global denomination level
}

export interface MemberRecord {
  id: string;
  tenantId: string;
  memberId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  avatarUrl?: string;
  gender?: 'male' | 'female';
  dob?: string;
  maritalStatus?: 'single' | 'married' | 'widowed' | 'divorced';
  occupation?: string;
  nationality?: string;
  state?: string;
  address?: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  joinedDate: string;
  baptismStatus?: 'baptized' | 'unbaptized';
  isWorker?: boolean;
  department?: string;
  serviceUnit?: string;
  smallGroup?: string; // Cell Group
  category: 'visitor' | 'first-timer' | 'member' | 'worker' | 'minister' | 'pastor' | 'elder' | 'deacon' | 'executive';
  history?: string[];
}

export interface FinancialRecord {
  id: string;
  tenantId: string;
  contributorName?: string; // Optional for anonymous or expenses
  category: 'tithe' | 'offering' | 'donation' | 'expense';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
}

export interface SermonRecord {
  id: string;
  tenantId: string;
  title: string;
  preacher: string;
  date: string;
  series?: string;
  duration: string;
  views: number;
  status: 'published' | 'draft';
}

export interface GlobalAuditLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  branchName?: string;
  actor: string;
  action: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'denomination_admin' | 'organization_admin' | 'pastor' | 'department_head' | 'finance_officer' | 'attendance_officer' | 'follow_up_officer' | 'member';
  tenantId?: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

export interface Department {
  id: string;
  tenantId: string;
  name: string;
  leaderId?: string;
  memberIds: string[];
  attendance: { [date: string]: { [memberId: string]: boolean } };
  description?: string;
}

export interface CellGroup {
  id: string;
  tenantId: string;
  name: string;
  leaderId?: string;
  memberIds: string[];
  location?: string;
  meetingDay?: string;
  attendance: { [date: string]: { [memberId: string]: boolean } };
}

export interface AttendanceSession {
  id: string;
  tenantId: string;
  date: string;
  type: 'Sunday Service' | 'Midweek Service' | 'Prayer Meeting' | 'Cell Meeting' | 'Department Meeting' | 'Special Programs';
  presentIds: string[];
  absentIds: string[];
  qrCodeToken?: string;
}

export interface EventProgram {
  id: string;
  tenantId: string;
  title: string;
  type: 'Conferences' | 'Retreats' | 'Trainings' | 'Crusades' | 'Baptisms' | 'Weddings' | 'Special Services';
  date: string;
  location: string;
  registrantIds: string[];
  volunteerAssignments: { [memberId: string]: string };
  attendanceIds: string[];
}
