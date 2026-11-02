import React, { useState } from 'react';
import axios from 'axios';
import { 
  Wind, 
  Lock, 
  Mail, 
  User, 
  Shield, 
  Wrench, 
  Activity, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Layers
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('OPERATOR');
  const [department, setDepartment] = useState('Turbine Control Room');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // The 4 People / Actors from the UML Use Case Diagram
  const demoUsers = [
    {
      roleName: 'Admin',
      name: 'Elena Vance',
      email: 'admin@aeropulse.io',
      pass: 'admin123',
      color: 'bg-[#007a78] text-white',
      badgeColor: 'bg-[#e6f7f6] text-[#007a78] border-[#a5f3fc]',
      badge: 'Full Access',
      icon: Shield,
      desc: 'Manage Users, Turbines & Sensors, Set Threshold Values, Reports'
    },
    {
      roleName: 'Operator',
      name: 'Marcus Chen',
      email: 'operator@aeropulse.io',
      pass: 'operator123',
      color: 'bg-[#0284c7] text-white',
      badgeColor: 'bg-[#f0f9ff] text-[#0284c7] border-[#bae6fd]',
      badge: 'Control Room',
      icon: Activity,
      desc: 'Real-time Dashboard, Monitor Parameters, View Alerts, Generate Reports'
    },
    {
      roleName: 'Maintenance Engineer',
      name: 'Dr. Sarah Connor',
      email: 'engineer@aeropulse.io',
      pass: 'engineer123',
      color: 'bg-[#059669] text-white',
      badgeColor: 'bg-[#e6f9f0] text-[#059669] border-[#a7f3d0]',
      badge: 'Field Reliability',
      icon: Wrench,
      desc: 'Predictive RUL Insights, Update Maintenance Status, Schedule Repairs'
    },
    {
      roleName: 'System Supervisor',
      name: 'Alex Rivera',
      email: 'system@aeropulse.io',
      pass: 'system123',
      color: 'bg-[#0d1726] text-white',
      badgeColor: 'bg-[#f1f5f9] text-[#334155] border-[#cbd5e1]',
      badge: 'Automated Daemon',
      icon: Cpu,
      desc: 'Sensor Collection, Automated Anomaly Engine, DB Sync Pipeline'
    }
  ];

  const handleQuickLogin = async (demo) => {
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', {
        email: demo.email,
        password: demo.pass
      });
      if (res.data.success) {
        onLoginSuccess(res.data.user, res.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister 
      ? { name, email, password, role, department }
      : { email, password };

    try {
      const res = await axios.post(endpoint, payload);
      if (res.data.success) {
        onLoginSuccess(res.data.user, res.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication error. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col justify-center items-center p-4 relative">
      <div className="w-full max-w-5xl z-10 space-y-8 my-8">
        
        {/* Top Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#007a78] text-white shadow-md shadow-[#007a78]/25 mb-2">
            <Wind className="w-8 h-8 animate-spin-turbine" style={{ '--spin-duration': '5s' }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0f172a]">
            AeroPulse AI Wind Farm Platform
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Supervisory Control, Real-Time Sensor Telemetry & Predictive Maintenance (MERN Stack)
          </p>
        </div>

        {/* 4 People / Actors Quick Demo Login Grid */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#007a78]" />
              <h2 className="text-base font-bold text-[#0f172a]">
                Instant 1-Click Role Login (The 4 System Actors)
              </h2>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#e6f7f6] text-[#007a78] border border-[#a5f3fc]">
              Click any role to test immediately
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {demoUsers.map((demo) => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.roleName}
                  type="button"
                  onClick={() => handleQuickLogin(demo)}
                  disabled={loading}
                  className="group relative p-4 rounded-xl bg-white border border-slate-200 hover:border-[#007a78] text-left transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${demo.color} shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${demo.badgeColor}`}>
                        {demo.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-[#0f172a] text-sm group-hover:text-[#007a78] transition-colors">
                        {demo.roleName}
                      </h3>
                      <p className="text-xs font-semibold text-[#007a78] font-mono">{demo.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {demo.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold group-hover:text-[#007a78]">
                    <span>Login as {demo.roleName}</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Form Container (Login / Register) */}
        <div className="max-w-md mx-auto p-6 md:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          
          {/* Tab Selector */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isRegister 
                  ? 'bg-white text-[#0f172a] shadow-sm font-semibold' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isRegister 
                  ? 'bg-white text-[#0f172a] shadow-sm font-semibold' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register New User
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {isRegister && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#007a78] focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@aeropulse.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#007a78] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#007a78] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            {isRegister && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="OPERATOR">OPERATOR</option>
                      <option value="MAINTENANCE_ENGINEER">MAINTENANCE_ENGINEER</option>
                      <option value="SYSTEM">SYSTEM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Department</label>
                    <input
                      type="text"
                      placeholder="e.g. Field Operations"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-[#007a78] hover:bg-[#006361] text-white shadow-md shadow-[#007a78]/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account & Enter' : 'Authenticate & Enter Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span>UML Actors Alignment: <strong>Admin</strong> • <strong>Operator</strong> • <strong>Maintenance Engineer</strong> • <strong>System</strong></span>
          </div>

        </div>

      </div>
    </div>
  );
}
