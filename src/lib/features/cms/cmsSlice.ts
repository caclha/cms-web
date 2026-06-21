import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserSession, Tenant, MemberRecord, FinancialRecord, SermonRecord, GlobalAuditLog, PlatformUser, Department, CellGroup, AttendanceSession, EventProgram } from '../../../types';
import { MOCK_USERS, MOCK_TENANTS, MOCK_MEMBERS, MOCK_FINANCES, MOCK_SERMONS, MOCK_AUDIT_LOGS, MOCK_PLATFORM_USERS, MOCK_DEPARTMENTS, MOCK_CELL_GROUPS, MOCK_ATTENDANCE_SESSIONS, MOCK_EVENTS } from '../../../utils/mockData';

interface CmsState {
  session: UserSession | null;
  activeTenant: Tenant | null;
  tenants: Tenant[];
  members: MemberRecord[];
  finances: FinancialRecord[];
  sermons: SermonRecord[];
  auditLogs: GlobalAuditLog[];
  platformUsers: PlatformUser[];
  departments: Department[];
  cellGroups: CellGroup[];
  attendanceSessions: AttendanceSession[];
  events: EventProgram[];
}

const initialState: CmsState = {
  session: null,
  activeTenant: null,
  tenants: MOCK_TENANTS,
  members: MOCK_MEMBERS,
  finances: MOCK_FINANCES,
  sermons: MOCK_SERMONS,
  auditLogs: MOCK_AUDIT_LOGS,
  platformUsers: MOCK_PLATFORM_USERS,
  departments: MOCK_DEPARTMENTS,
  cellGroups: MOCK_CELL_GROUPS,
  attendanceSessions: MOCK_ATTENDANCE_SESSIONS,
  events: MOCK_EVENTS,
};

