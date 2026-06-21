import React, { useState } from 'react';
import { MOCK_USERS } from '../../utils/mockData';
import { useAppSelector } from '../../lib/hooks';
import { RootState } from '../../lib/store';
import { Tenant, UserSession } from '../../types';
import { Shield, MapPin, Eye, EyeOff, Church, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrganizationLoginProps {
  onLoginSuccess: (session: UserSession, tenant?: Tenant) => void;
}

export default function OrganizationLogin({ onLoginSuccess }: OrganizationLoginProps) {
  const { tenants } = useAppSelector((state: RootState) => state.cms);
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeTenant = tenants.find(t => t.id === selectedTenantId);
  const activeColor = activeTenant?.primaryColor || '#10b981'; // Emerald-500

  const fillPreset = (user: UserSession) => {
    setEmail(user.email);
    setPassword('password123');
    if (user.tenantId) {
      setSelectedTenantId(user.tenantId);
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const matchedUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

      if (!matchedUser) {
        setError('Invalid credentials. Use the presets below for a quick demo login!');
        setIsSubmitting(false);
        return;
      }

      if (!matchedUser.tenantId) {
        setError('This is a Denomination Headquarters account. Please return and select "Denomination HQ Portal".');
        setIsSubmitting(false);
        return;
      }

      const selectedBranch = tenants.find(t => t.id === selectedTenantId);
      if (selectedBranch && selectedBranch.status === 'inactive') {
        setError(`Access Denied: The branch "${selectedBranch.name}" is currently deactivated.`);
        setIsSubmitting(false);
        return;
      }

      if (matchedUser.tenantId !== selectedTenantId) {
        setError(`This user belongs to another branch/office. Match the credentials with the correct selection.`);
        setIsSubmitting(false);
        return;
      }

      const tenant = tenants.find(t => t.id === matchedUser.tenantId);
      onLoginSuccess(matchedUser, tenant);
      setIsSubmitting(false);
    }, 800);
  };

  const filteredPresets = MOCK_USERS.filter(user => !!user.tenantId);

  return (
    <div
      className="flex flex-1 min-h-screen font-sans items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-neutral-950"
      style={{
        backgroundImage: 'url(/images/organization_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]"></div>

      {/* Floating Glassmorphism Card */}
      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 transition-colors duration-500" style={{ borderColor: `${activeColor}30` }}>

        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-500" style={{ backgroundColor: `${activeColor}20`, border: `1px solid ${activeColor}50`, color: activeColor }}>
                <Church className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white leading-none">CMS HUB</h2>
                <span className="font-bold text-[10px] tracking-widest text-emerald-300 leading-tight block mt-1 transition-colors duration-500" style={{ color: activeColor }}>LOCAL BRANCH</span>
              </div>
            </div>

          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Assembly Login</h3>
            <p className="text-xs text-neutral-400">Select your branch and enter your credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Select Church Branch</label>
              <div className="relative">
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-white text-xs rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer"
                  style={{ '--tw-ring-color': `${activeColor}80`, borderColor: 'rgba(255,255,255,0.1)' } as any}
                >
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id} className="bg-neutral-900 text-white">
                      {tenant.name} ({tenant.city})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <MapPin className="w-4 h-4 text-neutral-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@lighthouse.org"
                className="w-full bg-black/40 border border-white/10 text-white text-xs rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-neutral-500"
                style={{ '--tw-ring-color': `${activeColor}80` } as any}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Secret Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 border border-white/10 text-white text-xs rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-neutral-500"
                  style={{ '--tw-ring-color': `${activeColor}80` } as any}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-[11px] font-medium leading-relaxed backdrop-blur-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 mt-2 rounded-xl text-sm font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center group relative overflow-hidden"
              style={{ backgroundColor: activeColor, boxShadow: `0 4px 20px ${activeColor}30` }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center space-x-2">
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Access Branch</span>
                )}
              </span>
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Demo Presets</span>
              <Shield className="w-3.5 h-3.5 text-neutral-500" />
            </div>

            <div className="grid grid-cols-1 gap-2">
              {filteredPresets.map((user) => {
                const userTenantName = tenants.find(t => t.id === user.tenantId)?.name;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => fillPreset(user)}
                    className="flex items-center space-x-3 p-2.5 rounded-xl bg-black/20 border border-white/5 hover:border-white/20 hover:bg-black/40 text-left transition-all group"
                  >
                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-lg object-cover border border-white/10 shadow-sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate leading-tight group-hover:text-emerald-300 transition-colors">{user.name}</p>
                      <p className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">
                        {user.role.replace('_', ' ')} • {userTenantName}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
