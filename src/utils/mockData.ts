import { Tenant, MemberRecord, FinancialRecord, SermonRecord, GlobalAuditLog, UserSession, PlatformUser, Department, CellGroup, AttendanceSession, EventProgram } from '../types';

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'lighthouse',
    name: 'Lighthouse Assembly',
    denomination: 'Christ Apostolic Church',
    city: 'Lagos',
    state: 'Lagos State',
    primaryColor: '#dc2626', // Red
    memberCount: 840,
    establishedYear: 2008,
    code: 'CAC-LH-001',
    address: '24 Lighthouse Way, Victoria Island',
    country: 'Nigeria',
    email: 'info@lighthouse.cac.org',
    phone: '+234 1 234 5678',
    website: 'https://lighthouse.cac.org',
    pastorInCharge: 'Pastor David Thompson',
    status: 'active'
  },
  {
    id: 'grace-cathedral',
    name: 'Grace Cathedral',
    denomination: 'Christ Apostolic Church',
    city: 'Abuja',
    state: 'FCT',
    primaryColor: '#4f46e5', // Indigo
    memberCount: 1420,
    establishedYear: 1995,
    code: 'CAC-GC-002',
    address: '8 Grace Avenue, Wuse II',
    country: 'Nigeria',
    email: 'info@grace.cac.org',
    phone: '+234 9 876 5432',
    website: 'https://grace.cac.org',
    pastorInCharge: 'Pastor Paul Adeyemi',
    status: 'active'
  },
  {
    id: 'dominion',
    name: 'Dominion Chapel',
    denomination: 'Christ Apostolic Church',
    city: 'Ibadan',
    state: 'Oyo State',
    primaryColor: '#0891b2', // Cyan
    memberCount: 420,
    establishedYear: 2018,
    code: 'CAC-DC-003',
    address: '15 Dominion Street, Bodija',
    country: 'Nigeria',
    email: 'info@dominion.cac.org',
    phone: '+234 2 555 0199',
    website: 'https://dominion.cac.org',
    pastorInCharge: 'Pastor John Olajide',
    status: 'active'
  }
];

export const MOCK_USERS: UserSession[] = [
  {
    id: 'u-den-admin',
    name: 'Pastor Johnson Adeyemi',
    email: 'general.overseer@cac-denomination.org',
    role: 'denomination_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'u-den-overseer',
    name: 'Dr. Elizabeth Benson',
    email: 'auditor@cac-denomination.org',
    role: 'denomination_overseer',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'u-org-admin',
    name: 'Brother Samuel Okoye',
    email: 'admin@lighthouse.org',
    role: 'organization_admin',
    tenantId: 'lighthouse',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'u-pastor',
    name: 'Pastor David Thompson',
    email: 'pastor@lighthouse.org',
    role: 'pastor',
    tenantId: 'lighthouse',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'u-treasurer',
    name: 'Deaconess Mary Alao',
    email: 'treasurer@lighthouse.org',
    role: 'treasurer',
    tenantId: 'lighthouse',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
  }
];

