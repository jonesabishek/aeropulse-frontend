import React, { useState } from 'react';
import { CloudLightning, Wind, Thermometer, X, RefreshCw } from 'lucide-react';

export default function WeatherSandboxModal({ isOpen, onClose, onUpdateWeather }) {
  const [windOffset, setWindOffset] = useState(0);
  const [tempOffset, setTempOffset] = useState(0);

  if (!isOpen) return null;

  const handleApply = (wind, temp) => {
    const w = typeof wind === 'number' ? wind : Number(windOffset);
    const t = typeof temp === 'number' ? temp : Number(tempOffset);
    setWindOffset(w);
    setTempOffset(t);
    onUpdateWeather(w, t);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CloudLightning className="w-6 h-6 text-[#007a78]" />
            <div>
              <h3 className="text-lg font-bold text-[#0f172a]">Weather & Stress Simulator Sandbox</h3>
              <p className="text-xs text-slate-500">Inject real-time weather anomalies across all wind turbine farms</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-4 text-xs">
          
          {/* Wind Speed Modifier */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-[#007a78]" />
                Global Wind Velocity Modifier
              </span>
              <strong className="text-[#007a78] font-mono text-sm">
                {windOffset > 0 ? `+${windOffset}` : windOffset} m/s
              </strong>
            </div>
            <input
              type="range"
              min="-8"
              max="15"
              step="1"
              value={windOffset}
              onChange={(e) => setWindOffset(Number(e.target.value))}
              className="w-full accent-[#007a78] bg-slate-200 cursor-pointer h-2 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Calm Wind (-8 m/s)</span>
              <span>Nominal (0)</span>
              <span>Gale Storm (+15 m/s)</span>
            </div>
          </div>

          {/* Temperature Modifier */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-[#0284c7]" />
                Ambient Temperature Offset
              </span>
              <strong className="text-[#0284c7] font-mono text-sm">
                {tempOffset > 0 ? `+${tempOffset}` : tempOffset} °C
              </strong>
            </div>
            <input
              type="range"
              min="-15"
              max="20"
              step="1"
              value={tempOffset}
              onChange={(e) => setTempOffset(Number(e.target.value))}
              className="w-full accent-[#0284c7] bg-slate-200 cursor-pointer h-2 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Freezing (-15 °C)</span>
              <span>Nominal (0)</span>
              <span>Heat Wave (+20 °C)</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="block text-slate-700 font-semibold mb-2">Instant Scenario Presets:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleApply(0, 0)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-left font-semibold border border-slate-200 transition-all flex items-center justify-between"
              >
                <span>🌤 Nominal Breeze</span>
                <span className="text-[10px] text-slate-400">Default</span>
              </button>

              <button
                onClick={() => handleApply(14, 2)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-left font-semibold border border-slate-200 transition-all flex items-center justify-between"
              >
                <span>⚡ Gale Storm (26+ m/s)</span>
                <span className="text-[10px] text-rose-600 font-bold">Cut-out test</span>
              </button>

              <button
                onClick={() => handleApply(2, 18)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-left font-semibold border border-slate-200 transition-all flex items-center justify-between"
              >
                <span>🔥 Extreme Heatwave</span>
                <span className="text-[10px] text-amber-600 font-bold">Overheat</span>
              </button>

              <button
                onClick={() => handleApply(-7, -5)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-left font-semibold border border-slate-200 transition-all flex items-center justify-between"
              >
                <span>❄ Low Wind Freeze</span>
                <span className="text-[10px] text-sky-600 font-bold">Idle state</span>
              </button>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={() => handleApply(0, 0)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 border border-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={() => { handleApply(windOffset, tempOffset); onClose(); }}
            className="px-4 py-2 rounded-xl bg-[#007a78] hover:bg-[#006361] text-white font-semibold text-xs shadow-xs"
          >
            Apply Environmental Simulation
          </button>
        </div>

      </div>
    </div>
  );
}
