import React, { useState } from 'react';
import { MOCK_USERS, MOCK_TENANTS } from '../utils/mockData';
import { UserSession, Tenant, UserRole } from '../types';
import { Settings, Users, Shield, RefreshCw, Layers, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface SandboxControllerProps {
  currentSession: UserSession;
  currentTenant?: Tenant;
  onUpdateSession: (session: UserSession, tenant?: Tenant) => void;
}

export default function SandboxController({
  currentSession,
  currentTenant,
  onUpdateSession
}: SandboxControllerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    // Find the default user matching this role
    const matchedUser = MOCK_USERS.find(u => u.role === role);
    if (!matchedUser) return;

    // Use current tenant if it is a branch role, otherwise default
    let tenant: Tenant | undefined = undefined;
    if (role !== 'denomination_admin' && role !== 'denomination_overseer') {
      const tenantId = currentTenant?.id || matchedUser.tenantId || MOCK_TENANTS[0].id;
      tenant = MOCK_TENANTS.find(t => t.id === tenantId);
    }

    const updatedUser = {
      ...matchedUser,
      tenantId: tenant?.id
    };

    onUpdateSession(updatedUser, tenant);
  };

  const handleTenantChange = (tenantId: string) => {
    const nextTenant = MOCK_TENANTS.find(t => t.id === tenantId);
    if (!nextTenant) return;

    // Keep current role, just adjust the tenant ID
    const updatedUser = {
      ...currentSession,
      tenantId: nextTenant.id
    };

    onUpdateSession(updatedUser, nextTenant);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Mini Toggle Badge */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4.5 py-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 group"
        >
          <Sparkles className="w-4 h-4 animate-pulse group-hover:rotate-12 transition-transform" />
          <span>Open CMS Sandbox</span>
        </button>
      )}

      {/* Controller Panel */}
      {isOpen && (
        <div className="w-80 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden glass-panel">
          
          {/* Header */}
          <div className="p-4 bg-neutral-950/80 border-b border-neutral-800/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-bold text-xs text-white">CMS DEMO CONTROLLER</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <ChevronDown className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            
            {/* Status indicator */}
            <div className="p-3 bg-neutral-950/40 rounded-xl border border-neutral-900 text-xs">
              <p className="text-neutral-500 font-semibold text-[10px]">CURRENT VIEWING CONFIGURATION</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-white font-bold">Role:</span>
                <span className="text-indigo-400 font-mono text-[10px] uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {currentSession.role.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-white font-bold">Scope:</span>
                <span className="text-neutral-300 truncate max-w-[140px] text-[10px] font-medium">
                  {currentTenant ? currentTenant.name : 'Global Denomination'}
                </span>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 block">QUICK ROLE SWAPPER</label>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { role: 'denomination_admin', label: 'Denomination Admin' },
                  { role: 'denomination_overseer', label: 'Denomination Overseer (Auditor)' },
                  { role: 'organization_admin', label: 'Organization Admin (Local)' },
                  { role: 'pastor', label: 'Pastor / Spiritual Leader' },
                  { role: 'treasurer', label: 'Treasurer / Financial Officer' }
                ].map((item) => (
                  <button
                    key={item.role}
                    onClick={() => handleRoleChange(item.role as UserRole)}
                    className={`text-left text-[10px] py-1.5 px-3 rounded-lg border transition-all ${
                      currentSession.role === item.role
                        ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 font-bold'
                        : 'bg-neutral-950/30 border-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tenant Branch Switcher (Only if branch role) */}
            {currentSession.role !== 'denomination_admin' && currentSession.role !== 'denomination_overseer' && (
              <div className="space-y-1.5 pt-2 border-t border-neutral-800/60">
                <label className="text-[10px] font-bold text-neutral-400 block">ACTIVE CHURCH BRANCH</label>
                <div className="grid grid-cols-3 gap-1">
                  {MOCK_TENANTS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTenantChange(t.id)}
                      className={`text-center text-[9px] py-2 px-1 rounded-lg border transition-all leading-tight ${
                        currentTenant?.id === t.id
                          ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 font-bold'
                          : 'bg-neutral-950/30 border-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                      }`}
                    >
                      <span className="block truncate">{t.name}</span>
                      <span className="text-[7px] text-neutral-500 block truncate mt-0.5">{t.city}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[9px] text-neutral-500 italic text-center pt-2">
              Note: Changing roles or branches instantly repopulates dashboard content.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