export const MOCK_MEMBERS: MemberRecord[] = [
  // Lighthouse Members
  { 
    id: 'm1', 
    tenantId: 'lighthouse', 
    memberId: 'CAC-M-001',
    firstName: 'Abiodun', 
    lastName: 'Folarin', 
    email: 'abiodun.f@gmail.com', 
    phone: '+234 803 111 2222', 
    status: 'active', 
    joinedDate: '2015-04-12', 
    smallGroup: 'Couples Fellowship',
    category: 'member',
    history: ['Registered as a standard branch member on 2015-04-12.']
  },
  { 
    id: 'm2', 
    tenantId: 'lighthouse', 
    memberId: 'CAC-M-002',
    firstName: 'Chidi', 
    lastName: 'Nwachukwu', 
    email: 'chidi.n@yahoo.com', 
    phone: '+234 812 333 4444', 
    status: 'active', 
    joinedDate: '2018-09-01', 
    smallGroup: 'Youth Fire',
    category: 'worker',
    history: ['Registered as a branch worker on 2018-09-01.']
  },
  { 
    id: 'm3', 
    tenantId: 'lighthouse', 
    memberId: 'CAC-M-003',
    firstName: 'Funmi', 
    lastName: 'Balogun', 
    email: 'funmi.balogun@outlook.com', 
    phone: '+234 905 555 6666', 
    status: 'active', 
    joinedDate: '2020-01-15', 
    smallGroup: 'Women of Grace',
    category: 'worker',
    history: ['Registered as a branch worker on 2020-01-15.']
  },
  { 
    id: 'm4', 
    tenantId: 'lighthouse', 
    memberId: 'CAC-M-004',
    firstName: 'Tunde', 
    lastName: 'Olatunji', 
    email: 'tunde.o@gmail.com', 
    phone: '+234 809 777 8888', 
    status: 'active', 
    joinedDate: '2026-05-10',
    category: 'first-timer',
    history: ['Registered as a first-timer visitor on 2026-05-10.']
  },
  { 
    id: 'm5', 
    tenantId: 'lighthouse', 
    memberId: 'CAC-M-005',
    firstName: 'Efe', 
    lastName: 'Okoro', 
    email: 'efe.okoro@gmail.com', 
    phone: '+234 701 999 0000', 
    status: 'inactive', 
    joinedDate: '2012-06-20', 
    smallGroup: 'Men of Valor',
    category: 'member',
    history: ['Registered as a standard branch member on 2012-06-20.', 'Set to inactive due to relocation on 2025-10-11.']
  },
  { 
    id: 'm6', 
    tenantId: 'lighthouse', 
    memberId: 'CAC-M-006',
    firstName: 'Sarah', 
    lastName: 'Dada', 
    email: 'sarah.dada@gmail.com', 
    phone: '+234 806 222 3333', 
    status: 'active', 
    joinedDate: '2021-11-30', 
    smallGroup: 'Choir',
    category: 'worker',
    history: ['Registered as a choir department worker on 2021-11-30.']
  },
  
  // Grace Cathedral Members
  { 
    id: 'm7', 
    tenantId: 'grace-cathedral', 
    memberId: 'CAC-M-007',
    firstName: 'Emeka', 
    lastName: 'Opara', 
    email: 'emeka.o@gmail.com', 
    phone: '+234 803 999 1111', 
    status: 'active', 
    joinedDate: '1998-05-18', 
    smallGroup: 'Elder Council',
    category: 'elder',
    history: ['Registered as ordained branch Elder on 1998-05-18.']
  },
  { 
    id: 'm8', 
    tenantId: 'grace-cathedral', 
    memberId: 'CAC-M-008',
    firstName: 'Yetunde', 
    lastName: 'Adewale', 
    email: 'yetunde.a@gmail.com', 
    phone: '+234 812 444 5555', 
    status: 'active', 
    joinedDate: '2005-08-25', 
    smallGroup: 'Choir',
    category: 'member',
    history: ['Registered as standard branch member on 2005-08-25.']
  },
  { 
    id: 'm9', 
    tenantId: 'grace-cathedral', 
    memberId: 'CAC-M-009',
    firstName: 'Bilikisu', 
    lastName: 'Sanni', 
    email: 'bilikisu.s@gmail.com', 
    phone: '+234 905 222 8888', 
    status: 'active', 
    joinedDate: '2026-06-01',
    category: 'visitor',
    history: ['Registered as a Sunday service visitor on 2026-06-01.']
  },
  { 
    id: 'm10', 
    tenantId: 'grace-cathedral', 
    memberId: 'CAC-M-010',
    firstName: 'Grace', 
    lastName: 'Ibrahim', 
    email: 'grace.i@gmail.com', 
    phone: '+234 809 111 5555', 
    status: 'active', 
    joinedDate: '2019-10-10', 
    smallGroup: 'Youth Fire',
    category: 'member',
    history: ['Registered as a standard branch member on 2019-10-10.']
  },
  
  // Dominion Chapel Members
  { 
    id: 'm11', 
    tenantId: 'dominion', 
    memberId: 'CAC-M-011',
    firstName: 'Olumide', 
    lastName: 'Ajayi', 
    email: 'olumide.aj@gmail.com', 
    phone: '+234 806 999 4444', 
    status: 'active', 
    joinedDate: '2019-02-14', 
    smallGroup: 'Evangelism Unit',
    category: 'worker',
    history: ['Registered as an evangelism worker on 2019-02-14.']
  },
  { 
    id: 'm12', 
    tenantId: 'dominion', 
    memberId: 'CAC-M-012',
    firstName: 'Joy', 
    lastName: 'Eze', 
    email: 'joy.eze@gmail.com', 
    phone: '+234 701 555 3333', 
    status: 'active', 
    joinedDate: '2022-07-19', 
    smallGroup: 'Sisters Circle',
    category: 'member',
    history: ['Registered as standard branch member on 2022-07-19.']
  }
];