export const cmsSlice = createSlice({
  name: 'cms',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ session: UserSession; tenant?: Tenant }>) => {
      state.session = action.payload.session;
      state.activeTenant = action.payload.tenant || null;
      
      const newLog: GlobalAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'info',
        branchName: action.payload.tenant?.name || 'HQ Office',
        actor: action.payload.session.name,
        action: `Logged into CMS via ${action.payload.tenant ? 'Local Branch Portal' : 'Denomination HQ Portal'}`
      };
      state.auditLogs = [newLog, ...state.auditLogs];
    },
    logout: (state) => {
      if (state.session) {
        const newLog: GlobalAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          level: 'info',
          branchName: state.activeTenant?.name || 'HQ Office',
          actor: state.session.name,
          action: 'Signed out of workspace'
        };
        state.auditLogs = [newLog, ...state.auditLogs];
      }
      state.session = null;
      state.activeTenant = null;
    },
    updateSession: (state, action: PayloadAction<{ session: UserSession; tenant?: Tenant }>) => {
      state.session = action.payload.session;
      state.activeTenant = action.payload.tenant || null;
    },
    addTenant: (state, action: PayloadAction<Omit<Tenant, 'memberCount'>>) => {
      const newTenant: Tenant = {
        ...action.payload,
        memberCount: 0
      };
      state.tenants.push(newTenant);
      
      const newLog: GlobalAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'info',
        actor: state.session?.name || 'Administrator',
        action: `Registered new branch/tenant: ${newTenant.name} (${newTenant.city})`
      };
      state.auditLogs = [newLog, ...state.auditLogs];
    },
    addMember: (state, action: PayloadAction<Omit<MemberRecord, 'id' | 'joinedDate'>>) => {
      const newMember: MemberRecord = {
        ...action.payload,
        id: `m-${Date.now()}`,
        joinedDate: new Date().toISOString().substring(0, 10),
        history: [`Registered in system as a ${action.payload.category} on ${new Date().toISOString().substring(0, 10)}.`]
      };
      state.members.unshift(newMember);

      // Increment tenant memberCount
      const tenant = state.tenants.find(t => t.id === action.payload.tenantId);
      if (tenant) {
        tenant.memberCount += 1;
      }

      // Log audit
      const newLog: GlobalAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'info',
        branchName: tenant?.name || 'Local Branch',
        actor: state.session?.name || 'System',
        action: `Registered new member: ${newMember.firstName} ${newMember.lastName} (${newMember.memberId})`
      };
      state.auditLogs = [newLog, ...state.auditLogs];
    },
    editMember: (state, action: PayloadAction<MemberRecord>) => {
      const idx = state.members.findIndex(m => m.id === action.payload.id);
      if (idx !== -1) {
        const prev = state.members[idx];
        const history = prev.history ? [...prev.history] : [];
        
        // Audit significant field changes
        if (prev.status !== action.payload.status) {
          history.push(`Status changed from ${prev.status} to ${action.payload.status} on ${new Date().toISOString().substring(0, 10)}.`);
        }
        if (prev.category !== action.payload.category) {
          history.push(`Category changed from ${prev.category} to ${action.payload.category} on ${new Date().toISOString().substring(0, 10)}.`);
        }
        if (prev.isWorker !== action.payload.isWorker) {
          history.push(`Worker status updated to ${action.payload.isWorker ? 'Yes' : 'No'} on ${new Date().toISOString().substring(0, 10)}.`);
        }
        
        state.members[idx] = {
          ...action.payload,
          history
        };

        const tenant = state.tenants.find(t => t.id === action.payload.tenantId);
        const newLog: GlobalAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          level: 'info',
          branchName: tenant?.name || 'Local Branch',
          actor: state.session?.name || 'System',
          action: `Updated profile for member: ${action.payload.firstName} ${action.payload.lastName} (${action.payload.memberId})`
        };
        state.auditLogs = [newLog, ...state.auditLogs];
      }
    },
    transferMember: (state, action: PayloadAction<{ memberId: string; targetTenantId: string }>) => {
      const member = state.members.find(m => m.id === action.payload.memberId);
      if (member) {
        const sourceTenantId = member.tenantId;
        const targetTenantId = action.payload.targetTenantId;
        
        if (sourceTenantId !== targetTenantId) {
          // Decrement memberCount for source branch
          const sourceTenant = state.tenants.find(t => t.id === sourceTenantId);
          if (sourceTenant && sourceTenant.memberCount > 0) {
            sourceTenant.memberCount -= 1;
          }
          
          // Increment memberCount for target branch
          const targetTenant = state.tenants.find(t => t.id === targetTenantId);
          if (targetTenant) {
            targetTenant.memberCount += 1;
          }

          const sourceName = sourceTenant?.name || sourceTenantId;
          const targetName = targetTenant?.name || targetTenantId;

          // Update member record
          member.tenantId = targetTenantId;
          if (!member.history) {
            member.history = [];
          }
          member.history.push(`Transferred from ${sourceName} to ${targetName} on ${new Date().toISOString().substring(0, 10)}.`);

          // Log audit
          const newLog: GlobalAuditLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            level: 'warn',
            actor: state.session?.name || 'System',
            action: `Transferred member ${member.firstName} ${member.lastName} from branch [${sourceName}] to [${targetName}]`
          };
          state.auditLogs = [newLog, ...state.auditLogs];
        }
      }
    },
    suspendMember: (state, action: PayloadAction<{ memberId: string }>) => {
      const member = state.members.find(m => m.id === action.payload.memberId);
      if (member) {
        const prevStatus = member.status;
        const newStatus = prevStatus === 'suspended' ? 'active' : 'suspended';
        member.status = newStatus;
        if (!member.history) {
          member.history = [];
        }
        member.history.push(`Membership ${newStatus === 'suspended' ? 'suspended' : 'reactivated'} on ${new Date().toISOString().substring(0, 10)}.`);

        // Log audit
        const tenant = state.tenants.find(t => t.id === member.tenantId);
        const newLog: GlobalAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          level: 'warn',
          branchName: tenant?.name || 'Local Branch',
          actor: state.session?.name || 'System',
          action: `${newStatus === 'suspended' ? 'Suspended' : 'Reactivated'} membership for ${member.firstName} ${member.lastName}`
        };
        state.auditLogs = [newLog, ...state.auditLogs];
      }
    },
    addFinancialRecord: (state, action: PayloadAction<Omit<FinancialRecord, 'id' | 'date' | 'status'>>) => {
      const newRecord: FinancialRecord = {
        ...action.payload,
        id: `f-${Date.now()}`,
        date: new Date().toISOString().substring(0, 10),
        status: 'completed'
      };
      state.finances.unshift(newRecord);
      
      if (action.payload.category === 'expense' && state.session) {
        const tenant = state.tenants.find(t => t.id === action.payload.tenantId);
        const newLog: GlobalAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          level: 'info',
          branchName: tenant?.name || 'Local Branch',
          actor: state.session.name,
          action: `Logged budget expenditure: ${newRecord.notes || 'General expense'} (₦${newRecord.amount.toLocaleString()})`
        };
        state.auditLogs = [newLog, ...state.auditLogs];
      }
    },
    addSermon: (state, action: PayloadAction<Omit<SermonRecord, 'id' | 'date' | 'views'>>) => {
      const newSermon: SermonRecord = {
        ...action.payload,
        id: `s-${Date.now()}`,
        date: new Date().toISOString().substring(0, 10),
        views: 0
      };
      state.sermons.unshift(newSermon);
    },
    editTenant: (state, action: PayloadAction<Tenant>) => {
      const idx = state.tenants.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.tenants[idx] = { ...state.tenants[idx], ...action.payload };
        if (state.activeTenant && state.activeTenant.id === action.payload.id) {
          state.activeTenant = { ...state.activeTenant, ...action.payload };
        }
        const newLog: GlobalAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          level: 'info',
          actor: state.session?.name || 'System',
          action: `Updated configurations for organization/branch: ${action.payload.name}`
        };
        state.auditLogs = [newLog, ...state.auditLogs];
      }
    },
    toggleTenantStatus: (state, action: PayloadAction<{ id: string }>) => {
      const idx = state.tenants.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        const currentStatus = state.tenants[idx].status || 'active';
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        state.tenants[idx].status = newStatus;
        if (state.activeTenant && state.activeTenant.id === action.payload.id) {
          state.activeTenant.status = newStatus;
        }
        const newLog: GlobalAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          level: 'warn',
          actor: state.session?.name || 'System',
          action: `Changed status of branch: ${state.tenants[idx].name} to ${newStatus.toUpperCase()}`
        };
        state.auditLogs = [newLog, ...state.auditLogs];
      }
    },
    addPlatformUser: (state, action: PayloadAction<Omit<PlatformUser, 'id'>>) => {
      const newUser: PlatformUser = {
        ...action.payload,
        id: `pu-${Date.now()}`
      };
      state.platformUsers.push(newUser);
      
      const newLog: GlobalAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'info',
        actor: state.session?.name || 'Administrator',
        action: `Assigned new platform user: ${newUser.name} as ${newUser.role.replace('_', ' ').toUpperCase()}`
      };
      state.auditLogs = [newLog, ...state.auditLogs];
    },
    updatePlatformUser: (state, action: PayloadAction<PlatformUser>) => {
      const idx = state.platformUsers.findIndex(u => u.id === action.payload.id);
      if (idx !== -1) {
        state.platformUsers[idx] = action.payload;
        const newLog: GlobalAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          level: 'info',
          actor: state.session?.name || 'System',
          action: `Updated platform user details & permissions for ${action.payload.name}`
        };
        state.auditLogs = [newLog, ...state.auditLogs];
      }
    },
    deletePlatformUser: (state, action: PayloadAction<string>) => {
      const user = state.platformUsers.find(u => u.id === action.payload);
      if (user) {
        state.platformUsers = state.platformUsers.filter(u => u.id !== action.payload);
        const newLog: GlobalAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          level: 'warn',
          actor: state.session?.name || 'System',
          action: `Revoked platform permissions and deleted user profile for ${user.name}`
        };
        state.auditLogs = [newLog, ...state.auditLogs];
      }
    },
    addDepartment: (state, action: PayloadAction<Omit<Department, 'id' | 'attendance'>>) => {
      const newDept: Department = {
        ...action.payload,
        id: `dept-${Date.now()}`,
        attendance: {}
      };
      state.departments.push(newDept);
      
      const newLog: GlobalAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'info',
        actor: state.session?.name || 'Administrator',
        action: `Created new department: ${newDept.name}`
      };
      state.auditLogs = [newLog, ...state.auditLogs];
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
      const idx = state.departments.findIndex(d => d.id === action.payload.id);
      if (idx !== -1) {
        state.departments[idx] = action.payload;
      }
    },
    addMemberToDepartment: (state, action: PayloadAction<{ deptId: string; memberId: string }>) => {
      const dept = state.departments.find(d => d.id === action.payload.deptId);
      if (dept && !dept.memberIds.includes(action.payload.memberId)) {
        dept.memberIds.push(action.payload.memberId);
      }
    },
    removeMemberFromDepartment: (state, action: PayloadAction<{ deptId: string; memberId: string }>) => {
      const dept = state.departments.find(d => d.id === action.payload.deptId);
      if (dept) {
        dept.memberIds = dept.memberIds.filter(id => id !== action.payload.memberId);
      }
    },
    logDepartmentAttendance: (state, action: PayloadAction<{ deptId: string; date: string; attendance: { [memberId: string]: boolean } }>) => {
      const dept = state.departments.find(d => d.id === action.payload.deptId);
      if (dept) {
        dept.attendance[action.payload.date] = action.payload.attendance;
        
        const newLog: GlobalAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          level: 'info',
          actor: state.session?.name || 'Administrator',
          action: `Recorded attendance for Department: ${dept.name} on ${action.payload.date}`
        };
        state.auditLogs = [newLog, ...state.auditLogs];
      }
    },
    addCellGroup: (state, action: PayloadAction<Omit<CellGroup, 'id' | 'attendance'>>) => {
      const newCell: CellGroup = {
        ...action.payload,
        id: `cell-${Date.now()}`,
        attendance: {}
      };
      state.cellGroups.push(newCell);
      
      const newLog: GlobalAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'info',
        actor: state.session?.name || 'Administrator',
        action: `Established new cell group: ${newCell.name}`
      };
      state.auditLogs = [newLog, ...state.auditLogs];
    },
    updateCellGroup: (state, action: PayloadAction<CellGroup>) => {
      const idx = state.cellGroups.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) {
        state.cellGroups[idx] = action.payload;
      }
    },
    addMemberToCell: (state, action: PayloadAction<{ cellId: string; memberId: string }>) => {
      const cell = state.cellGroups.find(c => c.id === action.payload.cellId);
      if (cell && !cell.memberIds.includes(action.payload.memberId)) {
        cell.memberIds.push(action.payload.memberId);
      }
    },
    removeMemberFromCell: (state, action: PayloadAction<{ cellId: string; memberId: string }>) => {
      const cell = state.cellGroups.find(c => c.id === action.payload.cellId);
      if (cell) {
        cell.memberIds = cell.memberIds.filter(id => id !== action.payload.memberId);
      }
    },
    logCellAttendance: (state, action: PayloadAction<{ cellId: string; date: string; attendance: { [memberId: string]: boolean } }>) => {
      const cell = state.cellGroups.find(c => c.id === action.payload.cellId);
      if (cell) {
        cell.attendance[action.payload.date] = action.payload.attendance;
        
        const newLog: GlobalAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          level: 'info',
          actor: state.session?.name || 'Administrator',
          action: `Recorded attendance for Cell Group: ${cell.name} on ${action.payload.date}`
        };
        state.auditLogs = [newLog, ...state.auditLogs];
      }
    },
    logAttendanceSession: (state, action: PayloadAction<Omit<AttendanceSession, 'id'>>) => {
      const newSession: AttendanceSession = {
        ...action.payload,
        id: `att-${Date.now()}`
      };
      state.attendanceSessions.unshift(newSession);
      
      const newLog: GlobalAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'info',
        actor: state.session?.name || 'System',
        action: `Logged ${newSession.type} attendance for ${newSession.date} (Present: ${newSession.presentIds.length}, Absent: ${newSession.absentIds.length})`
      };
      state.auditLogs = [newLog, ...state.auditLogs];
    },
    addEvent: (state, action: PayloadAction<Omit<EventProgram, 'id' | 'registrantIds' | 'volunteerAssignments' | 'attendanceIds'>>) => {
      const newEvent: EventProgram = {
        ...action.payload,
        id: `evt-${Date.now()}`,
        registrantIds: [],
        volunteerAssignments: {},
        attendanceIds: []
      };
      state.events.unshift(newEvent);
      
      const newLog: GlobalAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'info',
        actor: state.session?.name || 'Administrator',
        action: `Scheduled event: ${newEvent.title} (${newEvent.type}) on ${newEvent.date}`
      };
      state.auditLogs = [newLog, ...state.auditLogs];
    },
    updateEvent: (state, action: PayloadAction<EventProgram>) => {
      const idx = state.events.findIndex(e => e.id === action.payload.id);
      if (idx !== -1) {
        state.events[idx] = action.payload;
      }
    },
    registerForEvent: (state, action: PayloadAction<{ eventId: string; memberId: string }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event && !event.registrantIds.includes(action.payload.memberId)) {
        event.registrantIds.push(action.payload.memberId);
      }
    },
    assignVolunteer: (state, action: PayloadAction<{ eventId: string; memberId: string; role: string }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        event.volunteerAssignments[action.payload.memberId] = action.payload.role;
      }
    },
    logEventAttendance: (state, action: PayloadAction<{ eventId: string; memberIds: string[] }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        event.attendanceIds = action.payload.memberIds;
        
        const newLog: GlobalAuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          level: 'info',
          actor: state.session?.name || 'System',
          action: `Recorded attendee attendance for event: ${event.title} (${event.attendanceIds.length} attended)`
        };
        state.auditLogs = [newLog, ...state.auditLogs];
      }
    }
  }
});

export const { 
  login, 
  logout, 
  updateSession, 
  addTenant, 
  addMember, 
  editMember,
  transferMember,
  suspendMember,
  addFinancialRecord, 
  addSermon,
  editTenant,
  toggleTenantStatus,
  addPlatformUser,
  updatePlatformUser,
  deletePlatformUser,
  addDepartment,
  updateDepartment,
  addMemberToDepartment,
  removeMemberFromDepartment,
  logDepartmentAttendance,
  addCellGroup,
  updateCellGroup,
  addMemberToCell,
  removeMemberFromCell,
  logCellAttendance,
  logAttendanceSession,
  addEvent,
  updateEvent,
  registerForEvent,
  assignVolunteer,
  logEventAttendance
} = cmsSlice.actions;

export default cmsSlice.reducer;
