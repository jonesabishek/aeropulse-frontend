import React, { useState } from 'react';
import { Play, Pause, AlertTriangle, ShieldAlert, RotateCw, Gauge, Zap, Thermometer, Activity } from 'lucide-react';

export default function Turbine3DCanvas({ turbine, onControlAction }) {
  const [selectedComponent, setSelectedComponent] = useState(null);

  if (!turbine) {
    return (
      <div className="flex items-center justify-center h-80 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-400 text-sm">Select a turbine to view real-time 3D schematic</p>
      </div>
    );
  }

  const { telemetry, status, controlMode, healthScore, name, turbineId } = turbine;
  const rpm = telemetry?.rotorSpeed || 0;
  const windSpeed = telemetry?.windSpeed || 0;
  const activePower = telemetry?.activePower || 0;
  const genTemp = telemetry?.generatorTemp || 0;
  const vibration = telemetry?.gearboxVibration || 0;

  // Compute spin duration in seconds based on RPM
  const spinDuration = rpm > 0 ? Math.max(0.4, (60 / Math.max(1, rpm)).toFixed(2)) : 0;
  const isStopped = rpm === 0 || controlMode === 'EMERGENCY_STOP' || controlMode === 'MAINTENANCE_LOCK';

  // Nacelle color based on status/temp in Clean Enterprise Theme
  let nacelleColor = '#007a78'; // Teal
  if (genTemp > 85 || vibration > 4.5 || status === 'CRITICAL') {
    nacelleColor = '#ef4444'; // Red
  } else if (genTemp > 75 || vibration > 3.0 || status === 'WARNING') {
    nacelleColor = '#f59e0b'; // Amber
  } else if (status === 'MAINTENANCE') {
    nacelleColor = '#0284c7'; // Blue
  }

  const componentsData = {
    rotor: {
      title: 'Rotor & Hub Assembly',
      status: 'Optimal',
      details: `Rotor Speed: ${rpm} RPM • Pitch Angle: ${telemetry.pitchAngle}°`,
      health: '98%',
      description: 'Aerodynamic rotor hub holding 3 composite polymer blades. Converts wind kinetic energy to torque.'
    },
    gearbox: {
      title: 'Planetary Gearbox Assembly',
      status: vibration > 4.0 ? 'Critical Wear' : vibration > 2.5 ? 'Moderate Stress' : 'Optimal',
      details: `Vibration: ${vibration} mm/s • Oil Pressure: ${telemetry.oilPressure} bar`,
      health: `${healthScore}%`,
      description: 'Multi-stage planetary gear system stepping up 15 RPM rotor speed to 1500 RPM generator input speed.'
    },
    generator: {
      title: 'Permanent Magnet Synchronous Generator',
      status: genTemp > 85 ? 'Overheating Warning' : 'Optimal',
      details: `Stator Temp: ${genTemp}°C • Output: ${activePower} kW`,
      health: genTemp > 85 ? '72%' : '96%',
      description: 'High-efficiency 3-phase AC generator converting rotational mechanical torque to electrical power.'
    },
    yaw: {
      title: 'Yaw Drive & Anemometer System',
      status: 'Active Tracking',
      details: `Yaw Heading: ${telemetry.yawAngle}° • Wind: ${windSpeed} m/s`,
      health: '99%',
      description: 'Electric motors orienting nacelle directly into wind direction for maximum aerodynamic efficiency.'
    }
  };

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200/90 p-5 overflow-hidden flex flex-col justify-between shadow-xs">
      
      {/* Header Info Bar */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#0f172a]">{name}</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#e6f7f6] text-[#007a78] border border-[#a5f3fc]">
              {turbineId}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive Telemetry Visualizer & Control Matrix
          </p>
        </div>

        {/* Live Badges */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
            status === 'OPTIMAL' || status === 'RUNNING' ? 'bg-[#e6f9f0] text-[#059669] border-[#a7f3d0]' :
            status === 'WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            status === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
            'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            {status}
          </span>
          <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-slate-50 text-[#007a78] border border-slate-200">
            {activePower} kW
          </span>
        </div>
      </div>

      {/* Interactive Wind Turbine Graphic Section */}
      <div className="relative z-10 my-4 flex flex-col md:flex-row items-center justify-center gap-6 min-h-[320px]">
        
        {/* SVG Turbine Schematic */}
        <div className="relative w-64 h-72 flex items-center justify-center">
          <svg className="w-full h-full drop-shadow-xs" viewBox="0 0 300 350">
            <defs>
              <linearGradient id="towerGradEnterprise" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="50%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
              <linearGradient id="bladeGradEnterprise" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#99f6e4" />
              </linearGradient>
            </defs>

            {/* Ground / Foundation */}
            <ellipse cx="150" cy="330" rx="90" ry="12" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />

            {/* Turbine Tower */}
            <polygon points="142,120 158,120 166,325 134,325" fill="url(#towerGradEnterprise)" stroke="#334155" strokeWidth="1" />
            
            {/* Tower Ladder */}
            <line x1="150" y1="130" x2="150" y2="320" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="2" />

            {/* Nacelle Main Body */}
            <rect 
              x="120" y="105" width="60" height="30" rx="6" 
              fill={nacelleColor} 
              stroke="#0f766e" 
              strokeWidth="1.5"
              className="cursor-pointer transition-all hover:filter hover:brightness-110"
              onClick={() => setSelectedComponent('generator')}
            />
            {/* Anemometer Sensor */}
            <line x1="165" y1="105" x2="165" y2="92" stroke="#007a78" strokeWidth="2" />
            <circle cx="165" cy="90" r="4" fill="#007a78" className={isStopped ? '' : 'animate-ping'} />

            {/* Planetary Gearbox Internal Highlight */}
            <rect 
              x="135" y="110" width="18" height="20" rx="2" 
              fill="#0f172a" 
              stroke="#0d9488" 
              strokeWidth="1"
              className="cursor-pointer hover:fill-slate-800"
              onClick={() => setSelectedComponent('gearbox')}
            />

            {/* Rotor Hub Circle */}
            <circle 
              cx="120" cy="120" r="12" 
              fill="#0f172a" 
              stroke="#007a78" 
              strokeWidth="2.5"
              className="cursor-pointer"
              onClick={() => setSelectedComponent('rotor')}
            />

            {/* Spinning Rotor Blades Group */}
            <g 
              transform="translate(120, 120)" 
              className={isStopped ? '' : 'animate-spin-turbine'}
              style={{ '--spin-duration': `${spinDuration}s` }}
            >
              {/* Blade 1 */}
              <g transform="rotate(0)">
                <path d="M-4,0 C-6,-40 -2,-70 0,-95 C2,-70 6,-40 4,0 Z" fill="url(#bladeGradEnterprise)" stroke="#0d9488" strokeWidth="0.8" />
                <circle cx="0" cy="-90" r="2.5" fill="#007a78" />
              </g>

              {/* Blade 2 */}
              <g transform="rotate(120)">
                <path d="M-4,0 C-6,-40 -2,-70 0,-95 C2,-70 6,-40 4,0 Z" fill="url(#bladeGradEnterprise)" stroke="#0d9488" strokeWidth="0.8" />
                <circle cx="0" cy="-90" r="2.5" fill="#007a78" />
              </g>

              {/* Blade 3 */}
              <g transform="rotate(240)">
                <path d="M-4,0 C-6,-40 -2,-70 0,-95 C2,-70 6,-40 4,0 Z" fill="url(#bladeGradEnterprise)" stroke="#0d9488" strokeWidth="0.8" />
                <circle cx="0" cy="-90" r="2.5" fill="#007a78" />
              </g>

              {/* Center Nose Cone */}
              <circle cx="0" cy="0" r="6" fill="#007a78" />
            </g>
          </svg>
        </div>

        {/* Live Gauges & Component Inspector Panel */}
        <div className="flex-1 w-full flex flex-col gap-3">
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Gauge className="w-3.5 h-3.5 text-[#007a78]" />
                <span>Rotor Speed</span>
              </div>
              <p className="text-lg font-bold text-[#0f172a] mt-1 font-mono">{rpm} <span className="text-xs text-slate-400 font-normal">RPM</span></p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Thermometer className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>Generator Temp</span>
              </div>
              <p className={`text-lg font-bold mt-1 font-mono ${genTemp > 85 ? 'text-rose-600' : genTemp > 75 ? 'text-amber-600' : 'text-[#007a78]'}`}>
                {genTemp} <span className="text-xs text-slate-400 font-normal">°C</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Activity className="w-3.5 h-3.5 text-[#059669]" />
                <span>Gearbox Vibration</span>
              </div>
              <p className={`text-lg font-bold mt-1 font-mono ${vibration > 4.5 ? 'text-rose-600' : vibration > 2.8 ? 'text-amber-600' : 'text-[#007a78]'}`}>
                {vibration} <span className="text-xs text-slate-400 font-normal">mm/s</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Zap className="w-3.5 h-3.5 text-[#007a78]" />
                <span>Pitch Angle</span>
              </div>
              <p className="text-lg font-bold text-[#0f172a] mt-1 font-mono">{telemetry.pitchAngle} <span className="text-xs text-slate-400 font-normal">deg</span></p>
            </div>
          </div>

          {/* Component Detail Interactive Overlay */}
          {selectedComponent && (
            <div className="p-3 rounded-xl bg-[#e6f7f6] border border-[#a5f3fc] text-xs text-slate-800 animate-fadeIn">
              <div className="flex items-center justify-between font-bold text-[#007a78] mb-1">
                <span>{componentsData[selectedComponent].title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#007a78] border border-[#a5f3fc]">
                  {componentsData[selectedComponent].status}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] mb-1">{componentsData[selectedComponent].description}</p>
              <p className="text-[#007a78] font-mono text-[11px]">{componentsData[selectedComponent].details}</p>
            </div>
          )}

          {!selectedComponent && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs italic flex items-center justify-between">
              <span>💡 Click on rotor, gearbox, or nacelle to inspect sub-systems.</span>
              <span className="text-[#007a78] not-italic font-medium">Click components</span>
            </div>
          )}

        </div>

      </div>

      {/* Footer Remote Control Buttons */}
      <div className="relative z-10 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Control State:</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {controlMode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {controlMode === 'EMERGENCY_STOP' ? (
            <button
              onClick={() => onControlAction(turbineId, 'RESUME_AUTO')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#007a78] hover:bg-[#006361] text-white shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume Auto Operation</span>
            </button>
          ) : (
            <button
              onClick={() => onControlAction(turbineId, 'EMERGENCY_BRAKE')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-xs"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Emergency Pitch Brake</span>
            </button>
          )}

          <button
            onClick={() => onControlAction(turbineId, 'SET_PITCH', { pitchAngle: 45 })}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
          >
            Feather Blade (45°)
          </button>
        </div>

      </div>

    </div>
  );
}
