import React, { useState } from 'react';
import { Wind, Gauge, Thermometer, Activity, Search, ShieldCheck, AlertTriangle, Wrench, Play, ShieldAlert, MapPin } from 'lucide-react';

export default function TurbineFleetGrid({ turbines, onSelectTurbine, onControlAction, onCreateWorkOrder }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTurbines = turbines.filter(t => {
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.turbineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.farmLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by turbine ID or farm location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007a78] focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'OPTIMAL', 'WARNING', 'CRITICAL', 'MAINTENANCE'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === status 
                  ? 'bg-[#007a78] text-white shadow-xs' 
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Turbine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTurbines.map((t) => {
          const { telemetry, status, healthScore, name, turbineId, farmLocation } = t;
          const rpm = telemetry?.rotorSpeed || 0;
          const power = telemetry?.activePower || 0;
          const genTemp = telemetry?.generatorTemp || 0;
          const vibration = telemetry?.gearboxVibration || 0;
          const spinDuration = rpm > 0 ? Math.max(0.4, (60 / Math.max(1, rpm)).toFixed(2)) : 0;

          return (
            <div 
              key={turbineId}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#007a78] shadow-xs transition-all flex flex-col justify-between"
            >
              {/* Top Bar */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200">
                      <Wind className={`w-4 h-4 text-[#007a78] ${rpm > 0 ? 'animate-spin-turbine' : ''}`} style={{ '--spin-duration': `${spinDuration}s` }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0f172a] text-sm">{name}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#007a78]" />
                        {farmLocation}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    status === 'OPTIMAL' || status === 'RUNNING' ? 'bg-[#e6f9f0] text-[#059669] border border-[#a7f3d0]' :
                    status === 'WARNING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    status === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {status}
                  </span>
                </div>

                {/* Health Score Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Health Index</span>
                    <strong className={`font-mono ${healthScore > 80 ? 'text-[#059669]' : healthScore > 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {healthScore}%
                    </strong>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        healthScore > 80 ? 'bg-[#059669]' : healthScore > 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${healthScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Live Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Power Output</span>
                    <strong className="text-[#007a78] font-mono text-sm">{power} kW</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Rotor Speed</span>
                    <strong className="text-[#0f172a] font-mono text-sm">{rpm} RPM</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Gen Temp</span>
                    <strong className={`font-mono text-sm ${genTemp > 80 ? 'text-rose-600' : 'text-slate-700'}`}>{genTemp} °C</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Vibration</span>
                    <strong className={`font-mono text-sm ${vibration > 4.0 ? 'text-rose-600' : 'text-slate-700'}`}>{vibration} mm/s</strong>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectTurbine(t)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all text-center"
                >
                  Diagnostics
                </button>
                {status === 'CRITICAL' || status === 'WARNING' ? (
                  <button
                    onClick={() => onCreateWorkOrder({ turbineId, turbineName: name, message: `Vibration ${vibration} mm/s, Temp ${genTemp} °C` })}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-xs"
                  >
                    Fix Issue
                  </button>
                ) : (
                  <button
                    onClick={() => onControlAction(turbineId, 'EMERGENCY_BRAKE')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200"
                    title="Pitch Brake"
                  >
                    Brake
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