export const MOCK_FINANCES: FinancialRecord[] = [
  // Lighthouse Finances
  { id: 'f1', tenantId: 'lighthouse', contributorName: 'Abiodun Folarin', category: 'tithe', amount: 85000, date: '2026-06-12', status: 'completed' },
  { id: 'f2', tenantId: 'lighthouse', contributorName: 'Sunday Collection', category: 'offering', amount: 142000, date: '2026-06-10', status: 'completed' },
  { id: 'f3', tenantId: 'lighthouse', contributorName: 'Anonymous Donor', category: 'donation', amount: 250000, date: '2026-06-08', status: 'completed', notes: 'Building fund' },
  { id: 'f4', tenantId: 'lighthouse', contributorName: 'PHCN Electricity', category: 'expense', amount: 45000, date: '2026-06-05', status: 'completed', notes: 'Power bill' },
  { id: 'f5', tenantId: 'lighthouse', contributorName: 'Chidi Nwachukwu', category: 'tithe', amount: 60000, date: '2026-06-02', status: 'completed' },
  { id: 'f6', tenantId: 'lighthouse', contributorName: 'Sound System Repair', category: 'expense', amount: 120000, date: '2026-06-01', status: 'completed', notes: 'Audio maintenance' },
  { id: 'f7', tenantId: 'lighthouse', contributorName: 'Welfare Outreach', category: 'expense', amount: 80000, date: '2026-05-28', status: 'completed', notes: 'Community feeding' },
  { id: 'f8', tenantId: 'lighthouse', contributorName: 'Sarah Dada', category: 'donation', amount: 35000, date: '2026-05-25', status: 'completed', notes: 'Choir robes' },

  // Grace Cathedral Finances
  { id: 'f9', tenantId: 'grace-cathedral', contributorName: 'Emeka Opara', category: 'tithe', amount: 150000, date: '2026-06-13', status: 'completed' },
  { id: 'f10', tenantId: 'grace-cathedral', contributorName: 'Sunday Collection', category: 'offering', amount: 310000, date: '2026-06-10', status: 'completed' },
  { id: 'f11', tenantId: 'grace-cathedral', contributorName: 'Generator Diesel', category: 'expense', amount: 95000, date: '2026-06-06', status: 'completed' },
  { id: 'f12', tenantId: 'grace-cathedral', contributorName: 'Pastor Honorarium', category: 'expense', amount: 150000, date: '2026-06-04', status: 'completed' },

  // Dominion Chapel Finances
  { id: 'f13', tenantId: 'dominion', contributorName: 'Sunday Collection', category: 'offering', amount: 58000, date: '2026-06-10', status: 'completed' },
  { id: 'f14', tenantId: 'dominion', contributorName: 'Rent Payment', category: 'expense', amount: 200000, date: '2026-06-02', status: 'completed', notes: 'Hall leasing' }
];

