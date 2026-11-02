import React, { useState } from 'react';
import Turbine3DCanvas from './Turbine3DCanvas';
import { Activity, Clock, Wrench, ShieldAlert, Sliders, ChevronLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TurbineDetailInspector({ turbine, history, onControlAction, onCreateWorkOrder, onBack }) {
  const [pitchSlider, setPitchSlider] = useState(turbine?.telemetry?.pitchAngle || 2);

  if (!turbine) {
    return (
      <div className="p-8 text-center text-slate-500">
        No turbine selected. Please select a turbine from the fleet grid.
      </div>
    );
  }

  const { turbineId, name, farmLocation, status, healthScore, remainingUsefulLife, telemetry } = turbine;
  const rul = {
    gearboxDays: remainingUsefulLife?.gearboxDays ?? 450,
    generatorDays: remainingUsefulLife?.generatorDays ?? 620,
    pitchDays: remainingUsefulLife?.pitchDays ?? 310,
    rotorDays: remainingUsefulLife?.rotorDays ?? 890
  };

  const handleApplyPitch = () => {
    onControlAction(turbineId, 'SET_PITCH', { pitchAngle: Number(pitchSlider) });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs"
        >
          <ChevronLeft className="w-4 h-4 text-[#007a78]" />
          <span>Back to Fleet Overview</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Inspecting:</span>
          <span className="text-sm font-bold text-[#0f172a] font-mono">{name} ({turbineId})</span>
        </div>
      </div>

      {/* Main Grid: 3D Visualizer on Left, Controls & RUL on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 3D Turbine Canvas Visualizer (7 cols) */}
        <div className="lg:col-span-7">
          <Turbine3DCanvas turbine={turbine} onControlAction={onControlAction} />
        </div>

        {/* Right Column: Predictive RUL & Remote Control Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Predictive RUL Health Matrix */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-5 h-5 text-[#007a78]" />
              AI Component Remaining Useful Life (RUL)
            </h3>

            <div className="space-y-3 text-xs">
              {/* Gearbox RUL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-700 font-medium">Planetary Gearbox Assembly</span>
                  <strong className={`font-mono ${rul.gearboxDays < 30 ? 'text-rose-600 font-bold' : 'text-[#007a78]'}`}>
                    {Math.round(rul.gearboxDays)} Days RUL
                  </strong>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${rul.gearboxDays < 30 ? 'bg-rose-500 animate-pulse' : 'bg-[#007a78]'}`}
                    style={{ width: `${Math.min(100, (rul.gearboxDays / 600) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Generator RUL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-700 font-medium">Stator & Rotor Generator</span>
                  <strong className="text-[#0284c7] font-mono">
                    {Math.round(rul.generatorDays)} Days RUL
                  </strong>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#0284c7]"
                    style={{ width: `${Math.min(100, (rul.generatorDays / 800) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Pitch System RUL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-700 font-medium">Hydraulic Pitch Actuators</span>
                  <strong className="text-[#059669] font-mono">
                    {Math.round(rul.pitchDays)} Days RUL
                  </strong>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#059669]"
                    style={{ width: `${Math.min(100, (rul.pitchDays / 500) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onCreateWorkOrder({ turbineId, turbineName: name, message: `RUL inspection request for ${name}` })}
              className="w-full mt-2 py-2 rounded-xl text-xs font-semibold bg-[#007a78] hover:bg-[#006361] text-white shadow-xs flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Schedule Proactive Maintenance</span>
            </button>
          </div>

          {/* Manual Control Command Station */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-5 h-5 text-[#007a78]" />
              Blade Pitch & Yaw Command Station
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-700 mb-1">
                  <span>Blade Pitch Angle Override</span>
                  <strong className="text-[#007a78] font-mono">{pitchSlider}°</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={pitchSlider}
                  onChange={(e) => setPitchSlider(e.target.value)}
                  className="w-full accent-[#007a78] bg-slate-100 cursor-pointer h-2 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0° (Max Power)</span>
                  <span>45° (Feathered)</span>
                  <span>90° (Parked)</span>
                </div>
              </div>

              <button
                onClick={handleApplyPitch}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all"
              >
                Apply Pitch Override Command
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Historical Telemetry Time Series Chart for this turbine */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#007a78]" />
          Historical Telemetry Waveforms ({name})
        </h3>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history || []}>
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '10px' }} />
              <Area type="monotone" dataKey="activePower" stroke="#007a78" fill="#007a78" fillOpacity={0.2} name="Active Power (kW)" />
              <Area type="monotone" dataKey="generatorTemp" stroke="#0284c7" fill="#0284c7" fillOpacity={0.1} name="Gen Temp (°C)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
