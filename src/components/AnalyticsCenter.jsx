import React from 'react';
import { TrendingUp, Zap, MapPin, Leaf, ShieldCheck, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AnalyticsCenter({ powerCurveData, turbines, summary }) {
  // Farm yield aggregation dynamically from live turbines
  const zephyrTurbines = turbines.filter(t => t.farmLocation?.includes('Zephyr'));
  const ridgeTurbines = turbines.filter(t => t.farmLocation?.includes('High Desert') || t.farmLocation?.includes('Ridge'));
  const offshoreTurbines = turbines.filter(t => t.farmLocation?.includes('Offshore') || t.farmLocation?.includes('Boreas'));

  const farmYieldData = [
    {
      farm: 'Zephyr Valley (Onshore)',
      turbinesCount: zephyrTurbines.length || 4,
      currentPowerKW: Math.round(zephyrTurbines.reduce((a, b) => a + (b.telemetry?.activePower || 2800), 0)),
      avgHealth: Math.round(zephyrTurbines.reduce((a, b) => a + (b.healthScore || 90), 0) / Math.max(1, zephyrTurbines.length)) || 91
    },
    {
      farm: 'High Desert Ridge (Altitude)',
      turbinesCount: ridgeTurbines.length || 4,
      currentPowerKW: Math.round(ridgeTurbines.reduce((a, b) => a + (b.telemetry?.activePower || 2600), 0)),
      avgHealth: Math.round(ridgeTurbines.reduce((a, b) => a + (b.healthScore || 85), 0) / Math.max(1, ridgeTurbines.length)) || 76
    },
    {
      farm: 'Offshore Boreas Bay (Deepwater)',
      turbinesCount: offshoreTurbines.length || 4,
      currentPowerKW: Math.round(offshoreTurbines.reduce((a, b) => a + (b.telemetry?.activePower || 4800), 0)),
      avgHealth: Math.round(offshoreTurbines.reduce((a, b) => a + (b.healthScore || 95), 0) / Math.max(1, offshoreTurbines.length)) || 92
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#007a78]" />
          Power Generation Analytics & Theoretical Curve Modeling
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Compare theoretical power curves across 3.5MW, 4.2MW, and 5.0MW turbines against live wind farm yields
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Power Curve Line Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#007a78]" />
            Theoretical Power Curve (kW vs Wind Speed m/s)
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={powerCurveData || []}>
                <XAxis dataKey="windSpeed" stroke="#94a3b8" fontSize={11} label={{ value: 'Wind Speed (m/s)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kW" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '10px' }} />
                <Line type="monotone" dataKey="theoretical3_5" stroke="#007a78" strokeWidth={2.5} name="AeroVane 3.5MW" dot={false} />
                <Line type="monotone" dataKey="theoretical4_2" stroke="#0284c7" strokeWidth={2.5} name="VortexX 4.2MW" dot={false} />
                <Line type="monotone" dataKey="theoretical5_0" stroke="#059669" strokeWidth={2.5} name="Poseidon 5.0MW" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Farm Yield Comparison Bar Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#0284c7]" />
            Active Power Yield by Wind Farm (kW)
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={farmYieldData}>
                <XAxis dataKey="farm" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kW" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '10px' }} />
                <Bar dataKey="currentPowerKW" fill="#007a78" radius={[8, 8, 0, 0]} name="Active Output (kW)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