export const MOCK_SERMONS: SermonRecord[] = [
  { id: 's1', tenantId: 'lighthouse', title: 'The Power of Unbroken Covenant', preacher: 'Pastor David Thompson', date: '2026-06-07', series: 'Covenant Walk', duration: '45 mins', views: 242, status: 'published' },
  { id: 's2', tenantId: 'lighthouse', title: 'Faith that Works in Hard Times', preacher: 'Pastor David Thompson', date: '2026-05-31', series: 'Faith Pillars', duration: '52 mins', views: 318, status: 'published' },
  { id: 's3', tenantId: 'lighthouse', title: 'Spiritual Warfare: Helm of Salvation', preacher: 'Pastor David Thompson', date: '2026-05-24', series: 'Armor of God', duration: '38 mins', views: 189, status: 'published' },
  { id: 's4', tenantId: 'lighthouse', title: 'Excellence in Christian Stewardship', preacher: 'Deaconess Mary Alao', date: '2026-05-17', duration: '41 mins', views: 92, status: 'published' },
  { id: 's5', tenantId: 'lighthouse', title: 'Reclaiming Lost Territory', preacher: 'Pastor David Thompson', date: '2026-06-14', series: 'Covenant Walk', duration: '48 mins', views: 0, status: 'draft' }
];

export const MOCK_AUDIT_LOGS: GlobalAuditLog[] = [
  { id: 'l1', timestamp: '2026-06-14 09:12:15', level: 'info', branchName: 'Lighthouse Assembly', actor: 'Samuel Okoye (Admin)', action: 'Updated local membership directory configurations' },
  { id: 'l2', timestamp: '2026-06-13 18:41:02', level: 'info', branchName: 'Grace Cathedral', actor: 'Emeka Opara (Admin)', action: 'Generated quarterly branch financial records' },
  { id: 'l3', timestamp: '2026-06-13 10:25:34', level: 'warn', branchName: 'Dominion Chapel', actor: 'Olumide Ajayi', action: 'Failed login attempt - IP 102.89.34.19' },
  { id: 'l4', timestamp: '2026-06-12 14:10:48', level: 'info', branchName: 'Lighthouse Assembly', actor: 'Mary Alao (Treasurer)', action: 'Approved welfare expense voucher ID #9021' },
  { id: 'l5', timestamp: '2026-06-11 11:05:01', level: 'error', branchName: 'System Core', actor: 'Automation', action: 'API integration timeout with Flutterwave gateway' }
];

