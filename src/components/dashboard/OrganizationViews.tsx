import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { 
  addMember, 
  editMember, 
  transferMember, 
  suspendMember, 
  addFinancialRecord, 
  addSermon,
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
} from '../../lib/features/cms/cmsSlice';
import { RootState } from '../../lib/store';
import { Tenant, UserSession, MemberRecord, FinancialRecord, SermonRecord, PlatformUser, Department, CellGroup, AttendanceSession, EventProgram, GlobalAuditLog } from '../../types';
import { 
  Users, DollarSign, Calendar, BookOpen, Activity, 
  Plus, Search, Shield, Filter, ClipboardList, CheckCircle2, TrendingUp, TrendingDown,
  Edit2, ArrowLeftRight, Eye, Lock, Unlock, QrCode, ClipboardCheck, Network, FolderHeart, Trash2, Check, UserPlus, X
} from 'lucide-react';

interface ViewProps {
  session: UserSession;
  tenant: Tenant;
  activeTab: string;
}

export default function OrganizationViews({ session, tenant, activeTab }: ViewProps) {
  const dispatch = useAppDispatch();
  const { 
    tenants, members, finances, sermons, 
    platformUsers, departments: allDepartments, cellGroups: allCellGroups, 
    attendanceSessions: allAttendanceSessions, events: allEvents, auditLogs 
  } = useAppSelector((state: RootState) => state.cms);

  // Dynamic colors
  const activeColor = tenant.primaryColor;

  // Local lists filtered by tenantId
  const branchMembers = members.filter(m => m.tenantId === tenant.id);
  const branchFinances = finances.filter(f => f.tenantId === tenant.id);
  const branchSermons = sermons.filter(s => s.tenantId === tenant.id);

  // Extended States for Member Management
  const [selectedMemberForView, setSelectedMemberForView] = useState<MemberRecord | null>(null);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<MemberRecord | null>(null);
  const [selectedMemberForTransfer, setSelectedMemberForTransfer] = useState<MemberRecord | null>(null);
  const [targetTransferTenantId, setTargetTransferTenantId] = useState('');

  const [mMemberId, setMMemberId] = useState('');
  const [mFirst, setMFirst] = useState('');
  const [mMiddle, setMMiddle] = useState('');
  const [mLast, setMLast] = useState('');
  const [mAvatarUrl, setMAvatarUrl] = useState('');
  const [mGender, setMGender] = useState<'male' | 'female'>('male');
  const [mDob, setMDob] = useState('');
  const [mMaritalStatus, setMMaritalStatus] = useState<'single' | 'married' | 'widowed' | 'divorced'>('single');
  const [mOccupation, setMOccupation] = useState('');
  const [mNationality, setMNationality] = useState('Nigerian');
  const [mState, setMState] = useState('');
  const [mAddress, setMAddress] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mStatus, setMStatus] = useState<'active' | 'inactive' | 'suspended'>('active');
  const [mCategory, setMCategory] = useState<MemberRecord['category']>('member');
  const [mBaptismStatus, setMBaptismStatus] = useState<'baptized' | 'unbaptized'>('baptized');
  const [mIsWorker, setMIsWorker] = useState(false);
  const [mDepartment, setMDepartment] = useState('');
  const [mServiceUnit, setMServiceUnit] = useState('');
  const [mGroup, setMGroup] = useState('Youth Fire');

  // Local filtered lists
  const branchDepartments = allDepartments.filter(d => d.tenantId === tenant.id);
  const branchCellGroups = allCellGroups.filter(c => c.tenantId === tenant.id);
  const branchAttendanceSessions = allAttendanceSessions.filter(a => a.tenantId === tenant.id);
  const branchEvents = allEvents.filter(e => e.tenantId === tenant.id);
  const branchPlatformUsers = platformUsers.filter(u => u.tenantId === tenant.id);
  const branchAuditLogs = auditLogs.filter(l => l.branchName === tenant.name || l.branchName === 'System Core');

  // Departments State
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [dName, setDName] = useState('');
  const [dLeaderId, setDLeaderId] = useState('');
  const [dDescription, setDDescription] = useState('');
  const [selectedDeptForView, setSelectedDeptForView] = useState<Department | null>(null);
  const [showDeptAttendanceForm, setShowDeptAttendanceForm] = useState(false);
  const [deptAttendanceDate, setDeptAttendanceDate] = useState(new Date().toISOString().substring(0, 10));
  const [deptAttendanceStates, setDeptAttendanceStates] = useState<{ [memberId: string]: boolean }>({});

  // Attendance State
  const [attType, setAttType] = useState<AttendanceSession['type']>('Sunday Service');
  const [attDate, setAttDate] = useState(new Date().toISOString().substring(0, 10));
  const [attendancePresentIds, setAttendancePresentIds] = useState<string[]>([]);
  const [qrCodeToken, setQrCodeToken] = useState('');
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [scannedTokensCount, setScannedTokensCount] = useState(0);

  // Cell Groups State
  const [showCellForm, setShowCellForm] = useState(false);
  const [cName, setCName] = useState('');
  const [cLeaderId, setCLeaderId] = useState('');
  const [cLocation, setCLocation] = useState('');
  const [cMeetingDay, setCMeetingDay] = useState('Wednesdays 6:00 PM');
  const [selectedCellForView, setSelectedCellForView] = useState<CellGroup | null>(null);
  const [showCellAttendanceForm, setShowCellAttendanceForm] = useState(false);
  const [cellAttendanceDate, setCellAttendanceDate] = useState(new Date().toISOString().substring(0, 10));
  const [cellAttendanceStates, setCellAttendanceStates] = useState<{ [memberId: string]: boolean }>({});

  // Events State
  const [showEventForm, setShowEventForm] = useState(false);
  const [eTitle, setETitle] = useState('');
  const [eType, setEType] = useState<EventProgram['type']>('Conferences');
  const [eDate, setEDate] = useState(new Date().toISOString().substring(0, 10));
  const [eLocation, setELocation] = useState('');
  const [selectedEventForView, setSelectedEventForView] = useState<EventProgram | null>(null);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [vMemberId, setVMemberId] = useState('');
  const [vRole, setVRole] = useState('');
  const [showEventAttendanceForm, setShowEventAttendanceForm] = useState(false);
  const [eventAttendanceStates, setEventAttendanceStates] = useState<{ [memberId: string]: boolean }>({});

  // Platform Users / Admin State
  const [showUserForm, setShowUserForm] = useState(false);
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uRole, setURole] = useState<PlatformUser['role']>('member');
  const [uPermissions, setUPermissions] = useState<string[]>([]);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<PlatformUser | null>(null);

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // States for Pastor
  const [showSermonForm, setShowSermonForm] = useState(false);
  const [sTitle, setSTitle] = useState('');
  const [sPreacher, setSPreacher] = useState(session.name);
  const [sSeries, setSSeries] = useState('');
  const [sDuration, setSDuration] = useState('45 mins');
  const [sStatus, setSStatus] = useState<'published' | 'draft'>('published');

  // States for Treasurer
  const [showFinanceForm, setShowFinanceForm] = useState(false);
  const [fCategory, setFCategory] = useState<'tithe' | 'offering' | 'donation' | 'expense'>('tithe');
  const [fName, setFName] = useState('');
  const [fAmount, setFAmount] = useState('');
  const [fNotes, setFNotes] = useState('');

  // Reset helper
  const resetMemberForm = () => {
    setMMemberId('');
    setMFirst('');
    setMMiddle('');
    setMLast('');
    setMAvatarUrl('');
    setMGender('male');
    setMDob('');
    setMMaritalStatus('single');
    setMOccupation('');
    setMNationality('Nigerian');
    setMState('');
    setMAddress('');
    setMEmail('');
    setMPhone('');
    setMStatus('active');
    setMCategory('member');
    setMBaptismStatus('baptized');
    setMIsWorker(false);
    setMDepartment('');
    setMServiceUnit('');
    setMGroup('Youth Fire');
    setShowMemberForm(false);
    setSelectedMemberForEdit(null);
  };

  // Edit helper
  const openEditMember = (m: MemberRecord) => {
    setSelectedMemberForEdit(m);
    setMMemberId(m.memberId);
    setMFirst(m.firstName);
    setMMiddle(m.middleName || '');
    setMLast(m.lastName);
    setMAvatarUrl(m.avatarUrl || '');
    setMGender(m.gender || 'male');
    setMDob(m.dob || '');
    setMMaritalStatus(m.maritalStatus || 'single');
    setMOccupation(m.occupation || '');
    setMNationality(m.nationality || 'Nigerian');
    setMState(m.state || '');
    setMAddress(m.address || '');
    setMEmail(m.email);
    setMPhone(m.phone);
    setMStatus(m.status);
    setMCategory(m.category);
    setMBaptismStatus(m.baptismStatus || 'baptized');
    setMIsWorker(!!m.isWorker);
    setMDepartment(m.department || '');
    setMServiceUnit(m.serviceUnit || '');
    setMGroup(m.smallGroup || 'Youth Fire');
    setShowMemberForm(true);
  };

  // Handle Add / Edit Member
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mFirst || !mLast || !mEmail || !mPhone || !mMemberId) return;

    const memberData = {
      tenantId: tenant.id,
      memberId: mMemberId,
      firstName: mFirst,
      middleName: mMiddle || undefined,
      lastName: mLast,
      avatarUrl: mAvatarUrl || undefined,
      gender: mGender || undefined,
      dob: mDob || undefined,
      maritalStatus: mMaritalStatus || undefined,
      occupation: mOccupation || undefined,
      nationality: mNationality || undefined,
      state: mState || undefined,
      address: mAddress || undefined,
      email: mEmail,
      phone: mPhone,
      status: mStatus,
      baptismStatus: mBaptismStatus || undefined,
      isWorker: mIsWorker,
      department: mDepartment || undefined,
      serviceUnit: mServiceUnit || undefined,
      smallGroup: mGroup || undefined,
      category: mCategory
    };

    if (selectedMemberForEdit) {
      dispatch(editMember({
        ...selectedMemberForEdit,
        ...memberData
      }));
    } else {
      dispatch(addMember(memberData));
    }

    resetMemberForm();
  };

  // Handle Transfer Member
  const handleTransfer = () => {
    if (selectedMemberForTransfer && targetTransferTenantId) {
      dispatch(transferMember({
        memberId: selectedMemberForTransfer.id,
        targetTenantId: targetTransferTenantId
      }));
      setSelectedMemberForTransfer(null);
      setTargetTransferTenantId('');
    }
  };

  // Handle Add Sermon
  const handleAddSermon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sTitle || !sPreacher) return;

    dispatch(addSermon({
      tenantId: tenant.id,
      title: sTitle,
      preacher: sPreacher,
      series: sSeries || undefined,
      duration: sDuration,
      status: sStatus
    }));

    // Reset
    setSTitle('');
    setSSeries('');
    setShowSermonForm(false);
  };

  // Handle Add Transaction
  const handleAddFinance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fAmount || isNaN(parseFloat(fAmount))) return;

    dispatch(addFinancialRecord({
      tenantId: tenant.id,
      contributorName: fCategory === 'expense' ? fName : (fName || 'Anonymous'),
      category: fCategory,
      amount: parseFloat(fAmount),
      notes: fNotes || undefined
    }));

    // Reset
    setFName('');
    setFAmount('');
    setFNotes('');
    setShowFinanceForm(false);
  };

  // Calculations for dashboard
  const activeMembersCount = branchMembers.filter(m => m.status === 'active').length;
  const guestMembersCount = branchMembers.filter(m => m.category === 'first-timer' || m.category === 'visitor').length;

  const totalRevenue = branchFinances
    .filter(f => f.category !== 'expense')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalExpenseOut = branchFinances
    .filter(f => f.category === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);

  // Filters members
  const filteredMembers = branchMembers.filter(m => {
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(memberSearch.toLowerCase()) || 
      m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.memberId.toLowerCase().includes(memberSearch.toLowerCase()) ||
      (m.phone && m.phone.includes(memberSearch));
    const matchesFilter = memberFilter === 'all' || m.status === memberFilter;
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesFilter && matchesCategory;
  });

  // ----------------------------------------------------
  // BRANCH ADMIN VIEW
  // ----------------------------------------------------
  if (session.role === 'organization_admin') {
    if (activeTab === 'overview') {
      return (
        <div className="space-y-6">
          
          {/* Local Statistics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Active Congregation</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white">{tenant.memberCount} Registered</h3>
                </div>
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${activeColor}15` }}>
                  <Users className="w-5 h-5" style={{ color: activeColor }} />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-neutral-400 flex items-center">
                <span>{activeMembersCount} Fully Active • {guestMembersCount} Guests</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Weekly Services</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white">4 Scheduled</h3>
                </div>
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${activeColor}15` }}>
                  <Calendar className="w-5 h-5" style={{ color: activeColor }} />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-neutral-400">
                Sunday Main, Wednesday Power, Friday Prayer, Cells
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Staff & Ministers</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white">8 Active Roles</h3>
                </div>
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${activeColor}15` }}>
                  <Shield className="w-5 h-5" style={{ color: activeColor }} />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-neutral-400">
                1 Pastor, 1 Treasurer, 2 Deacons, 4 Ushers
              </div>
            </div>

          </div>

          {/* Quick Member Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick list of members */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-neutral-900/40 p-5 rounded-2xl border border-neutral-900/60 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Congregation Register</h4>
                  <p className="text-[10px] text-neutral-500">Quick list of members registered at this assembly.</p>
                </div>
                <button
                  onClick={() => setShowMemberForm(!showMemberForm)}
                  className="flex items-center space-x-1.5 px-3 py-2 text-[10px] font-bold text-white rounded-xl shadow-lg transition-colors"
                  style={{ backgroundColor: activeColor }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Member</span>
                </button>
              </div>

              {/* Roster list */}
              <div className="glass-panel rounded-2xl border border-neutral-900/60 overflow-hidden divide-y divide-neutral-900">
                {branchMembers.slice(0, 4).map((m) => (
                  <div key={m.id} className="p-4 flex items-center justify-between hover:bg-neutral-900/20 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-neutral-300 text-xs">
                        {m.firstName[0]}{m.lastName[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{m.firstName} {m.lastName}</p>
                        <p className="text-[10px] text-neutral-500">{m.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {m.smallGroup && (
                        <span className="hidden sm:inline-block text-[9px] bg-neutral-950 text-neutral-400 border border-neutral-900 px-2 py-0.5 rounded-md">
                          {m.smallGroup}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        m.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        m.status === 'suspended' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        'bg-neutral-800 text-neutral-400'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick staff alert */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
                  <ClipboardList className="w-4 h-4 mr-1.5" style={{ color: activeColor }} />
                  Pastor & Staff Schedule
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-950/40 rounded-xl border border-neutral-900 text-[10px] leading-relaxed">
                    <p className="font-bold text-neutral-300">Sunday Service Preparation</p>
                    <p className="text-neutral-500">Scheduled for Saturday 16:00. Ushers and Audio team checklist verification.</p>
                  </div>
                  <div className="p-3 bg-neutral-950/40 rounded-xl border border-neutral-900 text-[10px] leading-relaxed">
                    <p className="font-bold text-neutral-300">Mid-Week Bible Study</p>
                    <p className="text-neutral-500">Wednesday 18:30. Theme: 'Walking in Righteousness'. Preacher: Pastor David Thompson.</p>
                  </div>
                </div>
              </div>
              <div className="text-[8px] text-neutral-600 font-mono text-center pt-4 border-t border-neutral-900/60 mt-4">
                Local Assembly Management Engine
              </div>
            </div>

          </div>

        </div>
      );
    }

    if (activeTab === 'members') {
      return (
        <div className="space-y-6 text-neutral-200">
          {/* Header block with search & filter controls */}
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Local Assembly Congregation Roster</h3>
              <p className="text-xs text-neutral-400">Search, classify, and manage members, cell groups, and branch transfers.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search by ID, Name, Email..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-neutral-700 text-neutral-200"
                />
              </div>

              {/* Status filter selection */}
              <div className="flex items-center space-x-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
                {['all', 'active', 'inactive', 'suspended'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setMemberFilter(f as any)}
                    className={`px-2 py-1 text-[9px] font-bold rounded uppercase transition-all ${
                      memberFilter === f 
                        ? 'bg-neutral-900 text-white shadow-sm' 
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Category filter dropdown */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-[10px] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-neutral-700"
              >
                <option value="all">All Categories</option>
                <option value="visitor">Visitor</option>
                <option value="first-timer">First Timer</option>
                <option value="member">Member</option>
                <option value="worker">Worker</option>
                <option value="minister">Minister</option>
                <option value="pastor">Pastor</option>
                <option value="elder">Elder</option>
                <option value="deacon">Deacon</option>
                <option value="executive">Executive</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  resetMemberForm();
                  setShowMemberForm(true);
                }}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-white rounded-lg shadow transition-colors"
                style={{ backgroundColor: activeColor }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Member</span>
              </button>
            </div>
          </div>

          {/* Add / Edit Member form block */}
          {showMemberForm && (
            <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 transition-all">
              <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center">
                {selectedMemberForEdit ? (
                  <>
                    <Edit2 className="w-4 h-4 mr-1.5" style={{ color: activeColor }} />
                    Update Member Profile: {selectedMemberForEdit.firstName} {selectedMemberForEdit.lastName}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1.5" style={{ color: activeColor }} />
                    Register Assembly Member
                  </>
                )}
              </h4>
              <form onSubmit={handleSaveMember} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Column 1: Personal Information */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-800 pb-1.5">
                      1. Personal Information
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">FIRST NAME *</label>
                        <input
                          type="text"
                          required
                          placeholder="First Name"
                          value={mFirst}
                          onChange={(e) => setMFirst(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">MIDDLE NAME</label>
                        <input
                          type="text"
                          placeholder="Middle Name"
                          value={mMiddle}
                          onChange={(e) => setMMiddle(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">LAST NAME *</label>
                        <input
                          type="text"
                          required
                          placeholder="Last Name"
                          value={mLast}
                          onChange={(e) => setMLast(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">EMAIL ADDRESS *</label>
                        <input
                          type="email"
                          required
                          placeholder="email@example.com"
                          value={mEmail}
                          onChange={(e) => setMEmail(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">PHONE NUMBER *</label>
                        <input
                          type="text"
                          required
                          placeholder="+234 803 000 0000"
                          value={mPhone}
                          onChange={(e) => setMPhone(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">GENDER</label>
                        <select
                          value={mGender}
                          onChange={(e) => setMGender(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">DATE OF BIRTH</label>
                        <input
                          type="date"
                          value={mDob}
                          onChange={(e) => setMDob(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">MARITAL STATUS</label>
                        <select
                          value={mMaritalStatus}
                          onChange={(e) => setMMaritalStatus(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        >
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="widowed">Widowed</option>
                          <option value="divorced">Divorced</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">OCCUPATION</label>
                        <input
                          type="text"
                          placeholder="e.g. Engineer"
                          value={mOccupation}
                          onChange={(e) => setMOccupation(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">NATIONALITY</label>
                        <input
                          type="text"
                          value={mNationality}
                          onChange={(e) => setMNationality(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">STATE OF ORIGIN</label>
                        <input
                          type="text"
                          placeholder="e.g. Lagos State"
                          value={mState}
                          onChange={(e) => setMState(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-neutral-500">RESIDENTIAL ADDRESS</label>
                      <input
                        type="text"
                        placeholder="Residential Address"
                        value={mAddress}
                        onChange={(e) => setMAddress(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-neutral-500">PROFILE PICTURE URL</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={mAvatarUrl}
                        onChange={(e) => setMAvatarUrl(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                      />
                    </div>
                  </div>

                  {/* Column 2: Church Information */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-800 pb-1.5">
                      2. Church Information
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">MEMBERSHIP ID *</label>
                        <input
                          type="text"
                          required
                          placeholder="CAC-M-001"
                          value={mMemberId}
                          onChange={(e) => setMMemberId(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">MEMBERSHIP CATEGORY *</label>
                        <select
                          value={mCategory}
                          onChange={(e) => setMCategory(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        >
                          <option value="visitor">Visitor</option>
                          <option value="first-timer">First Timer</option>
                          <option value="member">Member</option>
                          <option value="worker">Worker</option>
                          <option value="minister">Minister</option>
                          <option value="pastor">Pastor</option>
                          <option value="elder">Elder</option>
                          <option value="deacon">Deacon</option>
                          <option value="executive">Executive</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">MEMBERSHIP STATUS</label>
                        <select
                          value={mStatus}
                          onChange={(e) => setMStatus(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">BAPTISM STATUS</label>
                        <select
                          value={mBaptismStatus}
                          onChange={(e) => setMBaptismStatus(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        >
                          <option value="baptized">Water Baptized</option>
                          <option value="unbaptized">Unbaptized</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isWorkerCheckbox"
                          checked={mIsWorker}
                          onChange={(e) => setMIsWorker(e.target.checked)}
                          className="rounded border-neutral-850 bg-neutral-900 text-neutral-200 focus:ring-0"
                        />
                        <label htmlFor="isWorkerCheckbox" className="text-[10px] font-bold text-neutral-300 select-none">
                          DESIGNATED CHURCH WORKER
                        </label>
                      </div>
                      <p className="text-[9px] text-neutral-500">
                        Checking this lists this member under the department and service unit allocations below.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">DEPARTMENT</label>
                        <input
                          type="text"
                          placeholder="e.g. Media"
                          value={mDepartment}
                          onChange={(e) => setMDepartment(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">SERVICE UNIT</label>
                        <input
                          type="text"
                          placeholder="e.g. Audio Tech"
                          value={mServiceUnit}
                          onChange={(e) => setMServiceUnit(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500">CELL GROUP / HOUSE CELL</label>
                        <input
                          type="text"
                          placeholder="e.g. Youth Fire"
                          value={mGroup}
                          onChange={(e) => setMGroup(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={resetMemberForm}
                    className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-white text-xs font-bold shadow transition-colors"
                    style={{ backgroundColor: activeColor }}
                  >
                    {selectedMemberForEdit ? 'Save Changes' : 'Register Member'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Members Table */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-neutral-950 border-b border-neutral-800 text-[10px] font-bold text-neutral-400 uppercase">
                    <th className="p-4">Member ID</th>
                    <th className="p-4">Photo</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Small Group</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-neutral-500 font-medium">
                        No congregation records matching search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-neutral-950 transition-colors">
                        <td className="p-4 font-mono text-[10px] text-neutral-400 font-bold">{m.memberId}</td>
                        <td className="p-4">
                          {m.avatarUrl ? (
                            <img
                              src={m.avatarUrl}
                              alt={`${m.firstName} avatar`}
                              className="w-7 h-7 rounded-lg object-cover border border-neutral-800"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center font-bold text-neutral-400 text-[10px]">
                              {m.firstName[0]}{m.lastName[0]}
                            </div>
                          )}
                        </td>
                        <td className="p-4 font-bold text-white">
                          {m.firstName} {m.middleName ? `${m.middleName} ` : ''}{m.lastName}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-neutral-950 text-neutral-400 border border-neutral-800">
                            {m.category}
                          </span>
                        </td>
                        <td className="p-4 space-y-0.5">
                          <p className="text-neutral-300 font-medium">{m.email}</p>
                          <p className="text-neutral-500 text-[10px]">{m.phone}</p>
                        </td>
                        <td className="p-4 text-neutral-400">{m.smallGroup || '-'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                            m.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            m.status === 'suspended' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            'bg-neutral-800 text-neutral-400 border border-neutral-700'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedMemberForView(m)}
                              title="View Profile History"
                              className="p-1.5 rounded bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => openEditMember(m)}
                              title="Edit Profile"
                              className="p-1.5 rounded bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedMemberForTransfer(m)}
                              title="Transfer Branch"
                              className="p-1.5 rounded bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => dispatch(suspendMember({ memberId: m.id }))}
                              title={m.status === 'suspended' ? 'Reactivate Membership' : 'Suspend Membership'}
                              className={`p-1.5 rounded bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors ${
                                m.status === 'suspended' ? 'text-emerald-400 hover:text-emerald-300' : 'text-rose-400 hover:text-rose-300'
                              }`}
                            >
                              {m.status === 'suspended' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* VIEW PROFILE MODAL */}
          {selectedMemberForView && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
              <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Member Details Card</span>
                  <button
                    type="button"
                    onClick={() => setSelectedMemberForView(null)}
                    className="text-neutral-500 hover:text-white text-xs font-bold uppercase"
                  >
                    Close
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6">
                  {/* Hero card */}
                  <div className="flex items-center space-x-4 bg-neutral-950/50 p-4 rounded-xl border border-neutral-800">
                    {selectedMemberForView.avatarUrl ? (
                      <img
                        src={selectedMemberForView.avatarUrl}
                        alt={`${selectedMemberForView.firstName} avatar`}
                        className="w-16 h-16 rounded-xl object-cover border border-neutral-800 shadow"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center font-bold text-neutral-400 text-lg">
                        {selectedMemberForView.firstName[0]}{selectedMemberForView.lastName[0]}
                      </div>
                    )}
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">
                        {selectedMemberForView.firstName} {selectedMemberForView.middleName ? `${selectedMemberForView.middleName} ` : ''}{selectedMemberForView.lastName}
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-mono font-bold tracking-wider">ID: {selectedMemberForView.memberId}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-neutral-950 border border-neutral-800 text-neutral-400">
                          {selectedMemberForView.category}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                          selectedMemberForView.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          selectedMemberForView.status === 'suspended' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}>
                          {selectedMemberForView.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal details grid */}
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-800 pb-1">
                        Personal Info
                      </h5>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div>
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">Gender</p>
                          <p className="text-white font-medium capitalize">{selectedMemberForView.gender || '-'}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">Date of Birth</p>
                          <p className="text-white font-medium">{selectedMemberForView.dob || '-'}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">Marital Status</p>
                          <p className="text-white font-medium capitalize">{selectedMemberForView.maritalStatus || '-'}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">Occupation</p>
                          <p className="text-white font-medium">{selectedMemberForView.occupation || '-'}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">Nationality</p>
                          <p className="text-white font-medium">{selectedMemberForView.nationality || '-'}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">State of Origin</p>
                          <p className="text-white font-medium">{selectedMemberForView.state || '-'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">Residential Address</p>
                          <p className="text-white font-medium leading-relaxed">{selectedMemberForView.address || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Church details grid */}
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-800 pb-1">
                        Church Info
                      </h5>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div>
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">Baptism Status</p>
                          <p className="text-white font-medium capitalize">{selectedMemberForView.baptismStatus || '-'}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">Worker Status</p>
                          <p className="text-white font-medium">{selectedMemberForView.isWorker ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">Department</p>
                          <p className="text-white font-medium">{selectedMemberForView.department || '-'}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">Service Unit</p>
                          <p className="text-white font-medium">{selectedMemberForView.serviceUnit || '-'}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">Cell Group</p>
                          <p className="text-white font-medium">{selectedMemberForView.smallGroup || '-'}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500 text-[9px] font-bold uppercase">Date Joined</p>
                          <p className="text-white font-medium font-mono">{selectedMemberForView.joinedDate || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Membership History / Audit trail */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-800 pb-1">
                      Membership History Logs
                    </h5>
                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 max-h-40 overflow-y-auto">
                      {selectedMemberForView.history && selectedMemberForView.history.length > 0 ? (
                        selectedMemberForView.history.map((log, index) => (
                          <div key={index} className="text-[10px] text-neutral-400 flex items-start space-x-2 leading-relaxed">
                            <span className="text-neutral-600 font-bold font-mono">[{index + 1}]</span>
                            <span>{log}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-neutral-500 italic text-center py-2">
                          No history transitions logged for this member profile.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TRANSFER MEMBER MODAL */}
          {selectedMemberForTransfer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
              <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Transfer Member to Branch</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMemberForTransfer(null);
                      setTargetTransferTenantId('');
                    }}
                    className="text-neutral-500 hover:text-white text-xs font-bold uppercase"
                  >
                    Close
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Select a target Christ Apostolic Church branch to transfer <strong className="text-white">{selectedMemberForTransfer.firstName} {selectedMemberForTransfer.lastName}</strong>.
                    This will automatically decrement the congregation count at the current branch, update the target branch, and log the transition in the member history.
                  </p>
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase">Target Branch / Tenant</label>
                    <select
                      value={targetTransferTenantId}
                      onChange={(e) => setTargetTransferTenantId(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                    >
                      <option value="">Select Branch...</option>
                      {tenants
                        .filter((t) => t.id !== tenant.id)
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.city})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMemberForTransfer(null);
                        setTargetTransferTenantId('');
                      }}
                      className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!targetTransferTenantId}
                      onClick={handleTransfer}
                      className="px-4 py-2 rounded-lg text-white text-xs font-bold shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: activeColor }}
                    >
                      Initiate Transfer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'departments') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-neutral-900/40 p-6 rounded-2xl border border-neutral-900/60">
            <div>
              <h3 className="text-sm font-bold text-white">Department Management</h3>
              <p className="text-xs text-neutral-400">Manage church departments, assign leaders, enroll workers, and track attendance.</p>
            </div>
            <button
              onClick={() => {
                setShowDeptForm(!showDeptForm);
                setDName('');
                setDLeaderId('');
                setDDescription('');
              }}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all"
              style={{ backgroundColor: activeColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Department</span>
            </button>
          </div>

          {showDeptForm && (
            <div className="glass-panel p-6 rounded-2xl border border-neutral-900 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase">New Department Setup</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">Department Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Choir, Ushers, Media Team"
                    value={dName}
                    onChange={(e) => setDName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">Department Head / Leader</label>
                  <select
                    value={dLeaderId}
                    onChange={(e) => setDLeaderId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                  >
                    <option value="">Select Leader...</option>
                    {branchMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.memberId})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-500 uppercase">Description / Scope</label>
                <textarea
                  placeholder="Describe department roles and service unit duties..."
                  value={dDescription}
                  onChange={(e) => setDDescription(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700 h-20"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowDeptForm(false)}
                  className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!dName) return;
                    dispatch(addDepartment({
                      tenantId: tenant.id,
                      name: dName,
                      leaderId: dLeaderId || undefined,
                      memberIds: dLeaderId ? [dLeaderId] : [],
                      description: dDescription
                    }));
                    setShowDeptForm(false);
                  }}
                  className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors"
                  style={{ backgroundColor: activeColor }}
                >
                  Save Department
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branchDepartments.map(dept => {
              const leader = branchMembers.find(m => m.id === dept.leaderId);
              return (
                <div key={dept.id} className="glass-panel p-6 rounded-2xl border border-neutral-900 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Service Unit</span>
                        <h4 className="text-base font-extrabold text-white">{dept.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-neutral-800 text-neutral-400">
                        {dept.memberIds.length} Workers
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{dept.description || 'No description provided.'}</p>
                    
                    <div className="mt-4 p-3 bg-neutral-950/40 rounded-xl border border-neutral-900 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center font-bold text-xs text-neutral-400">
                        {leader ? `${leader.firstName[0]}${leader.lastName[0]}` : '??'}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">HOD / Leader</p>
                        <p className="text-xs font-bold text-white">{leader ? `${leader.firstName} ${leader.lastName}` : 'No Assigned Leader'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-900/60">
                    <button
                      onClick={() => {
                        setSelectedDeptForView(dept);
                        setShowDeptAttendanceForm(false);
                      }}
                      className="text-xs text-neutral-400 hover:text-white font-bold transition-colors flex items-center space-x-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Manage Members ({dept.memberIds.length})</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDeptForView(dept);
                        setShowDeptAttendanceForm(true);
                        setDeptAttendanceDate(new Date().toISOString().substring(0, 10));
                        const initialStates: { [id: string]: boolean } = {};
                        dept.memberIds.forEach(id => {
                          initialStates[id] = true;
                        });
                        setDeptAttendanceStates(initialStates);
                      }}
                      className="text-xs font-bold transition-colors flex items-center space-x-1.5"
                      style={{ color: activeColor }}
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      <span>Log Attendance</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedDeptForView && !showDeptAttendanceForm && (
            <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="glass-panel w-full max-w-xl rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-neutral-900/40">
                  <div>
                    <h3 className="text-sm font-bold text-white">Manage Members: {selectedDeptForView.name}</h3>
                    <p className="text-xs text-neutral-400">Add or remove members from the department roster.</p>
                  </div>
                  <button
                    onClick={() => setSelectedDeptForView(null)}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase">Enroll New Department Worker</label>
                    <div className="flex space-x-2">
                      <select
                        id="dept-enroll-select"
                        className="flex-1 bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                      >
                        <option value="">Select Congregation Member...</option>
                        {branchMembers
                          .filter(m => !selectedDeptForView.memberIds.includes(m.id))
                          .map(m => (
                            <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.memberId})</option>
                          ))
                        }
                      </select>
                      <button
                        onClick={() => {
                          const selectEl = document.getElementById('dept-enroll-select') as HTMLSelectElement;
                          if (selectEl && selectEl.value) {
                            dispatch(addMemberToDepartment({ deptId: selectedDeptForView.id, memberId: selectEl.value }));
                            setSelectedDeptForView({
                              ...selectedDeptForView,
                              memberIds: [...selectedDeptForView.memberIds, selectEl.value]
                            });
                            selectEl.value = '';
                          }
                        }}
                        className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors"
                        style={{ backgroundColor: activeColor }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Current Department Roster</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {selectedDeptForView.memberIds.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic">No workers currently enrolled in this department.</p>
                      ) : (
                        selectedDeptForView.memberIds.map(id => {
                          const m = branchMembers.find(mem => mem.id === id);
                          if (!m) return null;
                          return (
                            <div key={id} className="flex justify-between items-center p-3 bg-neutral-950/40 rounded-xl border border-neutral-900">
                              <div>
                                <p className="text-xs font-bold text-white">{m.firstName} {m.lastName}</p>
                                <p className="text-[9px] text-neutral-500 font-mono">{m.memberId} • {m.email}</p>
                              </div>
                              <button
                                onClick={() => {
                                  dispatch(removeMemberFromDepartment({ deptId: selectedDeptForView.id, memberId: id }));
                                  setSelectedDeptForView({
                                    ...selectedDeptForView,
                                    memberIds: selectedDeptForView.memberIds.filter(mid => mid !== id)
                                  });
                                }}
                                className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Attendance Log History</h4>
                    <div className="space-y-1">
                      {Object.keys(selectedDeptForView.attendance).length === 0 ? (
                        <p className="text-xs text-neutral-500 italic">No attendance records logged yet.</p>
                      ) : (
                        Object.entries(selectedDeptForView.attendance).map(([date, attendanceMap]) => {
                          const total = Object.keys(attendanceMap).length;
                          const present = Object.values(attendanceMap).filter(v => v).length;
                          return (
                            <div key={date} className="flex justify-between items-center py-2 border-b border-neutral-900/60">
                              <span className="text-xs font-mono text-neutral-300">{date}</span>
                              <span className="text-xs text-neutral-400">
                                <strong className="text-emerald-400">{present}</strong> / {total} Present
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-neutral-900 bg-neutral-950 flex justify-end">
                  <button
                    onClick={() => setSelectedDeptForView(null)}
                    className="px-5 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedDeptForView && showDeptAttendanceForm && (
            <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="glass-panel w-full max-w-lg rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-neutral-900/40">
                  <div>
                    <h3 className="text-sm font-bold text-white">Log Department Attendance: {selectedDeptForView.name}</h3>
                    <p className="text-xs text-neutral-400">Mark workers present or absent for team meetings/rehearsals.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDeptForView(null);
                      setShowDeptAttendanceForm(false);
                    }}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase">Attendance Date</label>
                    <input
                      type="date"
                      value={deptAttendanceDate}
                      onChange={(e) => setDeptAttendanceDate(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Worker List</h4>
                    {selectedDeptForView.memberIds.length === 0 ? (
                      <p className="text-xs text-neutral-500 italic">Add members to the department first before logging attendance.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedDeptForView.memberIds.map(id => {
                          const m = branchMembers.find(mem => mem.id === id);
                          if (!m) return null;
                          const isPresent = !!deptAttendanceStates[id];
                          return (
                            <div
                              key={id}
                              onClick={() => {
                                setDeptAttendanceStates({
                                  ...deptAttendanceStates,
                                  [id]: !isPresent
                                });
                              }}
                              className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all ${
                                isPresent 
                                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                                  : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:border-neutral-800'
                              }`}
                            >
                              <div>
                                <p className="text-xs font-bold">{m.firstName} {m.lastName}</p>
                                <p className="text-[9px] font-mono opacity-60">{m.memberId}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                isPresent ? 'border-emerald-500 bg-emerald-500 text-neutral-950' : 'border-neutral-700'
                              }`}>
                                {isPresent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-neutral-900 bg-neutral-950 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedDeptForView(null);
                      setShowDeptAttendanceForm(false);
                    }}
                    className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      dispatch(logDepartmentAttendance({
                        deptId: selectedDeptForView.id,
                        date: deptAttendanceDate,
                        attendance: deptAttendanceStates
                      }));
                      setSelectedDeptForView(null);
                      setShowDeptAttendanceForm(false);
                    }}
                    className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors"
                    style={{ backgroundColor: activeColor }}
                  >
                    Submit Attendance
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'attendance') {
      const latestSession = branchAttendanceSessions[0];
      const absentMembers = latestSession
        ? branchMembers.filter(m => latestSession.absentIds.includes(m.id))
        : [];

      return (
        <div className="space-y-6">
          <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-900/60">
            <h3 className="text-sm font-bold text-white mb-2">Attendance Tracker</h3>
            <p className="text-xs text-neutral-400">Log service attendance manually, generate secure QR Codes for mobile self-checkin, and trace absentee followups.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-neutral-900 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white uppercase">QR Self-Checkin Beacon</h4>
                  </div>
                  {qrCodeToken && (
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-emerald-500/10 text-emerald-400">
                      Beacon Active
                    </span>
                  )}
                </div>

                {!qrCodeToken ? (
                  <div className="py-6 text-center space-y-3">
                    <p className="text-xs text-neutral-400">Generate a unique session QR code for projecting in the sanctuary or sharing in cell WhatsApp groups.</p>
                    <button
                      onClick={() => {
                        setIsGeneratingQr(true);
                        setTimeout(() => {
                          setQrCodeToken(`qr-session-${Date.now()}`);
                          setScannedTokensCount(0);
                          setIsGeneratingQr(false);
                        }, 1000);
                      }}
                      className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white hover:border-neutral-700 text-xs font-bold transition-all inline-flex items-center space-x-2"
                    >
                      {isGeneratingQr ? (
                        <span>Activating...</span>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4" />
                          <span>Generate Session QR</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-neutral-200">
                      <div className="w-40 h-40 bg-neutral-100 flex items-center justify-center border-4 border-neutral-900 rounded-lg relative overflow-hidden">
                        <div className="grid grid-cols-5 gap-1.5 p-3 opacity-90">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-5 h-5 rounded-sm ${
                                (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 4 || i === 20 || i === 24 
                                  ? 'bg-neutral-900' 
                                  : 'bg-transparent'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none" />
                      </div>
                      <span className="text-[8px] font-mono text-neutral-500 mt-2 font-bold uppercase">{qrCodeToken}</span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-white">Live Scan Simulation</h5>
                        <p className="text-[11px] text-neutral-400">Proj-Screen status: Simulating member self-checkins via local GPS and church network validation.</p>
                      </div>

                      <div className="p-3 bg-neutral-950/40 border border-neutral-900 rounded-xl">
                        <p className="text-xs font-bold text-white">{scannedTokensCount} Member Scans</p>
                        <p className="text-[10px] text-neutral-500">Picked up via local mobile app checkins.</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            if (scannedTokensCount < branchMembers.length) {
                              setScannedTokensCount(prev => prev + 1);
                              const randomMem = branchMembers[scannedTokensCount % branchMembers.length];
                              dispatch(addFinancialRecord({
                                tenantId: tenant.id,
                                contributorName: `${randomMem.firstName} ${randomMem.lastName} (Self)`,
                                category: 'donation',
                                amount: 0,
                                notes: 'QR Code Checkin'
                              }));
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white hover:text-white text-xs font-bold transition-all text-center"
                        >
                          Simulate Scan
                        </button>
                        <button
                          onClick={() => {
                            const presentIds = branchMembers.slice(0, Math.min(scannedTokensCount + 2, branchMembers.length)).map(m => m.id);
                            const absentIds = branchMembers.filter(m => !presentIds.includes(m.id)).map(m => m.id);
                            dispatch(logAttendanceSession({
                              tenantId: tenant.id,
                              date: attDate,
                              type: attType,
                              presentIds,
                              absentIds,
                              qrCodeToken
                            }));
                            setQrCodeToken('');
                            setScannedTokensCount(0);
                          }}
                          className="flex-1 px-3 py-2 rounded-lg text-white text-xs font-bold transition-all text-center"
                          style={{ backgroundColor: activeColor }}
                        >
                          Finalize Session
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-neutral-900 space-y-4">
                <div className="flex items-center space-x-2">
                  <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase">Manual Attendance Log</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase">Service / Program Type</label>
                    <select
                      value={attType}
                      onChange={(e) => setAttType(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                    >
                      <option value="Sunday Service">Sunday Service</option>
                      <option value="Midweek Service">Midweek Service</option>
                      <option value="Prayer Meeting">Prayer Meeting</option>
                      <option value="Cell Meeting">Cell Meeting</option>
                      <option value="Department Meeting">Department Meeting</option>
                      <option value="Special Programs">Special Programs</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase">Service Date</label>
                    <input
                      type="date"
                      value={attDate}
                      onChange={(e) => setAttDate(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">Mark Congregation Attendance</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {branchMembers.map(m => {
                      const isPresent = attendancePresentIds.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            if (isPresent) {
                              setAttendancePresentIds(attendancePresentIds.filter(id => id !== m.id));
                            } else {
                              setAttendancePresentIds([...attendancePresentIds, m.id]);
                            }
                          }}
                          className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all ${
                            isPresent 
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                              : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:border-neutral-800'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold">{m.firstName} {m.lastName}</p>
                            <p className="text-[9px] text-neutral-500 font-mono">{m.memberId} • {m.category}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isPresent ? 'border-emerald-500 bg-emerald-500 text-neutral-950' : 'border-neutral-700'
                          }`}>
                            {isPresent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-900/60">
                  <button
                    onClick={() => setAttendancePresentIds([])}
                    className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => {
                      const absentIds = branchMembers.filter(m => !attendancePresentIds.includes(m.id)).map(m => m.id);
                      dispatch(logAttendanceSession({
                        tenantId: tenant.id,
                        date: attDate,
                        type: attType,
                        presentIds: attendancePresentIds,
                        absentIds
                      }));
                      setAttendancePresentIds([]);
                    }}
                    className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors"
                    style={{ backgroundColor: activeColor }}
                  >
                    Save Attendance Log
                  </button>
                </div>
              </div>

            </div>

            <div className="space-y-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-neutral-900 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Attendance Trends</h4>
                <div className="space-y-3">
                  {branchAttendanceSessions.slice(0, 4).map(s => {
                    const total = s.presentIds.length + s.absentIds.length;
                    const pct = total > 0 ? Math.round((s.presentIds.length / total) * 100) : 0;
                    return (
                      <div key={s.id} className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="font-bold text-white">{s.type} ({s.date})</span>
                          <span className="text-neutral-400">{s.presentIds.length} present ({pct})</span>
                        </div>
                        <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-900">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${pct}%`,
                              backgroundColor: pct > 80 ? '#10b981' : (pct > 50 ? '#3b82f6' : '#f43f5e')
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                  {branchAttendanceSessions.length === 0 && (
                    <p className="text-xs text-neutral-500 italic">No historical service attendance sessions found.</p>
                  )}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-neutral-900 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Absentee Followup List</h4>
                  <p className="text-[10px] text-neutral-500">Congregants absent from latest logged service ({latestSession?.date || 'N/A'}).</p>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {absentMembers.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic">No absentees reported or no sessions logged.</p>
                  ) : (
                    absentMembers.map(m => (
                      <div key={m.id} className="p-3 bg-neutral-950/40 border border-neutral-900 rounded-xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-white">{m.firstName} {m.lastName}</p>
                            <p className="text-[9px] text-neutral-500">{m.phone} • {m.email}</p>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-rose-500/10 text-rose-400">
                            Absent
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            alert(`Follow-up notification note logged for ${m.firstName}.`);
                          }}
                          className="w-full py-1 text-[9px] bg-neutral-900 border border-neutral-800 rounded text-neutral-400 hover:text-white font-bold transition-all"
                        >
                          Trigger Outreach / Call
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'cell-groups') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-neutral-900/40 p-6 rounded-2xl border border-neutral-900/60">
            <div>
              <h3 className="text-sm font-bold text-white">House Fellowship / Cell Groups</h3>
              <p className="text-xs text-neutral-400">Establish local house fellowship networks, assign cell pastors, and trace small group growth.</p>
            </div>
            <button
              onClick={() => {
                setShowCellForm(!showCellForm);
                setCName('');
                setCLeaderId('');
                setCLocation('');
                setCMeetingDay('Wednesdays 6:00 PM');
              }}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all"
              style={{ backgroundColor: activeColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Establish Cell Group</span>
            </button>
          </div>

          {showCellForm && (
            <div className="glass-panel p-6 rounded-2xl border border-neutral-900 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase">New House Fellowship Setup</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">Cell Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Victoria Island Fellowship"
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">Cell Leader</label>
                  <select
                    value={cLeaderId}
                    onChange={(e) => setCLeaderId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                  >
                    <option value="">Select Leader...</option>
                    {branchMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.memberId})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">Meeting Schedule / Day</label>
                  <input
                    type="text"
                    placeholder="e.g. Wednesdays 6:00 PM"
                    value={cMeetingDay}
                    onChange={(e) => setCMeetingDay(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">Location / Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 24 Lighthouse Way"
                    value={cLocation}
                    onChange={(e) => setCLocation(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowCellForm(false)}
                  className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!cName) return;
                    dispatch(addCellGroup({
                      tenantId: tenant.id,
                      name: cName,
                      leaderId: cLeaderId || undefined,
                      memberIds: cLeaderId ? [cLeaderId] : [],
                      location: cLocation,
                      meetingDay: cMeetingDay
                    }));
                    setShowCellForm(false);
                  }}
                  className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors"
                  style={{ backgroundColor: activeColor }}
                >
                  Save Cell Group
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branchCellGroups.map(cell => {
              const leader = branchMembers.find(m => m.id === cell.leaderId);
              return (
                <div key={cell.id} className="glass-panel p-6 rounded-2xl border border-neutral-900 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">House Fellowship</span>
                        <h4 className="text-base font-extrabold text-white">{cell.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-neutral-800 text-neutral-400">
                        {cell.memberIds.length} Members
                      </span>
                    </div>
                    
                    <div className="mt-3 text-[11px] text-neutral-400 space-y-1">
                      <p><strong>Location:</strong> {cell.location || 'Not Specified'}</p>
                      <p><strong>Meeting Day:</strong> {cell.meetingDay || 'Not Specified'}</p>
                    </div>

                    <div className="mt-4 p-3 bg-neutral-950/40 rounded-xl border border-neutral-900 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center font-bold text-xs text-neutral-400">
                        {leader ? `${leader.firstName[0]}${leader.lastName[0]}` : '??'}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Cell Leader</p>
                        <p className="text-xs font-bold text-white">{leader ? `${leader.firstName} ${leader.lastName}` : 'No Leader Assigned'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-900/60">
                    <button
                      onClick={() => {
                        setSelectedCellForView(cell);
                        setShowCellAttendanceForm(false);
                      }}
                      className="text-xs text-neutral-400 hover:text-white font-bold transition-colors flex items-center space-x-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Manage Members ({cell.memberIds.length})</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCellForView(cell);
                        setShowCellAttendanceForm(true);
                        setCellAttendanceDate(new Date().toISOString().substring(0, 10));
                        const initialStates: { [id: string]: boolean } = {};
                        cell.memberIds.forEach(id => {
                          initialStates[id] = true;
                        });
                        setCellAttendanceStates(initialStates);
                      }}
                      className="text-xs font-bold transition-colors flex items-center space-x-1.5"
                      style={{ color: activeColor }}
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      <span>Log Cell Attendance</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedCellForView && !showCellAttendanceForm && (
            <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="glass-panel w-full max-w-xl rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-neutral-900/40">
                  <div>
                    <h3 className="text-sm font-bold text-white">Manage Cell: {selectedCellForView.name}</h3>
                    <p className="text-xs text-neutral-400">Enroll neighborhood residents and small group attendees.</p>
                  </div>
                  <button
                    onClick={() => setSelectedCellForView(null)}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase">Enroll Cell Member</label>
                    <div className="flex space-x-2">
                      <select
                        id="cell-enroll-select"
                        className="flex-1 bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                      >
                        <option value="">Select Congregation Member...</option>
                        {branchMembers
                          .filter(m => !selectedCellForView.memberIds.includes(m.id))
                          .map(m => (
                            <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.memberId})</option>
                          ))
                        }
                      </select>
                      <button
                        onClick={() => {
                          const selectEl = document.getElementById('cell-enroll-select') as HTMLSelectElement;
                          if (selectEl && selectEl.value) {
                            dispatch(addMemberToCell({ cellId: selectedCellForView.id, memberId: selectEl.value }));
                            setSelectedCellForView({
                              ...selectedCellForView,
                              memberIds: [...selectedCellForView.memberIds, selectEl.value]
                            });
                            selectEl.value = '';
                          }
                        }}
                        className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors"
                        style={{ backgroundColor: activeColor }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Cell Roster</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {selectedCellForView.memberIds.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic">No members currently assigned to this cell.</p>
                      ) : (
                        selectedCellForView.memberIds.map(id => {
                          const m = branchMembers.find(mem => mem.id === id);
                          if (!m) return null;
                          return (
                            <div key={id} className="flex justify-between items-center p-3 bg-neutral-950/40 rounded-xl border border-neutral-900">
                              <div>
                                <p className="text-xs font-bold text-white">{m.firstName} {m.lastName}</p>
                                <p className="text-[9px] text-neutral-500 font-mono">{m.memberId}</p>
                              </div>
                              <button
                                onClick={() => {
                                  dispatch(removeMemberFromCell({ cellId: selectedCellForView.id, memberId: id }));
                                  setSelectedCellForView({
                                    ...selectedCellForView,
                                    memberIds: selectedCellForView.memberIds.filter(mid => mid !== id)
                                  });
                                }}
                                className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Attendance Logs</h4>
                    <div className="space-y-1">
                      {Object.keys(selectedCellForView.attendance).length === 0 ? (
                        <p className="text-xs text-neutral-500 italic">No attendance records logged yet.</p>
                      ) : (
                        Object.entries(selectedCellForView.attendance).map(([date, attendanceMap]) => {
                          const total = Object.keys(attendanceMap).length;
                          const present = Object.values(attendanceMap).filter(v => v).length;
                          return (
                            <div key={date} className="flex justify-between items-center py-2 border-b border-neutral-900/60">
                              <span className="text-xs font-mono text-neutral-300">{date}</span>
                              <span className="text-xs text-neutral-400">
                                <strong className="text-emerald-400">{present}</strong> / {total} Present
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-neutral-900 bg-neutral-950 flex justify-end">
                  <button
                    onClick={() => setSelectedCellForView(null)}
                    className="px-5 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedCellForView && showCellAttendanceForm && (
            <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="glass-panel w-full max-w-lg rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-neutral-900/40">
                  <div>
                    <h3 className="text-sm font-bold text-white">Log Cell Attendance: {selectedCellForView.name}</h3>
                    <p className="text-xs text-neutral-400">Mark cell attendees present/absent for small group fellowship sessions.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCellForView(null);
                      setShowCellAttendanceForm(false);
                    }}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase">Fellowship Date</label>
                    <input
                      type="date"
                      value={cellAttendanceDate}
                      onChange={(e) => setCellAttendanceDate(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Member List</h4>
                    {selectedCellForView.memberIds.length === 0 ? (
                      <p className="text-xs text-neutral-500 italic">No members registered in this cell.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedCellForView.memberIds.map(id => {
                          const m = branchMembers.find(mem => mem.id === id);
                          if (!m) return null;
                          const isPresent = !!cellAttendanceStates[id];
                          return (
                            <div
                              key={id}
                              onClick={() => {
                                setCellAttendanceStates({
                                  ...cellAttendanceStates,
                                  [id]: !isPresent
                                });
                              }}
                              className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all ${
                                isPresent 
                                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                                  : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:border-neutral-800'
                              }`}
                            >
                              <div>
                                <p className="text-xs font-bold">{m.firstName} {m.lastName}</p>
                                <p className="text-[9px] font-mono opacity-60">{m.memberId}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                isPresent ? 'border-emerald-500 bg-emerald-500 text-neutral-950' : 'border-neutral-700'
                              }`}>
                                {isPresent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-neutral-900 bg-neutral-950 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCellForView(null);
                      setShowCellAttendanceForm(false);
                    }}
                    className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      dispatch(logCellAttendance({
                        cellId: selectedCellForView.id,
                        date: cellAttendanceDate,
                        attendance: cellAttendanceStates
                      }));
                      setSelectedCellForView(null);
                      setShowCellAttendanceForm(false);
                    }}
                    className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors"
                    style={{ backgroundColor: activeColor }}
                  >
                    Submit Attendance
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'events') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-neutral-900/40 p-6 rounded-2xl border border-neutral-900/60">
            <div>
              <h3 className="text-sm font-bold text-white">Events & Church Programs</h3>
              <p className="text-xs text-neutral-400">Plan retreat programs, configure crusades or weddings, assign volunteer workers, and manage RSVPs.</p>
            </div>
            <button
              onClick={() => {
                setShowEventForm(!showEventForm);
                setETitle('');
                setEType('Conferences');
                setEDate(new Date().toISOString().substring(0, 10));
                setELocation('');
              }}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all"
              style={{ backgroundColor: activeColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Program</span>
            </button>
          </div>

          {showEventForm && (
            <div className="glass-panel p-6 rounded-2xl border border-neutral-900 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase">New Program Registration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">Program / Event Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Workers Retreat 2026"
                    value={eTitle}
                    onChange={(e) => setETitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">Program Category</label>
                  <select
                    value={eType}
                    onChange={(e) => setEType(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                  >
                    <option value="Conferences">Conferences</option>
                    <option value="Retreats">Retreats</option>
                    <option value="Trainings">Trainings</option>
                    <option value="Crusades">Crusades</option>
                    <option value="Baptisms">Baptisms</option>
                    <option value="Weddings">Weddings</option>
                    <option value="Special Services">Special Services</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">Program Date</label>
                  <input
                    type="date"
                    value={eDate}
                    onChange={(e) => setEDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">Location / Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Sanctuary"
                    value={eLocation}
                    onChange={(e) => setELocation(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowEventForm(false)}
                  className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!eTitle) return;
                    dispatch(addEvent({
                      tenantId: tenant.id,
                      title: eTitle,
                      type: eType,
                      date: eDate,
                      location: eLocation
                    }));
                    setShowEventForm(false);
                  }}
                  className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors"
                  style={{ backgroundColor: activeColor }}
                >
                  Save Event
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {branchEvents.map(evt => (
              <div key={evt.id} className="glass-panel p-6 rounded-2xl border border-neutral-900 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{evt.type}</span>
                      <h4 className="text-base font-extrabold text-white">{evt.title}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-neutral-800 text-neutral-400">
                      {evt.date}
                    </span>
                  </div>

                  <div className="mt-3 text-[11px] text-neutral-400 space-y-1">
                    <p><strong>Venue:</strong> {evt.location || 'Sanctuary Hall'}</p>
                    <p><strong>RSVPs:</strong> {evt.registrantIds.length} Congregants Registered</p>
                    <p><strong>Volunteers:</strong> {Object.keys(evt.volunteerAssignments).length} Assigned Workers</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-900/60">
                  <button
                    onClick={() => {
                      setSelectedEventForView(evt);
                      setShowVolunteerForm(false);
                      setShowEventAttendanceForm(false);
                    }}
                    className="text-xs text-neutral-400 hover:text-white font-bold transition-colors flex items-center space-x-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Manage Program Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEventForView(evt);
                      setShowVolunteerForm(false);
                      setShowEventAttendanceForm(true);
                      const initialStates: { [id: string]: boolean } = {};
                      evt.registrantIds.forEach(id => {
                        initialStates[id] = evt.attendanceIds.includes(id);
                      });
                      setEventAttendanceStates(initialStates);
                    }}
                    className="text-xs font-bold transition-colors flex items-center space-x-1.5"
                    style={{ color: activeColor }}
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Mark Event Attendance</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedEventForView && !showEventAttendanceForm && (
            <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="glass-panel w-full max-w-xl rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-neutral-900/40">
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedEventForView.title} ({selectedEventForView.type})</h3>
                    <p className="text-xs text-neutral-400">Date: {selectedEventForView.date} | Venue: {selectedEventForView.location}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEventForView(null)}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 flex-1">
                  
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">RSVP Registration</h4>
                    
                    <div className="flex space-x-2">
                      <select
                        id="event-rsvp-select"
                        className="flex-1 bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                      >
                        <option value="">Register Congregant...</option>
                        {branchMembers
                          .filter(m => !selectedEventForView.registrantIds.includes(m.id))
                          .map(m => (
                            <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.memberId})</option>
                          ))
                        }
                      </select>
                      <button
                        onClick={() => {
                          const selectEl = document.getElementById('event-rsvp-select') as HTMLSelectElement;
                          if (selectEl && selectEl.value) {
                            dispatch(registerForEvent({ eventId: selectedEventForView.id, memberId: selectEl.value }));
                            setSelectedEventForView({
                              ...selectedEventForView,
                              registrantIds: [...selectedEventForView.registrantIds, selectEl.value]
                            });
                            selectEl.value = '';
                          }
                        }}
                        className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors"
                        style={{ backgroundColor: activeColor }}
                      >
                        Register
                      </button>
                    </div>

                    <div className="max-h-36 overflow-y-auto border border-neutral-900 rounded-xl p-3 bg-neutral-950/40">
                      {selectedEventForView.registrantIds.length === 0 ? (
                        <p className="text-[11px] text-neutral-500 italic">No registrations for this event yet.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {selectedEventForView.registrantIds.map(id => {
                            const m = branchMembers.find(mem => mem.id === id);
                            if (!m) return null;
                            return (
                              <div key={id} className="text-xs text-neutral-300 p-1.5 bg-neutral-900/60 rounded border border-neutral-900">
                                {m.firstName} {m.lastName}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Volunteer Duty Assignments</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        id="event-volunteer-select"
                        className="sm:col-span-2 bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                      >
                        <option value="">Select Volunteer...</option>
                        {branchMembers.map(m => (
                          <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        id="event-role-input"
                        placeholder="Role (e.g. Usher)"
                        className="bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-700"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const selectEl = document.getElementById('event-volunteer-select') as HTMLSelectElement;
                        const roleEl = document.getElementById('event-role-input') as HTMLInputElement;
                        if (selectEl && selectEl.value && roleEl && roleEl.value) {
                          dispatch(assignVolunteer({ eventId: selectedEventForView.id, memberId: selectEl.value, role: roleEl.value }));
                          setSelectedEventForView({
                            ...selectedEventForView,
                            volunteerAssignments: {
                              ...selectedEventForView.volunteerAssignments,
                              [selectEl.value]: roleEl.value
                            }
                          });
                          selectEl.value = '';
                          roleEl.value = '';
                        }
                      }}
                      className="w-full py-2 rounded-lg text-white text-xs font-bold transition-colors"
                      style={{ backgroundColor: activeColor }}
                    >
                      Assign Duty Role
                    </button>

                    <div className="max-h-36 overflow-y-auto border border-neutral-900 rounded-xl p-3 bg-neutral-950/40">
                      {Object.keys(selectedEventForView.volunteerAssignments).length === 0 ? (
                        <p className="text-[11px] text-neutral-500 italic">No volunteer tasks assigned yet.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {Object.entries(selectedEventForView.volunteerAssignments).map(([id, role]) => {
                            const m = branchMembers.find(mem => mem.id === id);
                            if (!m) return null;
                            return (
                              <div key={id} className="flex justify-between text-xs text-neutral-300 p-2 bg-neutral-900/60 rounded border border-neutral-900">
                                <span>{m.firstName} {m.lastName}</span>
                                <span className="font-bold text-neutral-400 font-mono uppercase text-[9px]">{role}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                <div className="p-6 border-t border-neutral-900 bg-neutral-950 flex justify-end">
                  <button
                    onClick={() => setSelectedEventForView(null)}
                    className="px-5 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedEventForView && showEventAttendanceForm && (
            <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="glass-panel w-full max-w-lg rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-neutral-900/40">
                  <div>
                    <h3 className="text-sm font-bold text-white">Event Attendance: {selectedEventForView.title}</h3>
                    <p className="text-xs text-neutral-400">Mark registered attendees who actually checked in during the event.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEventForView(null);
                      setShowEventAttendanceForm(false);
                    }}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  {selectedEventForView.registrantIds.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic">No members registered for this event. Register members before marking attendance.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedEventForView.registrantIds.map(id => {
                        const m = branchMembers.find(mem => mem.id === id);
                        if (!m) return null;
                        const isPresent = !!eventAttendanceStates[id];
                        return (
                          <div
                            key={id}
                            onClick={() => {
                              setEventAttendanceStates({
                                ...eventAttendanceStates,
                                [id]: !isPresent
                              });
                            }}
                            className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all ${
                              isPresent 
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                                : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:border-neutral-800'
                            }`}
                          >
                            <span>{m.firstName} {m.lastName}</span>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                              isPresent ? 'border-emerald-500 bg-emerald-500 text-neutral-950' : 'border-neutral-700'
                            }`}>
                              {isPresent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-neutral-900 bg-neutral-950 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedEventForView(null);
                      setShowEventAttendanceForm(false);
                    }}
                    className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const presentIds = Object.entries(eventAttendanceStates)
                        .filter(([_, present]) => present)
                        .map(([id]) => id);
                      dispatch(logEventAttendance({
                        eventId: selectedEventForView.id,
                        memberIds: presentIds
                      }));
                      setSelectedEventForView(null);
                      setShowEventAttendanceForm(false);
                    }}
                    className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors"
                    style={{ backgroundColor: activeColor }}
                  >
                    Save Event Attendance
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'role-manager') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-neutral-900/40 p-6 rounded-2xl border border-neutral-900/60">
            <div>
              <h3 className="text-sm font-bold text-white">Administration & User Roles</h3>
              <p className="text-xs text-neutral-400">Configure administrative access, staff accounts, role assignments, and check local logs.</p>
            </div>
            <button
              onClick={() => {
                setShowUserForm(!showUserForm);
                setUName('');
                setUEmail('');
                setURole('member');
                setUPermissions([]);
                setSelectedUserForEdit(null);
              }}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all"
              style={{ backgroundColor: activeColor }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Assign Platform User</span>
            </button>
          </div>

          {showUserForm && (
            <div className="glass-panel p-6 rounded-2xl border border-neutral-900 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase">
                {selectedUserForEdit ? 'Edit Platform Permissions' : 'New Platform User Assignment'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">User Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={uName}
                    onChange={(e) => setUName(e.target.value)}
                    disabled={!!selectedUserForEdit}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700 disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">User Email</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={uEmail}
                    onChange={(e) => setUEmail(e.target.value)}
                    disabled={!!selectedUserForEdit}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700 disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">Assigned Role</label>
                  <select
                    value={uRole}
                    onChange={(e) => setURole(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-neutral-700"
                  >
                    <option value="organization_admin">Organization Administrator</option>
                    <option value="pastor">Pastor</option>
                    <option value="department_head">Department Head</option>
                    <option value="finance_officer">Finance Officer</option>
                    <option value="attendance_officer">Attendance Officer</option>
                    <option value="follow_up_officer">Follow-Up Officer</option>
                    <option value="member">Member</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-neutral-500 uppercase">System Scoped Permissions</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'manage_members', label: 'Congregation Registry' },
                    { id: 'manage_departments', label: 'Department Access' },
                    { id: 'manage_attendance', label: 'Log Attendance' },
                    { id: 'manage_cells', label: 'Cell Management' },
                    { id: 'manage_events', label: 'Schedule Events' },
                    { id: 'manage_finances', label: 'Finance Ledgers' },
                    { id: 'publish_sermons', label: 'Sermon Manager' }
                  ].map(p => {
                    const hasPerm = uPermissions.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all text-xs font-semibold ${
                          hasPerm 
                            ? 'bg-neutral-900 border-neutral-800 text-white' 
                            : 'bg-neutral-950/40 border-neutral-900/60 text-neutral-500 hover:border-neutral-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={hasPerm}
                          onChange={() => {
                            if (hasPerm) {
                              setUPermissions(uPermissions.filter(perm => perm !== p.id));
                            } else {
                              setUPermissions([...uPermissions, p.id]);
                            }
                          }}
                          className="rounded border-neutral-800 text-indigo-600 bg-neutral-950 focus:ring-0 focus:ring-offset-0"
                        />
                        <span>{p.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setShowUserForm(false)}
                  className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!uName || !uEmail) return;
                    if (selectedUserForEdit) {
                      dispatch(updatePlatformUser({
                        ...selectedUserForEdit,
                        role: uRole,
                        permissions: uPermissions
                      }));
                    } else {
                      dispatch(addPlatformUser({
                        tenantId: tenant.id,
                        name: uName,
                        email: uEmail,
                        role: uRole,
                        status: 'active',
                        permissions: uPermissions
                      }));
                    }
                    setShowUserForm(false);
                  }}
                  className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors"
                  style={{ backgroundColor: activeColor }}
                >
                  Save Account Permissions
                </button>
              </div>
            </div>
          )}

          <div className="glass-panel rounded-2xl border border-neutral-900 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-950/80 border-b border-neutral-900 text-[10px] font-bold text-neutral-400 uppercase">
                  <th className="p-4">Platform User</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Permissions Scoped</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {branchPlatformUsers.map(user => (
                  <tr key={user.id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-neutral-500 font-mono">{user.email}</p>
                    </td>
                    <td className="p-4 text-neutral-400 font-mono text-[10px] uppercase">
                      {user.role.replace('_', ' ')}
                    </td>
                    <td className="p-4 text-neutral-500 max-w-[200px] truncate">
                      {user.permissions.length === 0 ? 'No Scoped Permissions' : user.permissions.join(', ')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        user.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUserForEdit(user);
                          setUName(user.name);
                          setUEmail(user.email);
                          setURole(user.role);
                          setUPermissions(user.permissions);
                          setShowUserForm(true);
                        }}
                        className="p-1 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          dispatch(deletePlatformUser(user.id));
                        }}
                        className="p-1 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Local Activity Monitoring Logs</h4>
            <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-4 font-mono text-[10px] text-neutral-400 space-y-2.5 max-h-60 overflow-y-auto">
              {branchAuditLogs.map(log => (
                <div key={log.id} className="flex justify-between border-b border-neutral-900/60 pb-2 last:border-b-0">
                  <div className="space-y-0.5">
                    <span className="text-neutral-500 mr-2">[{log.timestamp}]</span>
                    <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold uppercase mr-2 ${
                      log.level === 'error' ? 'bg-rose-500/15 text-rose-400' : (log.level === 'warn' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400')
                    }`}>
                      {log.level}
                    </span>
                    <strong className="text-neutral-300 mr-2">{log.actor}:</strong>
                    <span className="text-neutral-400">{log.action}</span>
                  </div>
                  <span className="text-neutral-600 font-bold uppercase tracking-wider text-[8px]">{log.branchName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }

  // ----------------------------------------------------
  // PASTOR / LEADER WORKSPACE
  // ----------------------------------------------------
  if (session.role === 'pastor') {
    if (activeTab === 'overview') {
      return (
        <div className="space-y-6">
          
          {/* Spiritual stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Sunday Service Attendance</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white">412 Members</h3>
                </div>
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${activeColor}15` }}>
                  <Users className="w-5 h-5" style={{ color: activeColor }} />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-emerald-400 flex items-center font-bold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                +8% vs last week's attendance
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Cell Groups</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white">4 Units Active</h3>
                </div>
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${activeColor}15` }}>
                  <Activity className="w-5 h-5" style={{ color: activeColor }} />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-neutral-400">
                Choir, Youth Fire, Couples, Sisters
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Sermons Tapes</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white">{branchSermons.length} Recorded</h3>
                </div>
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${activeColor}15` }}>
                  <BookOpen className="w-5 h-5" style={{ color: activeColor }} />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-neutral-400">
                Excludes draft items
              </div>
            </div>
          </div>

          {/* Ministry cells layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-neutral-900">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Cell Fellowship Attendance Ledger</h4>
              <div className="space-y-3.5 text-xs">
                {[
                  { name: 'Youth Fire Fellowship', size: '120 participants', time: 'Friday 17:30' },
                  { name: 'Assembly Choir Rehearsals', size: '45 members', time: 'Saturday 16:00' },
                  { name: 'Couples Fellowship', size: '28 families', time: 'Monthly 1st Sunday' },
                  { name: 'Sisters Circle', size: '52 members', time: 'Bi-weekly Thursday' }
                ].map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-neutral-950/40 border border-neutral-900 rounded-xl">
                    <div>
                      <p className="font-bold text-neutral-200">{c.name}</p>
                      <p className="text-[10px] text-neutral-500">{c.time}</p>
                    </div>
                    <span className="text-[10px] font-bold text-white">{c.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spiritual message checklist */}
            <div className="glass-panel p-6 rounded-2xl border border-neutral-900 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Pastoral Administration checklist</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Submit monthly spiritual reports to Overseer', done: true },
                    { label: 'Prepare counseling session schedules for Tuesday', done: false },
                    { label: 'Upload draft sermon study materials to system', done: false },
                    { label: 'Review Sunday offering reports with Mary Alao', done: true }
                  ].map((task, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-xs">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        task.done ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'border-neutral-800'
                      }`}>
                        {task.done && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className={task.done ? 'text-neutral-500 line-through' : 'text-neutral-300'}>
                        {task.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[8px] font-mono text-neutral-600 text-center mt-6">
                CAC Spiritual Care Division
              </div>
            </div>
          </div>

        </div>
      );
    }

    if (activeTab === 'sermons') {
      return (
        <div className="space-y-6">
          <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-900/60 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Sermon Tape Catalog Manager</h3>
              <p className="text-xs text-neutral-400">Log sermon topics, series, duration, and draft statuses.</p>
            </div>
            
            <button
              onClick={() => setShowSermonForm(!showSermonForm)}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-white rounded-xl shadow-lg transition-colors"
              style={{ backgroundColor: activeColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Record Sermon</span>
            </button>
          </div>

          {/* Add Sermon block */}
          {showSermonForm && (
            <div className="glass-panel p-6 rounded-2xl border transition-all" style={{ borderColor: `${activeColor}30` }}>
              <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center">
                <Plus className="w-4 h-4 mr-1.5" style={{ color: activeColor }} />
                Record Sermon tape entry
              </h4>
              <form onSubmit={handleAddSermon} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400">SERMON TOPIC / TITLE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Walking in Covenant Power"
                    value={sTitle}
                    onChange={(e) => setSTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400">PREACHER IN CHARGE</label>
                  <input
                    type="text"
                    required
                    value={sPreacher}
                    onChange={(e) => setSPreacher(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400">SERMON SERIES (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="e.g. Pillars of Faith"
                    value={sSeries}
                    onChange={(e) => setSSeries(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400">DURATION</label>
                  <input
                    type="text"
                    required
                    placeholder="45 mins"
                    value={sDuration}
                    onChange={(e) => setSDuration(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400">STATUS TYPE</label>
                  <select
                    value={sStatus}
                    onChange={(e) => setSStatus(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  >
                    <option value="published">Publish instantly</option>
                    <option value="draft">Save draft</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSermonForm(false)}
                    className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-white text-xs font-bold shadow-lg transition-colors"
                    style={{ backgroundColor: activeColor }}
                  >
                    Record Sermon
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Sermons Table */}
          <div className="glass-panel rounded-2xl border border-neutral-900 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-950/80 border-b border-neutral-900 text-[10px] font-bold text-neutral-400 uppercase">
                  <th className="p-4">Sermon Topic / Title</th>
                  <th className="p-4">Preacher</th>
                  <th className="p-4">Series Name</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Date logged</th>
                  <th className="p-4">Views count</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {branchSermons.map((s) => (
                  <tr key={s.id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="p-4 font-bold text-white">{s.title}</td>
                    <td className="p-4 text-neutral-400">{s.preacher}</td>
                    <td className="p-4 text-neutral-400">{s.series || '-'}</td>
                    <td className="p-4 text-neutral-500 font-mono">{s.duration}</td>
                    <td className="p-4 text-neutral-500 font-mono">{s.date}</td>
                    <td className="p-4 text-neutral-500 font-mono">{s.views} views</td>
                    <td className="p-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        s.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-neutral-800 text-neutral-400'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'care-logs') {
      return (
        <div className="space-y-6">
          <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-900/60">
            <h3 className="text-sm font-bold text-white mb-2">Counseling & Care logs</h3>
            <p className="text-xs text-neutral-400">Confidential check-ins and member counseling trackers.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-neutral-900 space-y-4">
            <div className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-xl space-y-2 text-xs leading-normal">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Visit with Dada Family</span>
                <span className="text-[9px] text-neutral-500 font-mono">2026-06-12</span>
              </div>
              <p className="text-neutral-400">
                Spoke with Dada family regarding welfare check. Expressed gratitude for the choir robes donation. Will visit again next month.
              </p>
            </div>

            <div className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-xl space-y-2 text-xs leading-normal">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Counseling Session: New Convert Tunde</span>
                <span className="text-[9px] text-neutral-500 font-mono">2026-06-08</span>
              </div>
              <p className="text-neutral-400">
                Session focused on foundational faith pillars and enrolling Tunde in the baptism class. Highly responsive and committed.
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  // ----------------------------------------------------
  // TREASURER WORKSPACE
  // ----------------------------------------------------
  if (session.role === 'treasurer') {
    if (activeTab === 'overview') {
      return (
        <div className="space-y-6">
          
          {/* Financial stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Tithes & Offerings</span>
                  <h3 className="text-2xl font-bold tracking-tight text-emerald-400">₦{totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-neutral-400">
                Total inflows logged at this branch assembly
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Outflows & Spending</span>
                  <h3 className="text-2xl font-bold tracking-tight text-rose-400">₦{totalExpenseOut.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-rose-500/10 rounded-xl">
                  <TrendingDown className="w-5 h-5 text-rose-400" />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-neutral-400">
                Operating expenditures and repair outflows
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Net Assembly Surplus</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white">₦{(totalRevenue - totalExpenseOut).toLocaleString()}</h3>
                </div>
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${activeColor}15` }}>
                  <DollarSign className="w-5 h-5" style={{ color: activeColor }} />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-emerald-400 font-semibold">
                Surplus cash reserves logged locally
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="space-y-4">
            <div className="bg-neutral-900/40 p-5 rounded-2xl border border-neutral-900/60 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Assembly Financial Ledger</h4>
                <p className="text-[10px] text-neutral-500">Chronological transaction record for this branch.</p>
              </div>
              <button
                onClick={() => setShowFinanceForm(!showFinanceForm)}
                className="flex items-center space-x-1.5 px-3 py-2 text-[10px] font-bold text-white rounded-xl shadow-lg transition-colors"
                style={{ backgroundColor: activeColor }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Transaction</span>
              </button>
            </div>

            {/* Add finance form */}
            {showFinanceForm && (
              <div className="glass-panel p-6 rounded-2xl border transition-all" style={{ borderColor: `${activeColor}30` }}>
                <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center">
                  <Plus className="w-4 h-4 mr-1.5" style={{ color: activeColor }} />
                  Log Financial record
                </h4>
                <form onSubmit={handleAddFinance} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400">TRANSACTION TYPE / CATEGORY</label>
                    <select
                      value={fCategory}
                      onChange={(e) => setFCategory(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                    >
                      <option value="tithe">Tithe Inflow</option>
                      <option value="offering">Sunday Collection Offering</option>
                      <option value="donation">Special Donation</option>
                      <option value="expense">Operating Expense Outflow</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400">
                      {fCategory === 'expense' ? 'RECIPIENT / VENDOR NAME' : 'CONTRIBUTOR NAME (OPTIONAL)'}
                    </label>
                    <input
                      type="text"
                      placeholder={fCategory === 'expense' ? 'e.g. Ikeja Electric' : 'e.g. Bro Abiodun'}
                      value={fName}
                      onChange={(e) => setFName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400">AMOUNT (₦)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50000"
                      value={fAmount}
                      onChange={(e) => setFAmount(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400">DESCRIPTION NOTES</label>
                    <input
                      type="text"
                      placeholder="e.g. Sunday collection service tithes"
                      value={fNotes}
                      onChange={(e) => setFNotes(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowFinanceForm(false)}
                      className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-white text-xs font-bold shadow-lg transition-colors"
                      style={{ backgroundColor: activeColor }}
                    >
                      Log Record
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Ledger Listing table */}
            <div className="glass-panel rounded-2xl border border-neutral-900 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-950/80 border-b border-neutral-900 text-[10px] font-bold text-neutral-400 uppercase">
                    <th className="p-4">Date</th>
                    <th className="p-4">Contributor / Recipient</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Notes</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {branchFinances.map((f) => (
                    <tr key={f.id} className="hover:bg-neutral-900/30 transition-colors">
                      <td className="p-4 text-neutral-500 font-mono">{f.date}</td>
                      <td className="p-4 font-bold text-white">{f.contributorName || 'Anonymous'}</td>
                      <td className="p-4">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                          f.category === 'tithe' ? 'bg-emerald-500/10 text-emerald-400' :
                          f.category === 'offering' ? 'bg-indigo-500/10 text-indigo-400' :
                          f.category === 'donation' ? 'bg-cyan-500/10 text-cyan-400' :
                          'bg-rose-500/10 text-rose-400'
                        }`}>
                          {f.category}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-500">{f.notes || '-'}</td>
                      <td className={`p-4 text-right font-bold ${f.category === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {f.category === 'expense' ? '-' : '+'} ₦{f.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      );
    }

    if (activeTab === 'contributions') {
      return (
        <div className="space-y-6">
          <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-900/60">
            <h3 className="text-sm font-bold text-white mb-2">Log Giving & Tithes</h3>
            <p className="text-xs text-neutral-400">Process contributions and print giving statements.</p>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl border border-neutral-900 text-xs">
            <p className="text-neutral-400 leading-relaxed">
              Use the ledger action "Log Transaction" from the main Overview screen to register new tithes, offerings, or donations. 
              All recorded records will instantly sync with the global database and show on the overseer audits.
            </p>
          </div>
        </div>
      );
    }
  }

  return null;
}
