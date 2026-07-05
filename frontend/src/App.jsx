import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeadProvider } from './context/LeadContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import LeadManager from './components/LeadManager';
import KanbanBoard from './components/KanbanBoard';
import { LogOut, User, LayoutDashboard, Briefcase, Kanban, Settings } from 'lucide-react';




function CRMApp() {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'leads'


  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium animate-pulse">Syncing CRM Workspace...</p>
        </div>
      </div>
    );
  }

  // Guest Onboarding Flow (Not Logged In)
  if (!user) {
    if (currentView === 'register') {
      return <Register onSwitchToLogin={() => setCurrentView('login')} />;
    }
    return <Login onSwitchToRegister={() => setCurrentView('register')} />;
  }

  // Dashboard Flow (Logged In)
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Lightweight CRM
          </h1>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-violet-600/10 text-violet-400 border-violet-500/20'
                : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
              activeTab === 'leads'
                ? 'bg-violet-600/10 text-violet-400 border-violet-500/20'
                : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <Briefcase size={18} />
            Leads
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
              activeTab === 'pipeline'
                ? 'bg-violet-600/10 text-violet-400 border-violet-500/20'
                : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/30'
            }`}
          >
            <Kanban size={18} />
            Pipeline
          </button>
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0">
              <User size={18} />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-white truncate">{user.name}</h4>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col p-8 relative overflow-y-auto">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/5 blur-[100px] pointer-events-none" />

        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {activeTab === 'dashboard' && 'Sales Dashboard'}
              {activeTab === 'leads' && 'Leads Management'}
              {activeTab === 'pipeline' && 'Sales Pipeline'}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {activeTab === 'dashboard' && 'Workspace analytics and sales status'}
              {activeTab === 'leads' && 'Track and manage sales pipeline prospects'}
              {activeTab === 'pipeline' && 'Drag and drop opportunities to shift deal stages'}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Database Connected
          </div>
        </header>

        {/* Workspace Dynamic Content */}
        <div className="relative z-10">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'leads' && <LeadManager />}
          {activeTab === 'pipeline' && <KanbanBoard />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LeadProvider>
        <CRMApp />
      </LeadProvider>
    </AuthProvider>
  );
}
