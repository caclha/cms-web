import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Church, Compass } from 'lucide-react';

export default function AuthGateway() {
  return (
    <div className="flex flex-1 min-h-screen bg-neutral-950 font-sans items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] shadow-2xl relative z-10">
        
        {/* Left Side: Brand Panel */}
        <div className="lg:col-span-5 bg-neutral-900/40 p-8 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-neutral-800/60 overflow-hidden">
          <div className="relative z-10 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-500" style={{ backgroundColor: `#6366f120`, border: `1px solid #6366f150`, color: '#6366f1' }}>
              <Church className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-xs tracking-widest text-neutral-400 leading-tight block">CHRIST APOSTOLIC CHURCH</span>
              <h2 className="text-lg font-extrabold text-white leading-none">CMS HUB</h2>
            </div>
          </div>

          <div className="my-12 relative z-10 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-950/60 border border-neutral-900 text-[10px] text-neutral-400">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Multi-Tenant Architecture Active</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
              Centralized Spiritual Operations & Oversight
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Connect and coordinate branch operations, members database, spiritual tracking, and financial ledgers under a single denominational umbrella.
            </p>
          </div>

          <div className="relative z-10 text-[10px] text-neutral-600">
            Powered by CAC Edge Server • v2.1-Beta
          </div>
        </div>

        {/* Right Side: Portal Selection */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Select Access Portal</h3>
            <p className="text-xs text-neutral-400">Choose your administrative level to access the management interface.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Link to="/admin-login" className="block p-5 rounded-2xl bg-neutral-900/40 border border-neutral-900 hover:border-indigo-500/40 hover:bg-neutral-900/80 text-left transition-all group relative overflow-hidden">
              <div className="absolute right-4 top-4 w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:bg-indigo-500/20 transition-all">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">Denomination HQ Portal</h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-normal">
                    Spiritual oversight, synod administrative logs, and cross-branch financial auditing.
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/organization-login" className="block p-5 rounded-2xl bg-neutral-900/40 border border-neutral-900 hover:border-emerald-500/40 hover:bg-neutral-900/80 text-left transition-all group relative overflow-hidden">
              <div className="absolute right-4 top-4 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500/20 transition-all">
                  <Church className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Local Church Branch Portal</h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-normal">
                    Manage local assembly membership rosters, sermon logs, cell fellowships, and ledger transactions.
                  </p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="text-[10px] text-neutral-500 text-center">
            Contact Synodal IT division for credential updates.
          </div>
        </div>
      </div>
    </div>
  );
}