export const MOCK_PLATFORM_USERS: PlatformUser[] = [
  {
    id: 'pu1',
    name: 'Brother Samuel Okoye',
    email: 'admin@lighthouse.org',
    role: 'organization_admin',
    tenantId: 'lighthouse',
    status: 'active',
    permissions: ['manage_members', 'manage_departments', 'manage_attendance', 'manage_cells', 'manage_events']
  },
  {
    id: 'pu2',
    name: 'Pastor David Thompson',
    email: 'pastor@lighthouse.org',
    role: 'pastor',
    tenantId: 'lighthouse',
    status: 'active',
    permissions: ['manage_members', 'manage_departments', 'manage_attendance', 'manage_cells', 'manage_events', 'publish_sermons']
  },
  {
    id: 'pu3',
    name: 'Deaconess Mary Alao',
    email: 'treasurer@lighthouse.org',
    role: 'finance_officer',
    tenantId: 'lighthouse',
    status: 'active',
    permissions: ['manage_finances']
  },
  {
    id: 'pu4',
    name: 'Chidi Nwachukwu',
    email: 'chidi.n@yahoo.com',
    role: 'attendance_officer',
    tenantId: 'lighthouse',
    status: 'active',
    permissions: ['manage_attendance']
  },
  {
    id: 'pu5',
    name: 'Funmi Balogun',
    email: 'funmi.balogun@outlook.com',
    role: 'follow_up_officer',
    tenantId: 'lighthouse',
    status: 'active',
    permissions: ['manage_members']
  }
];

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 'dept1',
    tenantId: 'lighthouse',
    name: 'Choir',
    leaderId: 'm6',
    memberIds: ['m2', 'm3', 'm6'],
    attendance: {
      '2026-06-11': { 'm2': true, 'm3': true, 'm6': true },
      '2026-06-04': { 'm2': true, 'm3': false, 'm6': true }
    },
    description: 'Praise & Worship ministry team for Sunday services.'
  },
  {
    id: 'dept2',
    tenantId: 'lighthouse',
    name: 'Media Team',
    leaderId: 'm2',
    memberIds: ['m1', 'm2'],
    attendance: {
      '2026-06-11': { 'm1': true, 'm2': true }
    },
    description: 'Livestreaming, visual projection, and sound systems setup.'
  },
  {
    id: 'dept3',
    tenantId: 'lighthouse',
    name: 'Youth Ministry',
    leaderId: 'm3',
    memberIds: ['m2', 'm3', 'm4'],
    attendance: {
      '2026-06-09': { 'm2': true, 'm3': true, 'm4': false }
    },
    description: 'Nurturing the younger generation in faith and leadership.'
  }
];

export const MOCK_CELL_GROUPS: CellGroup[] = [
  {
    id: 'cell1',
    tenantId: 'lighthouse',
    name: 'Victoria Island Fellowship',
    leaderId: 'm1',
    memberIds: ['m1', 'm2', 'm4'],
    location: '24 Lighthouse Way, VI',
    meetingDay: 'Wednesdays 6:00 PM',
    attendance: {
      '2026-06-10': { 'm1': true, 'm2': true, 'm4': true },
      '2026-06-03': { 'm1': true, 'm2': false, 'm4': true }
    }
  },
  {
    id: 'cell2',
    tenantId: 'lighthouse',
    name: 'Lekki Fire Center',
    leaderId: 'm3',
    memberIds: ['m3', 'm6'],
    location: 'Block B2, Lekki Phase 1',
    meetingDay: 'Thursdays 7:00 PM',
    attendance: {
      '2026-06-11': { 'm3': true, 'm6': true }
    }
  }
];

export const MOCK_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'att1',
    tenantId: 'lighthouse',
    date: '2026-06-14',
    type: 'Sunday Service',
    presentIds: ['m1', 'm2', 'm3', 'm6'],
    absentIds: ['m4', 'm5'],
    qrCodeToken: 'qr-sun-20260614'
  },
  {
    id: 'att2',
    tenantId: 'lighthouse',
    date: '2026-06-10',
    type: 'Midweek Service',
    presentIds: ['m1', 'm2', 'm3'],
    absentIds: ['m4', 'm5', 'm6'],
    qrCodeToken: 'qr-mid-20260610'
  }
];

export const MOCK_EVENTS: EventProgram[] = [
  {
    id: 'evt1',
    tenantId: 'lighthouse',
    title: 'Annual Fire Conference 2026',
    type: 'Conferences',
    date: '2026-07-15',
    location: 'Lighthouse Main Auditorium',
    registrantIds: ['m1', 'm2', 'm3', 'm4', 'm6'],
    volunteerAssignments: {
      'm2': 'Media Setup',
      'm3': 'Ushering Head',
      'm6': 'Choir Coordinator'
    },
    attendanceIds: []
  },
  {
    id: 'evt2',
    tenantId: 'lighthouse',
    title: 'Joint Water Baptism Service',
    type: 'Baptisms',
    date: '2026-06-28',
    location: 'Grace Cathedral Pool, Abuja',
    registrantIds: ['m4'],
    volunteerAssignments: {
      'm1': 'Protocol Coordinator'
    },
    attendanceIds: []
  }
];
