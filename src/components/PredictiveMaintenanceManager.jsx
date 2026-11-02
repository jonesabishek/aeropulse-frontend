import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import axios from 'axios';
import { 
  Wrench, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  DollarSign, 
  Sparkles, 
  Check, 
  X, 
  Calendar, 
  ArrowUpRight,
  TrendingDown,
  Layers
} from 'lucide-react';

const API_BASE = '/api';

export default function PredictiveMaintenanceManager({ workOrders, turbines, onCreateWorkOrder, onUpdateWorkOrder }) {
  const [activeTab, setActiveTab] = useState('board'); // 'board' | 'recommendations'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTurbineId, setSelectedTurbineId] = useState(turbines[0]?.turbineId || 'T-101');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [technician, setTechnician] = useState('Marcus Vance (Lead Specialist)');
  const [cost, setCost] = useState(3500);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Fetch AI Recommendations
  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const res = await axios.get(`${API_BASE}/maintenance/recommendations`);
      if (res.data.success) {
        setRecommendations(res.data.recommendations);
      }
    } catch (err) {
      const dynamicRecs = turbines
        .filter(t => (t.healthScore || 100) < 90 || Number(t.telemetry?.gearboxVibration || t.vibration || 0) > 3.0 || Number(t.telemetry?.generatorTemp || t.temperature || 0) > 75)
        .map(t => {
          const vib = Number(t.telemetry?.gearboxVibration || t.vibration || 1.4);
          const temp = Number(t.telemetry?.generatorTemp || t.temperature || 60);
          return {
            turbineId: t.turbineId,
            turbineName: t.name,
            healthScore: t.healthScore || 90,
            rulHours: Math.max(24, Math.round((t.healthScore || 90) * 12)),
            priority: (t.healthScore || 90) < 60 ? 'URGENT' : (t.healthScore || 90) < 75 ? 'HIGH' : 'MEDIUM',
            recommendation: vib > 4.5 ? 'Gearbox High-Speed Shaft Bearing Replacement' :
                            temp > 80 ? 'Main Bearing Lubricant Flush & Coolant Overhaul' :
                            'Proactive Pitch Actuator Alignment & Blade Calibration',
            reason: `Telemetry indicates degradation. Health: ${t.healthScore || 90}%, Vibration: ${vib.toFixed(2)} mm/s.`,
            estimatedCost: (t.healthScore || 90) < 60 ? 8500 : 3500,
            technicianSuggestion: 'Dr. Sarah Connor (Lead Specialist)'
          };
        });
      setRecommendations(dynamicRecs);
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [turbines]);

  const handleOpenScheduleModalWithRec = (rec) => {
    setSelectedTurbineId(rec.turbineId);
    setTitle(rec.recommendation);
    setDescription(`Predictive maintenance triggered by AI RUL degradation engine. ${rec.reason}`);
    setPriority(rec.priority || 'HIGH');
    setCost(rec.estimatedCost || 4500);
    setTechnician(rec.technicianSuggestion || 'Marcus Vance (Vibration Specialist)');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onCreateWorkOrder({
      turbineId: selectedTurbineId,
      title: title || 'Scheduled System Overhaul',
      description: description || 'Proactive inspection based on predictive health degradation curve.',
      priority,
      technician,
      estimatedCost: Number(cost)
    });
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setActiveTab('board');
  };

  const handleCompleteWorkOrder = (id) => {
    confetti({
      particleCount: 120,
      spread: 85,
      colors: ['#007a78', '#059669', '#0284c7', '#14b8a6', '#ffffff'],
      origin: { y: 0.6 }
    });
    onUpdateWorkOrder(id, { status: 'COMPLETED' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#007a78]" />
              Maintenance Engineer Command Console
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#e6f7f6] text-[#007a78] border border-[#a5f3fc]">
              ACTOR: MAINTENANCE ENGINEER
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            UML Actor Use Cases: View Predictive Recommendations, Schedule Maintenance, and Update Work Order Status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'board'
                  ? 'bg-white text-[#0f172a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Work Orders ({workOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'recommendations'
                  ? 'bg-white text-[#0f172a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#007a78]" />
              <span>AI Recommendations ({recommendations.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              setTitle('');
              setDescription('');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs bg-[#007a78] hover:bg-[#006361] text-white shadow-xs transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Maintenance</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: AI PREDICTIVE RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Sparkles className="w-4 h-4 text-[#007a78]" />
              <span>
                Predictive algorithms have calculated Remaining Useful Life (RUL) across the turbine fleet based on continuous accelerometer and thermal sensor streams.
              </span>
            </div>
            <button
              onClick={fetchRecommendations}
              className="text-[#007a78] hover:underline font-mono text-[11px] font-semibold"
            >
              Refresh Recommendations
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.length === 0 ? (
              <div className="col-span-3 p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-[#059669] mx-auto mb-2" />
                <p className="font-semibold text-[#0f172a]">All Turbines Operating Within Optimal Degradation Thresholds</p>
                <p className="text-xs mt-1">No urgent maintenance interventions currently required.</p>
              </div>
            ) : (
              recommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#007a78] shadow-xs transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#007a78]">{rec.turbineId}</span>
                      <h4 className="text-sm font-bold text-[#0f172a] mt-0.5">{rec.turbineName}</h4>
                    </div>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full font-mono ${
                      rec.priority === 'URGENT' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      rec.priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}>
                      {rec.priority} RISK
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Health Score:</span>
                      <span className="font-mono font-bold text-[#0f172a]">{rec.healthScore}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5 text-[#007a78]" />
                        Remaining Useful Life (RUL):
                      </span>
                      <span className="font-mono font-bold text-[#007a78]">{rec.rulHours || 120} Hours</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wide">
                      Recommended Action:
                    </span>
                    <p className="text-[#0f172a] font-medium leading-relaxed">
                      {rec.recommendation}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      {rec.reason}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] font-mono text-slate-600">
                      Est. Cost: <span className="text-[#0f172a] font-bold">${rec.estimatedCost?.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => handleOpenScheduleModalWithRec(rec)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#007a78] hover:bg-[#006361] text-white shadow-xs transition-all"
                    >
                      <span>1-Click Schedule</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: WORK ORDERS BOARD (KANBAN) */}
      {activeTab === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pending Column */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" /> Pending Approval
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {workOrders.filter(w => w.status === 'PENDING').length}
              </span>
            </div>

            <div className="space-y-3">
              {workOrders.filter(w => w.status === 'PENDING').length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">No pending work orders.</p>
              ) : (
                workOrders.filter(w => w.status === 'PENDING').map(wo => (
                  <WorkOrderCard key={wo.workOrderId} wo={wo} onComplete={handleCompleteWorkOrder} onUpdate={onUpdateWorkOrder} />
                ))
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase text-[#007a78] flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-[#007a78]" /> In Progress
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-[#e6f7f6] text-[#007a78] border border-[#a5f3fc]">
                {workOrders.filter(w => w.status === 'IN_PROGRESS').length}
              </span>
            </div>

            <div className="space-y-3">
              {workOrders.filter(w => w.status === 'IN_PROGRESS').length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">No active repairs in progress.</p>
              ) : (
                workOrders.filter(w => w.status === 'IN_PROGRESS').map(wo => (
                  <WorkOrderCard key={wo.workOrderId} wo={wo} onComplete={handleCompleteWorkOrder} onUpdate={onUpdateWorkOrder} />
                ))
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase text-[#059669] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" /> Completed & Verified
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-[#e6f9f0] text-[#059669] border border-[#a7f3d0]">
                {workOrders.filter(w => w.status === 'COMPLETED').length}
              </span>
            </div>

            <div className="space-y-3">
              {workOrders.filter(w => w.status === 'COMPLETED').length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">No completed work orders yet.</p>
              ) : (
                workOrders.filter(w => w.status === 'COMPLETED').map(wo => (
                  <WorkOrderCard key={wo.workOrderId} wo={wo} onComplete={handleCompleteWorkOrder} onUpdate={onUpdateWorkOrder} />
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Modal for Scheduling Maintenance Work Order */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#007a78]" />
                Schedule Maintenance Work Order
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Turbine</label>
                <select
                  value={selectedTurbineId}
                  onChange={(e) => setSelectedTurbineId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                >
                  {turbines.map(t => (
                    <option key={t.turbineId} value={t.turbineId}>
                      {t.name} ({t.turbineId}) - Health: {t.healthScore}%
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Work Order Title</label>
                <input
                  type="text"
                  placeholder="e.g. Gearbox Bearing Seal Replacement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#007a78]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Specialist Technician</label>
                <input
                  type="text"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Repair Description & Scope</label>
                <textarea
                  rows="3"
                  placeholder="Detailed inspection notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#007a78]"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#007a78] hover:bg-[#006361] text-white font-semibold shadow-xs"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function WorkOrderCard({ wo, onComplete, onUpdate }) {
  const { workOrderId, turbineName, turbineId, title, priority, status, technician, estimatedCost } = wo;

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-[#007a78] transition-all space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#007a78] font-bold">{workOrderId}</span>
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded font-mono ${
          priority === 'URGENT' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
          priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
          'bg-slate-200 text-slate-700'
        }`}>
          {priority}
        </span>
      </div>

      <div>
        <h4 className="font-bold text-[#0f172a] text-xs leading-snug">{title}</h4>
        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{turbineName} ({turbineId})</p>
      </div>

      <div className="space-y-1 text-[11px] text-slate-600 font-mono">
        <div className="flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-[#007a78]" />
          <span>{technician}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-[#059669]" />
          <span>Est. Cost: ${estimatedCost?.toLocaleString()}</span>
        </div>
      </div>

      {status !== 'COMPLETED' ? (
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
          {status === 'PENDING' && (
            <button
              onClick={() => onUpdate(workOrderId, { status: 'IN_PROGRESS' })}
              className="w-full py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-all"
            >
              Start Maintenance
            </button>
          )}
          {status === 'IN_PROGRESS' && (
            <button
              onClick={() => onComplete(workOrderId)}
              className="w-full py-1.5 rounded-lg text-xs font-semibold bg-[#007a78] hover:bg-[#006361] text-white shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Mark Complete & Restore Health</span>
            </button>
          )}
        </div>
      ) : (
        <div className="pt-2 border-t border-slate-200 text-[#059669] text-[11px] font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed & Health Restored</span>
        </div>
      )}
    </div>
  );
}
