import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Routes, Route, Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import { store } from './lib/store';
import { useAppSelector, useAppDispatch } from './lib/hooks';
import { login, logout, updateSession } from './lib/features/cms/cmsSlice';
import AuthGateway from './components/auth/AuthGateway';
import DenominationLogin from './components/auth/DenominationLogin';
import OrganizationLogin from './components/auth/OrganizationLogin';
import DashboardShell from './components/dashboard/DashboardShell';
import DenominationViews from './components/dashboard/DenominationViews';
import OrganizationViews from './components/dashboard/OrganizationViews';
import SandboxController from './components/SandboxController';
import { UserSession, Tenant } from './types';

function DashboardRouter() {
  const dispatch = useAppDispatch();
  const { session, activeTenant } = useAppSelector((state) => state.cms);
  const { tab } = useParams();
  const navigate = useNavigate();

  const activeTab = tab || 'overview';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const setActiveTab = (newTab: string) => {
    navigate(`/${newTab}`);
  };

  if (!session) {
    return <Navigate to="/" />;
  }

  const isGlobalRole = session.role === 'denomination_admin' || session.role === 'denomination_overseer';

  return (
    <DashboardShell
      session={session}
      tenant={activeTenant || undefined}
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {isGlobalRole ? (
        <DenominationViews session={session} activeTab={activeTab} />
      ) : (
        activeTenant ? (
          <OrganizationViews session={session} tenant={activeTenant} activeTab={activeTab} />
        ) : (
          <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-2xl">
            <p className="text-sm text-neutral-400">Branch details not loaded. Switch to a branch in the sandbox panel.</p>
          </div>
        )
      )}
    </DashboardShell>
  );
}

function CmsAppContent() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { session, activeTenant } = useAppSelector((state) => state.cms);

  const handleLogin = (userSession: UserSession, tenant?: Tenant) => {
    dispatch(login({ session: userSession, tenant }));
    navigate('/overview');
  };

  const handleUpdateSession = (userSession: UserSession, tenant?: Tenant) => {
    dispatch(updateSession({ session: userSession, tenant }));
    navigate('/overview');
  };

  return (
    <>
      <Routes>
        <Route path="/admin-login" element={session ? <Navigate to="/overview" /> : <DenominationLogin onLoginSuccess={handleLogin} />} />
        <Route path="/organization-login" element={session ? <Navigate to="/overview" /> : <OrganizationLogin onLoginSuccess={handleLogin} />} />
        <Route path="/" element={session ? <Navigate to="/overview" /> : <div className="min-h-screen bg-neutral-950" />} />
        <Route path="/:tab" element={<DashboardRouter />} />
      </Routes>

    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <CmsAppContent />
    </Provider>
  );
}
