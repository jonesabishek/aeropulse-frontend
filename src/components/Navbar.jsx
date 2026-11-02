import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Activity, 
  Grid, 
  Wrench, 
  TrendingUp, 
  Radio, 
  Clock,
  CloudLightning,
  Database,
  ShieldCheck,
  FileText,
  Cpu,
  UserCheck,
  LogOut,
  ChevronDown,
  Sparkles,
  Bell,
  Menu,
  X,
  Layers,
  FileCheck,
  AlertTriangle,
  Users
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  isConnected, 
  dbStatus, 
  summary, 
  onOpenSandbox,
  currentUser,
  onLogout,
  onSwitchUser
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Nav Items aligned with the Dark Navy Sidebar from the reference image
  const allNavItems = [
    { id: 'overview', label: 'Dashboard', icon: Activity, roles: ['ADMIN', 'OPERATOR', 'MAINTENANCE_ENGINEER', 'SYSTEM'] },
    { id: 'fleet', label: 'Assets & Fleet', icon: Grid, roles: ['ADMIN', 'OPERATOR', 'MAINTENANCE_ENGINEER', 'SYSTEM'] },
    { id: 'inspector', label: 'Inspections & Diagnostics', icon: Wind, roles: ['ADMIN', 'OPERATOR', 'MAINTENANCE_ENGINEER', 'SYSTEM'] },
    { id: 'maintenance', label: 'Corrective Actions', icon: Wrench, roles: ['ADMIN', 'MAINTENANCE_ENGINEER', 'OPERATOR'] },
    { id: 'analytics', label: 'Analytics & Trends', icon: TrendingUp, roles: ['ADMIN', 'OPERATOR'] },
    { id: 'reports', label: 'Compliance Documents', icon: FileCheck, roles: ['ADMIN', 'OPERATOR'] },
    { id: 'admin', label: 'User & Asset Management', icon: Users, roles: ['ADMIN'] },
    { id: 'system', label: 'Sensor Pipeline Daemon', icon: Cpu, roles: ['ADMIN', 'SYSTEM'] },
  ];

  // The 4 roles from the UML Diagram
  const demoProfiles = [
    { role: 'ADMIN', name: 'Sophia Chen', email: 'admin@aeropulse.io', label: 'Administrator', tab: 'admin' },
    { role: 'OPERATOR', name: 'David Miller', email: 'operator@aeropulse.io', label: 'Wind Farm Operator', tab: 'overview' },
    { role: 'MAINTENANCE_ENGINEER', name: 'Elena Vance', email: 'engineer@aeropulse.io', label: 'Maintenance Engineer', tab: 'maintenance' },
    { role: 'SYSTEM', name: 'System Daemon', email: 'system@aeropulse.io', label: 'Autonomous Daemon', tab: 'system' }
  ];

  const currentRole = currentUser?.role || 'ADMIN';
  const visibleNavItems = allNavItems.filter(item => item.roles.includes(currentRole));
  const activeAlerts = summary?.activeAlertsCount || 0;

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#0d1726] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#007a78] flex items-center justify-center text-white font-bold text-sm">
            <Wind className="w-4 h-4 animate-spin-turbine" style={{ '--spin-duration': '5s' }} />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">AeroPulse</div>
            <div className="text-[10px] text-slate-400">Wind Monitoring System</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Left Sidebar (Desktop Fixed / Mobile Slide-out) */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0d1726] text-slate-300 flex flex-col justify-between transition-transform duration-200 border-r border-slate-800/80
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top: Brand Logo */}
        <div>
          <div className="p-5 border-b border-slate-800/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#007a78] text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Wind className="w-5 h-5 animate-spin-turbine" style={{ '--spin-duration': '6s' }} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight">
                AeroPulse
              </h1>
              <span className="text-[11px] text-slate-400 font-medium">
                Compliance & Telemetry
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] sidebar-scroll">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-[#1a2639] text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#14b8a6]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.id === 'overview' && activeAlerts > 0 && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {activeAlerts}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Notifications Item with Red Pill (Matching Image) */}
            <div className="pt-2 border-t border-slate-800/60 my-2">
              <div className="px-3.5 py-2 flex items-center justify-between text-xs text-slate-400 font-semibold">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <span>Notifications</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeAlerts > 0 ? activeAlerts : 1}
                </span>
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom: User Profile & Quick Switcher */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0a121e]">
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#111c2e] hover:bg-[#16243b] text-left transition-all border border-slate-700/60"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#007a78] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-bold text-white text-xs leading-tight">
                    {currentUser?.name || 'AeroPulse User'}
                  </div>
                  <div className="text-[10px] font-mono text-[#14b8a6] font-semibold uppercase">
                    {currentRole.replace('_', ' ')}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Quick Switch Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-2xl bg-[#111c2e] border border-slate-700 shadow-2xl z-50 space-y-1 text-xs animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-700/60">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Current Actor (UML)
                  </span>
                  <div className="font-bold text-white mt-0.5">{currentUser?.name}</div>
                  <div className="text-[11px] font-mono text-[#14b8a6]">{currentUser?.email}</div>
                </div>

                <div className="pt-1.5 pb-1 px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Switch Actor:
                </div>

                {demoProfiles.map((p) => {
                  const isCurrent = currentRole === p.role;
                  return (
                    <button
                      key={p.role}
                      onClick={() => {
                        onSwitchUser(p);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isCurrent 
                          ? 'bg-[#1a2639] border border-[#007a78] text-white font-semibold' 
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.label}</div>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                        isCurrent ? 'bg-[#007a78] text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.role}
                      </span>
                    </button>
                  );
                })}

                <div className="pt-2 border-t border-slate-700/60">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 border border-rose-900/40 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
