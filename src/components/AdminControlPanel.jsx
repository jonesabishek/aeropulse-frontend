import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, 
  Users, 
  Sliders, 
  Wind, 
  UserPlus, 
  Trash2, 
  Check, 
  X, 
  Save, 
  Plus, 
  MapPin, 
  AlertTriangle, 
  RefreshCw,
  Edit2,
  CheckCircle2
} from 'lucide-react';

export default function AdminControlPanel({ turbines, onRefreshFleet, showToast }) {
  const [activeSubTab, setActiveSubTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddTurbineOpen, setIsAddTurbineOpen] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('pass123');
  const [newUserRole, setNewUserRole] = useState('OPERATOR');
  const [newUserDept, setNewUserDept] = useState('Wind Operations');

  // New Turbine Form State
  const [turbineName, setTurbineName] = useState('');
  const [farmLocation, setFarmLocation] = useState('Zephyr Valley');
  const [ratedCapacity, setRatedCapacity] = useState(3.5);
  const [modelType, setModelType] = useState('AeroVane 3.5MW NextGen');

  // Threshold Configuration State (Admin: Set Threshold Values)
  const [thresholds, setThresholds] = useState({
    vibrationWarning: 3.0,
    vibrationCritical: 4.5,
    generatorTempWarning: 75.0,
    generatorTempCritical: 85.0,
    bearingTempWarning: 70.0,
    bearingTempCritical: 85.0,
    oilPressureMin: 2.5,
    cutInWindSpeed: 3.0,
    cutOutWindSpeed: 25.0
  });
  const [savingThresholds, setSavingThresholds] = useState(false);

  // Fetch Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get('/api/auth/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.warn('Could not fetch users:', err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch Thresholds
  const fetchThresholds = async () => {
    try {
      const res = await axios.get('/api/thresholds');
      if (res.data.success && res.data.thresholds) {
        setThresholds(res.data.thresholds);
      }
    } catch (err) {
      console.warn('Could not fetch thresholds:', err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchThresholds();
  }, []);

  // Handle Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/users', {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
        department: newUserDept
      });
      if (res.data.success) {
        showToast?.(`User ${newUserName} created successfully`, 'success');
        setIsAddUserOpen(false);
        setNewUserName('');
        setNewUserEmail('');
        fetchUsers();
      }
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Failed to create user', 'alert');
    }
  };

  // Handle Update User Role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await axios.patch(`/api/auth/users/${userId}`, { role: newRole });
      if (res.data.success) {
        showToast?.('User role updated in MongoDB', 'success');
        setUsers(users.map(u => u._id === userId ? res.data.user : u));
      }
    } catch (err) {
      showToast?.('Failed to update role', 'alert');
    }
  };

  // Handle Toggle User Status
  const handleToggleUserStatus = async (user) => {
    try {
      const res = await axios.patch(`/api/auth/users/${user._id}`, { isActive: !user.isActive });
      if (res.data.success) {
        showToast?.(`User ${user.name} ${!user.isActive ? 'activated' : 'deactivated'}`, 'info');
        setUsers(users.map(u => u._id === user._id ? res.data.user : u));
      }
    } catch (err) {
      showToast?.('Failed to toggle status', 'alert');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user ${userName}?`)) return;
    try {
      const res = await axios.delete(`/api/auth/users/${userId}`);
      if (res.data.success) {
        showToast?.(`User ${userName} deleted from database`, 'success');
        setUsers(users.filter(u => u._id !== userId));
      }
    } catch (err) {
      showToast?.('Failed to delete user', 'alert');
    }
  };

  // Handle Add Turbine
  const handleAddTurbine = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/turbines', {
        name: turbineName,
        farmLocation,
        ratedCapacity: Number(ratedCapacity),
        modelType
      });
      if (res.data.success) {
        showToast?.(`Turbine ${turbineName} commissioned to grid`, 'success');
        setIsAddTurbineOpen(false);
        setTurbineName('');
        onRefreshFleet?.();
      }
    } catch (err) {
      showToast?.('Failed to add turbine', 'alert');
    }
  };

  // Handle Decommission Turbine
  const handleDeleteTurbine = async (turbineId, tName) => {
    if (!window.confirm(`Decommission turbine ${tName} (${turbineId})?`)) return;
    try {
      const res = await axios.delete(`/api/turbines/${turbineId}`);
      if (res.data.success) {
        showToast?.(`Turbine ${tName} decommissioned`, 'info');
        onRefreshFleet?.();
      }
    } catch (err) {
      showToast?.('Failed to delete turbine', 'alert');
    }
  };

  // Handle Save Threshold Values
  const handleSaveThresholds = async (e) => {
    e.preventDefault();
    setSavingThresholds(true);
    try {
      const res = await axios.put('/api/thresholds', thresholds);
      if (res.data.success) {
        showToast?.('Thresholds successfully saved to MongoDB and live physics engine', 'success');
      }
    } catch (err) {
      showToast?.('Failed to save thresholds', 'alert');
    } finally {
      setSavingThresholds(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#007a78] text-white shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#0f172a]">Administrator Command Center</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-[#e6f7f6] text-[#007a78] border border-[#a5f3fc]">
                Admin Exclusive
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Execute UML Admin Use Cases: Manage Users, Manage Turbines & Sensors, Set Threshold Values
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'users' 
                ? 'bg-white text-[#0f172a] shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Users</span>
          </button>

          <button
            onClick={() => setActiveSubTab('turbines')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'turbines' 
                ? 'bg-white text-[#0f172a] shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Manage Turbines</span>
          </button>

          <button
            onClick={() => setActiveSubTab('thresholds')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'thresholds' 
                ? 'bg-white text-[#0f172a] shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Set Threshold Values</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: MANAGE USERS */}
      {activeSubTab === 'users' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#007a78]" />
                User Access & Permissions Directory (MongoDB Persisted)
              </h3>
              <p className="text-xs text-slate-500">
                Grant or revoke roles for Admin, Operator, Maintenance Engineer, and System Monitor
              </p>
            </div>
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#007a78] hover:bg-[#006361] text-white shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-semibold text-[#0f172a] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#007a78] flex items-center justify-center font-bold text-white text-xs shadow-2xs">
                        {u.name?.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3 text-slate-600 font-mono">{u.email}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                        className="p-1.5 rounded-lg bg-slate-50 border border-slate-300 text-[11px] text-slate-800 font-semibold focus:outline-none focus:border-[#007a78]"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="OPERATOR">OPERATOR</option>
                        <option value="MAINTENANCE_ENGINEER">MAINTENANCE_ENGINEER</option>
                        <option value="SYSTEM">SYSTEM</option>
                      </select>
                    </td>
                    <td className="p-3 text-slate-600">{u.department || 'Operations'}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleUserStatus(u)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.isActive 
                            ? 'bg-[#e6f9f0] text-[#059669] border-[#a7f3d0]' 
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MANAGE TURBINES & SENSORS */}
      {activeSubTab === 'turbines' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                <Wind className="w-5 h-5 text-[#007a78]" />
                Fleet Commissioning & Turbine Asset Registry
              </h3>
              <p className="text-xs text-slate-500">
                Register new wind turbines, edit generation capacity, or decommission units
              </p>
            </div>
            <button
              onClick={() => setIsAddTurbineOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#007a78] hover:bg-[#006361] text-white shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Commission New Turbine</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {turbines.map(t => (
              <div key={t.turbineId} className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#0f172a] text-sm">{t.name}</h4>
                    <span className="text-[10px] font-mono text-[#007a78] font-bold">{t.turbineId}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                    {t.ratedCapacity} MW
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 font-mono">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#007a78]" />
                    <span>{t.farmLocation}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Model: {t.modelType}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Status: <strong className="text-[#059669]">{t.status}</strong> • Health: {t.healthScore}%
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => handleDeleteTurbine(t.turbineId, t.name)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Decommission</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SET THRESHOLD VALUES */}
      {activeSubTab === 'thresholds' && (
        <form onSubmit={handleSaveThresholds} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#007a78]" />
                Operational Threshold Parameters & Safety Envelope
              </h3>
              <p className="text-xs text-slate-500">
                UML Use Case: Set Threshold Values. Defines alert triggers for automated System detection.
              </p>
            </div>
            <button
              type="submit"
              disabled={savingThresholds}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#007a78] hover:bg-[#006361] text-white shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{savingThresholds ? 'Saving to MongoDB...' : 'Save & Propagate Rules'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            
            {/* Gearbox Vibration */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-[#0f172a] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#007a78]" />
                Planetary Gearbox Vibration (mm/s)
              </h4>
              <div>
                <label className="text-slate-600 text-[11px] block mb-1">Warning Threshold: {thresholds.vibrationWarning} mm/s</label>
                <input
                  type="range"
                  min="1.5"
                  max="4.0"
                  step="0.1"
                  value={thresholds.vibrationWarning}
                  onChange={(e) => setThresholds({ ...thresholds, vibrationWarning: Number(e.target.value) })}
                  className="w-full accent-[#007a78] cursor-pointer"
                />
              </div>
              <div>
                <label className="text-rose-600 text-[11px] block mb-1">Critical Fault Threshold: {thresholds.vibrationCritical} mm/s</label>
                <input
                  type="range"
                  min="4.0"
                  max="8.0"
                  step="0.1"
                  value={thresholds.vibrationCritical}
                  onChange={(e) => setThresholds({ ...thresholds, vibrationCritical: Number(e.target.value) })}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Generator Stator Temp */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-[#0f172a] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Generator Stator Temperature (°C)
              </h4>
              <div>
                <label className="text-slate-600 text-[11px] block mb-1">Warning Threshold: {thresholds.generatorTempWarning} °C</label>
                <input
                  type="range"
                  min="60"
                  max="80"
                  step="1"
                  value={thresholds.generatorTempWarning}
                  onChange={(e) => setThresholds({ ...thresholds, generatorTempWarning: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-rose-600 text-[11px] block mb-1">Critical Overheat Threshold: {thresholds.generatorTempCritical} °C</label>
                <input
                  type="range"
                  min="80"
                  max="110"
                  step="1"
                  value={thresholds.generatorTempCritical}
                  onChange={(e) => setThresholds({ ...thresholds, generatorTempCritical: Number(e.target.value) })}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Bearing Temp */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-[#0f172a] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#0284c7]" />
                Main Shaft Bearing Temperature (°C)
              </h4>
              <div>
                <label className="text-slate-600 text-[11px] block mb-1">Warning: {thresholds.bearingTempWarning} °C</label>
                <input
                  type="range"
                  min="55"
                  max="75"
                  step="1"
                  value={thresholds.bearingTempWarning}
                  onChange={(e) => setThresholds({ ...thresholds, bearingTempWarning: Number(e.target.value) })}
                  className="w-full accent-[#0284c7] cursor-pointer"
                />
              </div>
              <div>
                <label className="text-rose-600 text-[11px] block mb-1">Critical: {thresholds.bearingTempCritical} °C</label>
                <input
                  type="range"
                  min="75"
                  max="100"
                  step="1"
                  value={thresholds.bearingTempCritical}
                  onChange={(e) => setThresholds({ ...thresholds, bearingTempCritical: Number(e.target.value) })}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Minimum Oil Pressure */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-[#0f172a]">Min Lubrication Oil Pressure (bar)</h4>
              <div>
                <label className="text-slate-600 text-[11px] block mb-1">Minimum Allowable: {thresholds.oilPressureMin} bar</label>
                <input
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.1"
                  value={thresholds.oilPressureMin}
                  onChange={(e) => setThresholds({ ...thresholds, oilPressureMin: Number(e.target.value) })}
                  className="w-full accent-[#007a78] cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-slate-500">Pressure below this triggers emergency lubrication alarm.</p>
            </div>

            {/* Wind Cut-out Limit */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-[#0f172a]">Wind Cut-Out Limit (m/s)</h4>
              <div>
                <label className="text-slate-600 text-[11px] block mb-1">Auto Feather Cut-out: {thresholds.cutOutWindSpeed} m/s</label>
                <input
                  type="range"
                  min="20.0"
                  max="30.0"
                  step="0.5"
                  value={thresholds.cutOutWindSpeed}
                  onChange={(e) => setThresholds({ ...thresholds, cutOutWindSpeed: Number(e.target.value) })}
                  className="w-full accent-[#007a78] cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-slate-500">Blades feather to 85° to protect mechanical assembly.</p>
            </div>

          </div>
        </form>
      )}

      {/* Modal: Add New User */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#007a78]" />
                Register New User in MongoDB
              </h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#007a78]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="david@aeropulse.io"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-[#007a78]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Initial Password</label>
                <input
                  type="text"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-[#007a78]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
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
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#007a78] hover:bg-[#006361] text-white font-semibold shadow-xs"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Turbine */}
      {isAddTurbineOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                <Wind className="w-5 h-5 text-[#007a78]" />
                Commission New Turbine
              </h3>
              <button onClick={() => setIsAddTurbineOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTurbine} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Turbine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zephyr Delta-4"
                  value={turbineName}
                  onChange={(e) => setTurbineName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#007a78]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Farm Location</label>
                <select
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                >
                  <option value="Zephyr Valley">Zephyr Valley (Onshore)</option>
                  <option value="High Desert Ridge">High Desert Ridge (High Altitude)</option>
                  <option value="Offshore Boreas Bay">Offshore Boreas Bay (Marine)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Rated Capacity (MW)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratedCapacity}
                    onChange={(e) => setRatedCapacity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-[#007a78]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Model Type</label>
                  <input
                    type="text"
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#007a78]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTurbineOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#007a78] hover:bg-[#006361] text-white font-semibold shadow-xs"
                >
                  Commission Turbine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
