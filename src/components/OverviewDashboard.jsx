import React from 'react';
import { 
  Zap, 
  Wind, 
  Activity, 
  ShieldCheck, 
  DollarSign, 
  Leaf, 
  AlertOctagon, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  TrendingUp, 
  Sparkles,
  Database
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function OverviewDashboard({ 
  summary, 
  turbines, 
  alerts, 
  dbStatus,
  onSelectTurbine, 
  onResolveAlert, 
  onCreateWorkOrder, 
  historyData 
}) {
  const { 
    totalPowerMW = '0.00', 
    totalCapacityMW = '0.0', 
    capacityFactor = '0.0', 
    activeTurbines = 0, 
    totalTurbines = 0, 
    averageHealthScore = 0, 
    averageWindSpeed = '0.0',
    co2OffsetTons = 0,
    dailyRevenueUSD = 0
  } = summary || {};

  // Pie chart health breakdown data (Clean Enterprise Theme)
  const healthDistribution = [
    { name: 'Optimal', value: turbines.filter(t => t.status === 'OPTIMAL' || t.status === 'RUNNING').length, color: '#059669' },
    { name: 'Warning', value: turbines.filter(t => t.status === 'WARNING').length, color: '#d97706' },
    { name: 'Critical', value: turbines.filter(t => t.status === 'CRITICAL').length, color: '#ef4444' },
    { name: 'Maintenance', value: turbines.filter(t => t.status === 'MAINTENANCE').length, color: '#0284c7' }
  ].filter(d => d.value > 0);

  // Default mock history for power chart if waiting for live buffer
  const sampleChartData = historyData && historyData.length > 0 ? historyData : [
    { time: '10:00', power: 2100, wind: 10.2 },
    { time: '10:15', power: 2350, wind: 10.8 },
    { time: '10:30', power: 2800, wind: 11.5 },
    { time: '10:45', power: 3100, wind: 12.1 },
    { time: '11:00', power: 2950, wind: 11.8 },
    { time: '11:15', power: 3200, wind: 12.4 }
  ];

  return (
    <div className="space-y-6">
      
      {/* MongoDB Database State Engine Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/90 text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#e6f9f0] text-[#059669] border border-[#a7f3d0]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0f172a] text-sm">MongoDB Enterprise Persistence</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#e6f9f0] text-[#059669] border border-[#a7f3d0]">
                ACTIVE • {dbStatus?.dbName || 'aeropulse_wind'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Host: <span className="font-mono text-[#007a78]">{dbStatus?.host || '127.0.0.1:27017'}</span> • Schemas: Turbines, Alerts, WorkOrders, TelemetryHistory
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-700">
          <div className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500">Turbines:</span> <strong className="text-[#0f172a]">{dbStatus?.collections?.turbines || turbines.length || 8}</strong>
          </div>
          <div className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500">Alerts:</span> <strong className="text-[#ef4444]">{dbStatus?.collections?.alerts || alerts.length}</strong>
          </div>
          <div className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500">Work Orders:</span> <strong className="text-[#0284c7]">{dbStatus?.collections?.workOrders || 3}</strong>
          </div>
          <div className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500">Snapshots:</span> <strong className="text-[#059669]">{dbStatus?.collections?.telemetryHistory || '200+'}</strong>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Power Generation */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Grid Output</span>
            <div className="p-2 rounded-xl bg-[#e6f7f6] text-[#007a78] border border-[#a5f3fc]">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold text-[#0f172a] font-mono">{totalPowerMW}</h2>
              <span className="text-sm font-semibold text-slate-400">/ {totalCapacityMW} MW</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
              <span>Capacity Factor: <strong className="text-[#007a78] font-mono">{capacityFactor}%</strong></span>
              <span className="text-[#059669] font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +4.2% today
              </span>
            </div>
          </div>
        </div>

        {/* Fleet Health Index */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fleet Health</span>
            <div className="p-2 rounded-xl bg-[#e6f9f0] text-[#059669] border border-[#a7f3d0]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold text-[#059669] font-mono">{averageHealthScore}%</h2>
              <span className="text-sm font-semibold text-slate-500">Overall</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
              <span>Operational: <strong className="text-[#0f172a] font-mono">{activeTurbines} / {totalTurbines}</strong></span>
              <span>Avg Wind: <strong className="text-[#007a78] font-mono">{averageWindSpeed} m/s</strong></span>
            </div>
          </div>
        </div>

        {/* Financial & Daily Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Projected Revenue</span>
            <div className="p-2 rounded-xl bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold text-[#0f172a] font-mono">${(dailyRevenueUSD).toLocaleString()}</h2>
              <span className="text-xs text-slate-400">/ day</span>
            </div>
            <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
              <span>Base Tariff: <strong className="text-slate-800 font-mono">$65/MWh</strong></span>
            </div>
          </div>
        </div>

        {/* Environmental Carbon Offset */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CO₂ Avoided</span>
            <div className="p-2 rounded-xl bg-[#e6f9f0] text-[#059669] border border-[#a7f3d0]">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold text-[#059669] font-mono">{co2OffsetTons.toLocaleString()}</h2>
              <span className="text-xs font-semibold text-slate-500">Tons</span>
            </div>
            <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
              <span>Equivalent to <strong className="text-[#059669]">{(co2OffsetTons * 45).toLocaleString()} trees</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Charts & Live Telemetry Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Power Generation Graph */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#007a78]" />
                Live Power Output & Wind Speed Telemetry
              </h3>
              <p className="text-xs text-slate-500">Streaming real-time grid generation dynamics (kW)</p>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e6f7f6] text-[#007a78] border border-[#a5f3fc] text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#007a78] animate-ping"></span>
              Live Feed
            </span>
          </div>

          {/* Recharts Clean Teal & Blue Area Chart */}
          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleChartData}>
                <defs>
                  <linearGradient id="powerGradTeal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007a78" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#007a78" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit=" kW" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '10px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#007a78' }}
                />
                <Area type="monotone" dataKey="power" stroke="#007a78" strokeWidth={2.5} fillOpacity={1} fill="url(#powerGradTeal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Status Donut Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-[#007a78]" />
              Turbine Fleet Health Breakdown
            </h3>

            <div className="relative h-44 my-2 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {healthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-[#0f172a] font-mono">{turbines.length}</span>
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Total Units</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {healthDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 font-medium">{item.name}:</span>
                  <strong className="text-[#0f172a] ml-auto font-mono">{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Real-time Alerts Feed & Predictive Recommendations */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
            <h3 className="text-base font-bold text-[#0f172a]">Active Predictive Maintenance Alerts</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-mono font-semibold border border-rose-200">
              {alerts.filter(a => a.status === 'ACTIVE').length} Active
            </span>
          </div>
        </div>

        {alerts.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm">
            <CheckCircle2 className="w-8 h-8 text-[#059669] mx-auto mb-2" />
            All turbines operating smoothly within nominal mechanical thresholds.
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 4).map((alert) => (
              <div 
                key={alert.id || alert._id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  alert.severity === 'CRITICAL' 
                    ? 'bg-rose-50/70 border-rose-200' 
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0f172a] text-sm">{alert.turbineName} ({alert.turbineId})</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        alert.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-0.5">{alert.message}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 font-mono">
                      <span>Value: <strong className="text-slate-800">{alert.value}</strong></span>
                      <span>Threshold: {alert.threshold}</span>
                      <span>Time: {new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => onCreateWorkOrder(alert)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#007a78] hover:bg-[#006361] text-white shadow-sm"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Create Work Order</span>
                  </button>
                  <button
                    onClick={() => onResolveAlert(alert.id || alert._id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
