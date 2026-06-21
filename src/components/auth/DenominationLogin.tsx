import React, { useState } from 'react';
import { MOCK_USERS } from '../../utils/mockData';
import { Tenant, UserSession } from '../../types';
import { Shield, Eye, EyeOff, Church, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DenominationLoginProps {
  onLoginSuccess: (session: UserSession, tenant?: Tenant) => void;
}

export default function DenominationLogin({ onLoginSuccess }: DenominationLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeColor = '#818cf8'; // Indigo-400

  const fillPreset = (user: UserSession) => {
    setEmail(user.email);
    setPassword('password123');
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

      if (matchedUser.tenantId) {
        setError('This account belongs to a Local Branch. Please return and select "Local Church Branch Portal".');
        setIsSubmitting(false);
        return;
      }

      onLoginSuccess(matchedUser, undefined);
      setIsSubmitting(false);
    }, 800);
  };

  const filteredPresets = MOCK_USERS.filter(user => !user.tenantId);

  return (
    <div
      className="flex flex-1 min-h-screen font-sans items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-neutral-950"
      style={{
        backgroundImage: 'url(/images/denomination_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay to ensure readability */}
      <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]"></div>

      {/* Floating Glassmorphism Card */}
      <div className="w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">

        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: `${activeColor}20`, border: `1px solid ${activeColor}50`, color: activeColor }}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white leading-none">CMS HUB</h2>
                <span className="font-bold text-[10px] tracking-widest text-indigo-300 leading-tight block mt-1">DENOMINATION HQ</span>
              </div>
            </div>

          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Welcome Back</h3>
            <p className="text-xs text-indigo-200/70">Sign in as a National Synod Admin or Spiritual Auditor.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cac-denomination.org"
                className="w-full bg-black/40 border border-white/10 text-white text-xs rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-neutral-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-indigo-200/70 uppercase tracking-wider">Secret Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 border border-white/10 text-white text-xs rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-neutral-500"
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
              style={{ backgroundColor: activeColor }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center space-x-2">
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Access Headquarters</span>
                )}
              </span>
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Demo Presets</span>
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
            </div>

            <div className="grid grid-cols-1 gap-2">
              {filteredPresets.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => fillPreset(user)}
                  className="flex items-center space-x-3 p-2.5 rounded-xl bg-black/20 border border-white/5 hover:border-indigo-500/30 hover:bg-black/40 text-left transition-all group"
                >
                  <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-lg object-cover border border-white/10 shadow-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate leading-tight group-hover:text-indigo-300 transition-colors">{user.name}</p>
                    <p className="text-[9px] text-indigo-200/60 font-semibold uppercase tracking-wider mt-0.5">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
