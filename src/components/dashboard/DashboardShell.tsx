import React, { useState } from 'react';
import { UserSession, Tenant, UserRole } from '../../types';
import { 
  Menu, X, LogOut, Shield, MapPin, Bell, Globe, 
  Activity, Users, DollarSign, BookOpen, Layers, 
  ListCollapse, UserCheck, Calendar, ClipboardList
} from 'lucide-react';

interface DashboardShellProps {
  session: UserSession;
  tenant?: Tenant;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export default function DashboardShell({
  session,
  tenant,
  onLogout,
  activeTab,
  setActiveTab,
  children
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set the primary theme accent color dynamically
  const activeColor = tenant?.primaryColor || '#6366f1'; // Default Indigo

  // Generate sidebar items based on role
  const getNavItems = (role: UserRole) => {
    switch (role) {
      case 'denomination_admin':
        return [
          { id: 'overview', label: 'Global Overview', icon: Globe },
          { id: 'branches', label: 'Manage Branches', icon: Layers },
          { id: 'audit-logs', label: 'System Audit Logs', icon: ClipboardList }
        ];
      case 'denomination_overseer':
        return [
          { id: 'overview', label: 'Overseer Summary', icon: Globe },
          { id: 'consolidated-finances', label: 'Financial Audits', icon: DollarSign },
          { id: 'global-members', label: 'Global Directory', icon: Users }
        ];
      case 'organization_admin':
        return [
          { id: 'overview', label: 'Branch Overview', icon: Activity },
          { id: 'members', label: 'Member Directory', icon: Users },
          { id: 'departments', label: 'Departments', icon: Layers },
          { id: 'attendance', label: 'Attendance Tracker', icon: ClipboardList },
          { id: 'cell-groups', label: 'Cell Groups', icon: Users },
          { id: 'events', label: 'Events & Programs', icon: Calendar },
          { id: 'role-manager', label: 'Administration', icon: UserCheck }
        ];
      case 'pastor':
        return [
          { id: 'overview', label: 'Spiritual Overview', icon: Calendar },
          { id: 'sermons', label: 'Sermon Manager', icon: BookOpen },
          { id: 'care-logs', label: 'Counseling & Care', icon: ListCollapse }
        ];
      case 'treasurer':
        return [
          { id: 'overview', label: 'Financial Ledger', icon: DollarSign },
          { id: 'contributions', label: 'Log Contributions', icon: ClipboardList }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(session.role);

  return (
    <div className="flex min-h-screen bg-neutral-950 font-sans relative overflow-hidden text-neutral-100">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-64'
      } lg:translate-x-0 lg:h-screen lg:z-10 overflow-y-auto`}>
        
        <div>
          {/* Sidebar Header Brand */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-900/60">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-colors"
                style={{ 
                  backgroundColor: `${activeColor}15`,
                  border: `1px solid ${activeColor}40`,
                  color: activeColor 
                }}
              >
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm tracking-widest bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                CAC HUB
              </span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? `${activeColor}10` : 'transparent',
                    color: isActive ? activeColor : '#a3a3a3',
                    borderLeft: isActive ? `2px solid ${activeColor}` : 'none',
                    paddingLeft: isActive ? '12px' : '16px'
                  }}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="p-4 border-t border-neutral-900/60 space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-neutral-950/40 rounded-2xl border border-neutral-900/40">
            <img 
              src={session.avatarUrl} 
              alt={session.name} 
              className="w-9 h-9 rounded-xl object-cover border border-neutral-800"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-neutral-200 truncate">{session.name}</p>
              <p className="text-[8px] text-neutral-500 font-bold uppercase truncate">{session.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-neutral-900 hover:border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900/40 text-neutral-400 hover:text-white transition-all text-xs font-bold"
          >
            <LogOut className="w-4 h-4 text-neutral-500" />
            <span>Sign Out Workspace</span>
          </button>
        </div>

      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 min-h-screen flex flex-col z-10 transition-all duration-300 overflow-x-hidden lg:pl-64">
        
        {/* Top Header Panel */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 border-b border-neutral-900/60 bg-neutral-950/40 backdrop-blur-md sticky top-0 z-20">
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-900 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Scope / Location Indicator */}
            <div className="flex items-center space-x-2">
              <div 
                className="w-2.5 h-2.5 rounded-full animate-ping opacity-75"
                style={{ backgroundColor: activeColor }}
              />
              <div>
                <h1 className="text-xs font-extrabold text-neutral-200">
                  {tenant ? `${tenant.denomination} - ${tenant.name}` : 'Global Denomination Office'}
                </h1>
                <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider">
                  {tenant ? `${tenant.city}, ${tenant.state}` : 'Headquarters Oversight'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Role indicator tag */}
            <span 
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-extrabold uppercase tracking-wide"
              style={{
                backgroundColor: `${activeColor}08`,
                borderColor: `${activeColor}15`,
                color: activeColor
              }}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{session.role.replace('_', ' ')}</span>
            </span>

            {/* Notification Icon */}
            <button className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg border border-neutral-800 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span 
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: activeColor }}
              />
            </button>
          </div>

        </header>

        {/* Dynamic Inner Dashboard Page Render */}
        <div className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full pb-12 lg:pb-20">
          {children}
        </div>

      </main>

    </div>
  );
}
