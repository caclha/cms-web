import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { addTenant, editTenant, toggleTenantStatus } from '../../lib/features/cms/cmsSlice';
import { RootState } from '../../lib/store';
import { Tenant, UserSession } from '../../types';
import { 
  Layers, MapPin, Calendar, Users, Plus, ShieldAlert,
  Search, TrendingUp, AlertTriangle, FileText, CheckCircle2, DollarSign,
  Building2, Pencil, Globe, Activity, ExternalLink, Mail, Phone, Shield
} from 'lucide-react';

interface ViewProps {
  session: UserSession;
  activeTab: string;
}

export default function DenominationViews({ session, activeTab }: ViewProps) {
  const dispatch = useAppDispatch();
  const { tenants, auditLogs, members, finances } = useAppSelector((state: RootState) => state.cms);

  // Search filter for branches
  const [branchSearch, setBranchSearch] = useState('');

  // Selected Branch for statistics view
  const [selectedTenantId, setSelectedTenantId] = useState<string>(tenants[0]?.id || '');

  // Pagination for organizations
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2; // Set to 2 to make pagination easily demoable with 3+ branches

  // Form toggles and fields
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formStateVal, setFormStateVal] = useState('');
  const [formCountry, setFormCountry] = useState('Nigeria');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formPastor, setFormPastor] = useState('');
  const [formYear, setFormYear] = useState('2026');
  const [formColor, setFormColor] = useState('#4f46e5');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  // Search filter for global members (Overseer)
  const [memberSearch, setMemberSearch] = useState('');

  // Financial search filter (Overseer)
  const [financeSearch, setFinanceSearch] = useState('');

  const resetForm = () => {
    setEditingTenantId(null);
    setFormName('');
    setFormCode('');
    setFormLogoUrl('');
    setFormAddress('');
    setFormCity('');
    setFormStateVal('');
    setFormCountry('Nigeria');
    setFormEmail('');
    setFormPhone('');
    setFormWebsite('');
    setFormPastor('');
    setFormYear('2026');
    setFormColor('#4f46e5');
    setFormStatus('active');
  };

  const startEdit = (tenant: Tenant) => {
    setEditingTenantId(tenant.id);
    setFormName(tenant.name);
    setFormCode(tenant.code || '');
    setFormLogoUrl(tenant.logoUrl || '');
    setFormAddress(tenant.address || '');
    setFormCity(tenant.city);
    setFormStateVal(tenant.state);
    setFormCountry(tenant.country || 'Nigeria');
    setFormEmail(tenant.email || '');
    setFormPhone(tenant.phone || '');
    setFormWebsite(tenant.website || '');
    setFormPastor(tenant.pastorInCharge || '');
    setFormYear(tenant.establishedYear.toString());
    setFormColor(tenant.primaryColor);
    setFormStatus(tenant.status || 'active');
    setShowOrgForm(true);
  };

  const handleSaveOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCity || !formStateVal) return;

    if (editingTenantId) {
      dispatch(editTenant({
        id: editingTenantId,
        name: formName,
        denomination: 'Christ Apostolic Church',
        city: formCity,
        state: formStateVal,
        logoUrl: formLogoUrl || undefined,
        primaryColor: formColor,
        memberCount: tenants.find(t => t.id === editingTenantId)?.memberCount || 0,
        establishedYear: parseInt(formYear) || 2026,
        code: formCode || undefined,
        address: formAddress || undefined,
        country: formCountry || undefined,
        email: formEmail || undefined,
        phone: formPhone || undefined,
        website: formWebsite || undefined,
        pastorInCharge: formPastor || undefined,
        status: formStatus
      }));
    } else {
      dispatch(addTenant({
        id: formName.toLowerCase().replace(/\s+/g, '-'),
        name: formName,
        denomination: 'Christ Apostolic Church',
        city: formCity,
        state: formStateVal,
        logoUrl: formLogoUrl || undefined,
        primaryColor: formColor,
        establishedYear: parseInt(formYear) || 2026,
        code: formCode || undefined,
        address: formAddress || undefined,
        country: formCountry || undefined,
        email: formEmail || undefined,
        phone: formPhone || undefined,
        website: formWebsite || undefined,
        pastorInCharge: formPastor || undefined,
        status: formStatus
      }));
    }

    resetForm();
    setShowOrgForm(false);
  };

  // Toggle branch status (Active / Inactive)
  const handleToggleStatus = (id: string) => {
    dispatch(toggleTenantStatus({ id }));
  };

  // Filter tenants by search query
  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(branchSearch.toLowerCase()) ||
    t.city.toLowerCase().includes(branchSearch.toLowerCase()) ||
    (t.code && t.code.toLowerCase().includes(branchSearch.toLowerCase()))
  );

  // Pagination calculations
  const totalItems = filteredTenants.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedTenants = filteredTenants.slice(startIndex, startIndex + pageSize);

  const filteredMembers = members.filter(m => {
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase());
    return matchesSearch;
  });

  const filteredFinances = finances.filter(f => {
    const contributor = f.contributorName?.toLowerCase() || '';
    const notes = f.notes?.toLowerCase() || '';
    const matchesSearch = contributor.includes(financeSearch.toLowerCase()) || notes.includes(financeSearch.toLowerCase());
    return matchesSearch;
  });

  // Calculate global statistics
  const totalBranches = tenants.length;
  const totalConsolidatedMembers = tenants.reduce((sum, t) => sum + t.memberCount, 0);
  
  // Overseer statistics
  const totalGiving = finances
    .filter(f => f.category !== 'expense')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalExpenses = finances
    .filter(f => f.category === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);

  // Selected organization metrics for statistics view
  const selectedTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];
  const selectedTenantMembers = members.filter(m => m.tenantId === selectedTenantId).length + (selectedTenant?.memberCount || 0) - members.filter(m => m.tenantId === selectedTenantId).length;
  const selectedTenantInflow = finances.filter(f => f.tenantId === selectedTenantId && f.category !== 'expense').reduce((sum, f) => sum + f.amount, 0);
  const selectedTenantOutflow = finances.filter(f => f.tenantId === selectedTenantId && f.category === 'expense').reduce((sum, f) => sum + f.amount, 0);

  // ----------------------------------------------------
  // DENOMINATION ADMIN WORKSPACE
  // ----------------------------------------------------
  if (session.role === 'denomination_admin') {
    if (activeTab === 'overview') {
      return (
        <div className="space-y-6">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Denomination Size</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white">{totalBranches} Registered Branches</h3>
                </div>
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                  <Layers className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-neutral-400">
                Operating under CAC General Council
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Consolidated Register</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white">{totalConsolidatedMembers.toLocaleString()} Members</h3>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-[10px] text-emerald-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                +4.2% average growth quarter-on-quarter
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">System Operations</span>
                  <h3 className="text-2xl font-bold tracking-tight text-emerald-400">All Systems Online</h3>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-neutral-400">
                Mock gateway endpoints fully active
              </div>
            </div>
          </div>

          {/* Quick Dashboard Action Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-neutral-900/40 p-5 rounded-2xl border border-neutral-900/60 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Branches Registry Summary</h4>
                  <p className="text-[10px] text-neutral-500">Quick list of registered assemblies under the Denomination umbrella.</p>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setShowOrgForm(true);
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-xl transition-all"
                >
                  Register Branch
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="glass-panel p-5 rounded-2xl border border-neutral-900 flex flex-col justify-between group">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest leading-none">
                          {tenant.code || 'CAC-BRANCH'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                          tenant.status === 'inactive' 
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' 
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {tenant.status || 'active'}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {tenant.name}
                        </h4>
                        <p className="text-[10px] text-neutral-400 flex items-center mt-1">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-neutral-500" />
                          {tenant.city}, {tenant.state}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-950 flex justify-between items-center text-[10px] text-neutral-400">
                      <span className="font-semibold text-neutral-200">
                        {tenant.memberCount.toLocaleString()} Members
                      </span>
                      <span className="font-mono text-neutral-500">
                        Est. {tenant.establishedYear}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side executive panel */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[350px]">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-1.5 text-indigo-400" />
                  National Executive Alerts
                </h4>
                <div className="space-y-4">
                  <div className="p-3.5 bg-neutral-950/40 rounded-xl border border-neutral-900 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-neutral-300">National Youth Conference</span>
                      <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">Event</span>
                    </div>
                    <p className="text-neutral-500 leading-normal">
                      Lagos and Abuja branches are requested to consolidate their youth registry rosters by July 15th.
                    </p>
                  </div>

                  <div className="p-3.5 bg-neutral-950/40 rounded-xl border border-neutral-900 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-rose-400">Audit Compliance</span>
                      <span className="text-[8px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded">Alert</span>
                    </div>
                    <p className="text-neutral-500 leading-normal">
                      Quarterly spiritual audit checkups are scheduled for next week. General Overseer will inspect the registers.
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-[9px] text-neutral-500 text-center font-mono">
                CAC Synod Operations Desk v1.0
              </div>
            </div>
          </div>

        </div>
      );
    }

    if (activeTab === 'branches') {
      return (
        <div className="space-y-6">
          <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Organization Management Module</h3>
              <p className="text-xs text-neutral-400">Manage church organizations and branches, configure settings, and monitor statistics.</p>
            </div>
            
            <button
              onClick={() => {
                resetForm();
                setShowOrgForm(!showOrgForm);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{showOrgForm ? 'Hide Form' : 'Create Organization'}</span>
            </button>
          </div>

          {/* CREATE/EDIT BRANCH FORM */}
          {showOrgForm && (
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-neutral-950/20">
              <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center">
                <Building2 className="w-4.5 h-4.5 mr-1.5 text-indigo-400" />
                {editingTenantId ? `Edit Organization: ${formName}` : 'Create New Organization'}
              </h4>
              <form onSubmit={handleSaveOrganization} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Avenue Assembly"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Organization Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CAC-AA-004"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Logo URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png"
                    value={formLogoUrl}
                    onChange={(e) => setFormLogoUrl(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Avenue Road, Bodija"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ibadan"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oyo State"
                    value={formStateVal}
                    onChange={(e) => setFormStateVal(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Country</label>
                  <input
                    type="text"
                    placeholder="Nigeria"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. info@avenue.cac.org"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +234 803 000 0000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Website URL</label>
                  <input
                    type="text"
                    placeholder="e.g. www.avenue.cac.org"
                    value={formWebsite}
                    onChange={(e) => setFormWebsite(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Pastor-In-Charge</label>
                  <input
                    type="text"
                    placeholder="e.g. Pastor James Oladapo"
                    value={formPastor}
                    onChange={(e) => setFormPastor(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Established Year</label>
                  <input
                    type="number"
                    placeholder="2026"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full bg-neutral-950 border border-neutral-900 text-neutral-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive (Deactivated)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase">Primary Accent Theme Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="w-10 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-neutral-400 uppercase">{formColor}</span>
                  </div>
                </div>

                <div className="sm:col-span-2 md:col-span-3 flex justify-end space-x-2 pt-4 border-t border-neutral-900">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowOrgForm(false);
                    }}
                    className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-xs font-bold shadow-lg transition-colors"
                  >
                    {editingTenantId ? 'Save Changes' : 'Register Organization'}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TWO COLUMN GRID: DIRECTORY & SELECTED STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT SIDE: LISTING WITH PAGINATION (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="bg-neutral-900/40 p-4 rounded-2xl border border-neutral-900/60 flex items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search by code, branch name, or city..."
                    value={branchSearch}
                    onChange={(e) => {
                      setBranchSearch(e.target.value);
                      setCurrentPage(1); // Reset page to 1
                    }}
                    className="w-full bg-neutral-950 border border-neutral-900 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-neutral-800 transition-colors"
                  />
                </div>
              </div>

              {/* Paginated Organizations Table */}
              <div className="glass-panel rounded-2xl border border-neutral-900 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-950/80 border-b border-neutral-900 text-[10px] font-bold text-neutral-400 uppercase">
                      <th className="p-4">Organization Name</th>
                      <th className="p-4">Code</th>
                      <th className="p-4 font-mono">Pastor</th>
                      <th className="p-4">City</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {paginatedTenants.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-neutral-500">
                          No organizations found matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedTenants.map((t) => (
                        <tr 
                          key={t.id} 
                          onClick={() => setSelectedTenantId(t.id)}
                          className={`hover:bg-neutral-900/20 transition-colors cursor-pointer ${
                            selectedTenantId === t.id ? 'bg-indigo-500/5 border-l-2 border-l-indigo-500' : ''
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-2.5">
                              {t.logoUrl ? (
                                <img src={t.logoUrl} alt={t.name} className="w-7 h-7 rounded-lg object-cover" />
                              ) : (
                                <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-[10px]" style={{ color: t.primaryColor }}>
                                  {t.name[0]}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-white">{t.name}</p>
                                <p className="text-[9px] text-neutral-500 font-mono">Est. {t.establishedYear}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-neutral-400 text-[11px]">{t.code || '-'}</td>
                          <td className="p-4 text-neutral-300">{t.pastorInCharge || 'Unassigned'}</td>
                          <td className="p-4 text-neutral-400">{t.city} ({t.state})</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                              t.status === 'inactive' 
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              {t.status || 'active'}
                            </span>
                          </td>
                          <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end space-x-1.5">
                              <button
                                onClick={() => startEdit(t)}
                                className="p-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-all"
                                title="Edit Organization"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(t.id)}
                                className={`px-2 py-1 border rounded-lg font-bold text-[9px] uppercase transition-all ${
                                  t.status === 'inactive'
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                                }`}
                                title={t.status === 'inactive' ? 'Activate branch' : 'Deactivate branch'}
                              >
                                {t.status === 'inactive' ? 'Activate' : 'Deactivate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-neutral-950 p-4 rounded-xl border border-neutral-900">
                  <span className="text-[10px] text-neutral-500 font-semibold uppercase">
                    Showing Page {currentPage} of {totalPages} ({totalItems} branches)
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-40 disabled:hover:text-neutral-400 text-[10px] font-bold rounded-lg transition-all"
                    >
                      Previous
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-40 disabled:hover:text-neutral-400 text-[10px] font-bold rounded-lg transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT SIDE: SELECTED STATS & CONFIG (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              <div className="glass-panel p-5 rounded-2xl border border-neutral-900 relative overflow-hidden space-y-4">
                <div 
                  className="absolute right-0 top-0 w-24 h-24 rounded-full blur-[40px] opacity-15"
                  style={{ backgroundColor: selectedTenant?.primaryColor || '#6366f1' }}
                />
                
                <div>
                  <span className="text-[8px] bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded text-neutral-500 font-mono uppercase tracking-wider">
                    Selected Node Stats
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{selectedTenant?.name || 'Loading...'}</h4>
                  <p className="text-[10px] text-neutral-400">{selectedTenant?.city}, {selectedTenant?.state}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-900 text-xs">
                    <p className="text-neutral-500 text-[9px] uppercase font-bold leading-none mb-1">Members</p>
                    <p className="font-extrabold text-neutral-200">{selectedTenantMembers} active</p>
                  </div>
                  
                  <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-900 text-xs">
                    <p className="text-neutral-500 text-[9px] uppercase font-bold leading-none mb-1">Established</p>
                    <p className="font-extrabold text-neutral-200 font-mono">{selectedTenant?.establishedYear}</p>
                  </div>

                  <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-900 text-xs col-span-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-neutral-500 text-[9px] uppercase font-bold leading-none mb-1">Ledger giving</p>
                        <p className="font-bold text-emerald-400">₦{selectedTenantInflow.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-neutral-500 text-[9px] uppercase font-bold leading-none mb-1">Expenditures</p>
                        <p className="font-bold text-rose-400">₦{selectedTenantOutflow.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-900/60 pt-3 space-y-2.5 text-[10px]">
                  <div className="flex items-center text-neutral-400">
                    <Shield className="w-3.5 h-3.5 mr-2 text-neutral-500" />
                    <span className="font-semibold text-neutral-300">Code:</span>
                    <span className="ml-auto font-mono text-neutral-400">{selectedTenant?.code || 'None'}</span>
                  </div>

                  <div className="flex items-center text-neutral-400">
                    <Users className="w-3.5 h-3.5 mr-2 text-neutral-500" />
                    <span className="font-semibold text-neutral-300">Pastor:</span>
                    <span className="ml-auto text-neutral-400">{selectedTenant?.pastorInCharge || 'Unassigned'}</span>
                  </div>

                  <div className="flex items-center text-neutral-400">
                    <Mail className="w-3.5 h-3.5 mr-2 text-neutral-500" />
                    <span className="font-semibold text-neutral-300">Email:</span>
                    <span className="ml-auto text-neutral-400 truncate max-w-[150px]">{selectedTenant?.email || 'N/A'}</span>
                  </div>

                  <div className="flex items-center text-neutral-400">
                    <Phone className="w-3.5 h-3.5 mr-2 text-neutral-500" />
                    <span className="font-semibold text-neutral-300">Phone:</span>
                    <span className="ml-auto text-neutral-400 font-mono">{selectedTenant?.phone || 'N/A'}</span>
                  </div>

                  <div className="flex items-center text-neutral-400">
                    <Globe className="w-3.5 h-3.5 mr-2 text-neutral-500" />
                    <span className="font-semibold text-neutral-300">Website:</span>
                    {selectedTenant?.website ? (
                      <a href={selectedTenant.website} target="_blank" rel="noreferrer" className="ml-auto text-indigo-400 hover:underline flex items-center">
                        Visit <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </a>
                    ) : (
                      <span className="ml-auto text-neutral-400">N/A</span>
                    )}
                  </div>

                  <div className="flex items-start text-neutral-400 pt-1 border-t border-neutral-900/40">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-neutral-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-neutral-300">Full Address:</p>
                      <p className="text-neutral-500 text-[9px] mt-0.5 leading-relaxed">{selectedTenant?.address || 'No registered street address.'}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      );
    }

    if (activeTab === 'audit-logs') {
      return (
        <div className="space-y-6">
          <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-900/60">
            <h3 className="text-sm font-bold text-white mb-2">Denomination Operations Audit Logs</h3>
            <p className="text-xs text-neutral-400">Live operational auditing for global staff actions and local tenant mutations.</p>
          </div>

          <div className="font-mono text-xs space-y-2.5 p-4 rounded-2xl bg-neutral-950 border border-neutral-900 max-h-[500px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 text-neutral-400 leading-relaxed">
                <span className="text-neutral-600 select-none text-[10px] pt-0.5">{log.timestamp}</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                  log.level === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  log.level === 'warn' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {log.level}
                </span>
                <span className="text-neutral-500 font-semibold text-[10px] pt-0.5">[{log.branchName || 'HQ'}]</span>
                <span className="text-neutral-300 font-semibold">{log.actor}:</span>
                <span className="flex-1 text-neutral-400">{log.action}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  // ----------------------------------------------------
  // DENOMINATION OVERSEER WORKSPACE (AUDITOR)
  // ----------------------------------------------------
  if (session.role === 'denomination_overseer') {
    if (activeTab === 'overview') {
      return (
        <div className="space-y-6">
          
          {/* Consolidated Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Consolidated Income</span>
                  <h3 className="text-2xl font-bold tracking-tight text-emerald-400">₦{totalGiving.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-neutral-400">
                Tithes, Offerings & Pledges across all nodes
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Consolidated Expenses</span>
                  <h3 className="text-2xl font-bold tracking-tight text-rose-400">₦{totalExpenses.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-rose-500/10 rounded-xl">
                  <FileText className="w-5 h-5 text-rose-400" />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-neutral-400">
                Operating expenditures and branch building funds
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Net Surplus Balance</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white">₦{(totalGiving - totalExpenses).toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div className="mt-4 text-[10px] text-neutral-400 font-semibold text-emerald-400">
                Healthy financial margin (Surplus)
              </div>
            </div>
          </div>

          {/* Consolidated statistics table */}
          <div className="glass-panel p-6 rounded-2xl border border-neutral-900">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-6 flex items-center">
              <Search className="w-4 h-4 mr-1.5 text-indigo-400" />
              Consolidated Spiritual Statistics by Branch
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {tenants.map((t) => {
                const branchFinances = finances.filter(f => f.tenantId === t.id);
                const branchGiving = branchFinances.filter(f => f.category !== 'expense').reduce((s, f) => s + f.amount, 0);
                const branchExpenses = branchFinances.filter(f => f.category === 'expense').reduce((s, f) => s + f.amount, 0);

                return (
                  <div key={t.id} className="p-4 bg-neutral-950/40 rounded-xl border border-neutral-900 text-xs space-y-3">
                    <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                      <span className="font-bold text-white">{t.name}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded font-bold uppercase" style={{ backgroundColor: `${t.primaryColor}20`, color: t.primaryColor }}>
                        {t.city}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Active Register Size:</span>
                        <span className="font-bold text-neutral-200">{t.memberCount} members</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Tithe Collections:</span>
                        <span className="font-bold text-emerald-400">₦{branchGiving.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Expenses Logged:</span>
                        <span className="font-bold text-rose-400">₦{branchExpenses.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'consolidated-finances') {
      return (
        <div className="space-y-6">
          <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-900/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Consolidated Financial Audits</h3>
              <p className="text-xs text-neutral-400">Perform oversight and inspect ledgers across all church branches.</p>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={financeSearch}
                onChange={(e) => setFinanceSearch(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
              />
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-neutral-900 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-950/80 border-b border-neutral-900 text-[10px] font-bold text-neutral-400 uppercase">
                  <th className="p-4">Date</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">Contributor / Recipient</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Purpose/Notes</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredFinances.map((f) => {
                  const branchName = tenants.find(t => t.id === f.tenantId)?.name || 'Branch';
                  return (
                     <tr key={f.id} className="hover:bg-neutral-900/30 transition-colors">
                      <td className="p-4 text-neutral-500 font-mono">{f.date}</td>
                      <td className="p-4 font-semibold text-neutral-300">{branchName}</td>
                      <td className="p-4 text-neutral-200">{f.contributorName || 'N/A'}</td>
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
                      <td className="p-4 text-neutral-500 truncate max-w-[200px]">{f.notes || '-'}</td>
                      <td className={`p-4 text-right font-bold ${f.category === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {f.category === 'expense' ? '-' : '+'} ₦{f.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'global-members') {
      return (
        <div className="space-y-6">
          <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-900/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Global Member Registry Search</h3>
              <p className="text-xs text-neutral-400">Spiritual auditor search to query membership directory globally.</p>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search global members by name..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-neutral-800 transition-colors"
              />
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-neutral-900 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-950/80 border-b border-neutral-900 text-[10px] font-bold text-neutral-400 uppercase">
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Branch Assembly</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Small Group</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredMembers.map((m) => {
                  const branchName = tenants.find(t => t.id === m.tenantId)?.name || 'Branch';
                  return (
                    <tr key={m.id} className="hover:bg-neutral-900/30 transition-colors">
                      <td className="p-4 font-bold text-white">{m.firstName} {m.lastName}</td>
                      <td className="p-4 text-neutral-300 font-semibold">{branchName}</td>
                      <td className="p-4 text-neutral-400">{m.email}</td>
                      <td className="p-4 text-neutral-400">{m.phone}</td>
                      <td className="p-4 text-neutral-500">{m.smallGroup || 'None'}</td>
                      <td className="p-4 text-neutral-500 font-mono">{m.joinedDate}</td>
                      <td className="p-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          m.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          m.status === 'suspended' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-neutral-800 text-neutral-400'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }

  return null;
}
