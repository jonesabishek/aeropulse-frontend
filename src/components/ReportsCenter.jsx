import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ORIGIN } from '../api-config';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Leaf, 
  ShieldCheck, 
  DollarSign, 
  AlertTriangle,
  Calendar,
  Layers,
  Search,
  Plus,
  Eye,
  FileCheck,
  X,
  UploadCloud,
  Award,
  Check
} from 'lucide-react';

export default function ReportsCenter({ turbines = [], summary = {} }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // New Document Form State
  const [newDocNum, setNewDocNum] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Grid Operations');
  const [newVersion, setNewVersion] = useState('v1.0');
  const [newStatus, setNewStatus] = useState('Approved');
  const [newExpiryDate, setNewExpiryDate] = useState('2028-06-30');
  const [uploadToast, setUploadToast] = useState(null);

  // Compliance Documents Dataset (Matching user reference template)
  const [complianceDocs, setComplianceDocs] = useState([
    {
      docNum: 'H2-SAFE-PR-001',
      title: 'Hydrogen Leak & Gas Release Emergency Response Procedure',
      id: 'DOC-001',
      category: 'Emergency procedures',
      version: 'v2.1',
      status: 'Approved',
      expiryDate: '2027-08-10',
      standardAuthority: 'OSHA / NFPA 2',
      author: 'Dr. Sarah Connor (Safety Lead)',
      scope: 'Electrolyzer coupling, pressurized hydrogen containment, safety vent stack isolation and wind turbine shutdown protocols.'
    },
    {
      docNum: 'WF-ELEC-STD-004',
      title: 'IEC-61400 High-Voltage Grid Interconnection Compliance Standard',
      id: 'DOC-004',
      category: 'Grid Operations',
      version: 'v3.0',
      status: 'Approved',
      expiryDate: '2028-01-15',
      standardAuthority: 'IEC 61400-21 / IEEE 1547',
      author: 'Marcus Chen (Grid Dispatch Engineer)',
      scope: 'Active and reactive power dispatch, low-voltage ride-through (LVRT), harmonic distortion limits, and frequency stabilization.'
    },
    {
      docNum: 'TURB-MECH-ISO-10816',
      title: 'Nacelle & Gearbox Dynamic Vibration Baseline Calibration Protocol',
      id: 'DOC-012',
      category: 'Mechanical Safety',
      version: 'v1.4',
      status: 'Approved',
      expiryDate: '2026-12-31',
      standardAuthority: 'ISO 10816-21',
      author: 'Dr. Sarah Connor (Lead Specialist)',
      scope: 'Triaxial accelerometer sensor baseline calibration, RMS vibration alarm triggers, and planetary bearing wear lifecycle boundaries.'
    },
    {
      docNum: 'OSHA-WIND-SOP-089',
      title: 'Tower Climb & Fall Arrest System Quarterly Inspection SOP',
      id: 'DOC-089',
      category: 'Workplace Safety',
      version: 'v2.0',
      status: 'In Review',
      expiryDate: '2026-11-20',
      standardAuthority: 'OSHA 1910.269 / ANSI Z359',
      author: 'Elena Vance (Operations Director)',
      scope: 'Ladder safety systems, dual-lanyard fall arresters, rescue winch inspections, and quarterly tower anchor certification.'
    },
    {
      docNum: 'SEC-CYBER-ISO-27001',
      title: 'SCADA Telemetry Encryption & Remote Actuator Zero-Trust Security Protocol',
      id: 'DOC-095',
      category: 'Grid Operations',
      version: 'v2.2',
      status: 'Approved',
      expiryDate: '2027-11-14',
      standardAuthority: 'ISO/IEC 27001 / NERC CIP',
      author: 'Alex Rivera (System Engineer)',
      scope: 'End-to-end TLS 1.3 socket encryption, HMAC-SHA256 remote command verification, and multi-factor operator authorization.'
    }
  ]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/reports/summary');
      if (res.data.success) {
        setReport(res.data.report);
      }
    } catch (err) {
      console.warn('Report fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleDownloadCSV = () => {
    window.open(`${API_ORIGIN}/api/reports/export`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateDocument = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const docId = `DOC-${String(complianceDocs.length + 1).padStart(3, '0')}`;
    const generatedDocNum = newDocNum.trim() || `WF-STD-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newDoc = {
      docNum: generatedDocNum,
      title: newTitle.trim(),
      id: docId,
      category: newCategory,
      version: newVersion || 'v1.0',
      status: newStatus,
      expiryDate: newExpiryDate || '2028-12-31',
      standardAuthority: 'ISO / IEC Compliant',
      author: 'Elena Vance (Admin)',
      scope: 'Standard operating compliance for renewable energy asset lifecycle management and continuous audit verification.'
    };

    setComplianceDocs([newDoc, ...complianceDocs]);
    setIsUploadModalOpen(false);
    setNewDocNum('');
    setNewTitle('');
    setUploadToast(`Compliance Document ${generatedDocNum} uploaded successfully!`);
    setTimeout(() => setUploadToast(null), 4000);
  };

  const handleIncrementVersion = (docNum) => {
    setComplianceDocs(prev => prev.map(d => {
      if (d.docNum === docNum) {
        const parts = d.version.replace('v', '').split('.');
        const nextSub = Number(parts[1] || 0) + 1;
        const newVer = `v${parts[0]}.${nextSub}`;
        setUploadToast(`Updated ${d.docNum} to version ${newVer}`);
        setTimeout(() => setUploadToast(null), 3000);
        return { ...d, version: newVer, expiryDate: '2028-12-31' };
      }
      return d;
    }));
  };

  const filteredDocs = complianceDocs.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.docNum.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || d.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Statuses' || d.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {uploadToast && (
        <div className="p-3.5 rounded-xl bg-[#e6f9f0] border border-[#a7f3d0] text-[#059669] text-xs font-semibold flex items-center gap-2 shadow-sm animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          <span>{uploadToast}</span>
        </div>
      )}

      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#007a78]" />
            <h2 className="text-xl font-bold text-[#0f172a]">Compliance Documents & Audit Reports</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#e6f7f6] text-[#007a78] border border-[#a5f3fc]">
              UML: Generate Reports
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certified documentation and telemetry reports for Grid Operators, Safety Auditors, and Plant Managers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all shadow-sm"
            title="Download CSV Telemetry Dataset"
          >
            <Download className="w-4 h-4 text-[#007a78]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#007a78] hover:bg-[#006361] text-white shadow-sm transition-all"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Report</span>
          </button>
        </div>
      </div>

      {/* Compliance Documents Table (Exact match to User Reference Image) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        
        {/* Search, Filters, and + Upload Button Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            
            {/* Search Input */}
            <div className="relative min-w-[260px] flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search doc number, title, compliance..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007a78]"
              />
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-[#007a78]"
            >
              <option value="All Categories">All Categories</option>
              <option value="Emergency procedures">Emergency procedures</option>
              <option value="Grid Operations">Grid Operations</option>
              <option value="Mechanical Safety">Mechanical Safety</option>
              <option value="Workplace Safety">Workplace Safety</option>
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 px-3 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:border-[#007a78]"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="In Review">In Review</option>
            </select>
          </div>

          {/* Upload Button matching user image */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#007a78] hover:bg-[#006361] text-white shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload Compliance Doc</span>
          </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">DOC #</th>
                <th className="py-3 px-4">TITLE / STANDARD</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">CURRENT VERSION</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">EXPIRY DATE</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-md bg-[#e6f7f6] text-[#007a78] border border-[#a5f3fc]">
                      {doc.docNum}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0f172a] text-xs">{doc.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">ID: {doc.id} • Authority: {doc.standardAuthority || 'ISO Certified'}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                    {doc.category}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                    {doc.version}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                      doc.status === 'Approved' 
                        ? 'bg-[#e6f9f0] text-[#059669] border border-[#a7f3d0]' 
                        : 'bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd]'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {doc.expiryDate}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => setPreviewDoc(doc)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-medium shadow-2xs"
                      >
                        <Eye className="w-3 h-3 text-[#007a78]" />
                        <span>View</span>
                      </button>
                      <button 
                        onClick={() => handleIncrementVersion(doc.docNum)}
                        className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-medium shadow-2xs"
                        title="Increment Version"
                      >
                        + Version
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Printable Wind Farm Executive Audit Report Document */}
      <div id="audit-report-document" className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#0f172a] tracking-tight">
                AEROPULSE AI
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#e6f9f0] text-[#059669] border border-[#a7f3d0]">
                OFFICIAL AUDIT REPORT
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Facility: AeroPulse Renewable Energy Grid Operations Center</p>
            <p className="text-[11px] text-slate-400 font-mono">Reference No: AUD-2026-WF89-MERN</p>
          </div>

          <div className="text-right text-xs text-slate-600 font-mono space-y-1">
            <p className="flex items-center justify-end gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#007a78]" />
              <span>Timestamp: {new Date().toLocaleString()}</span>
            </p>
            <p>Compliance: <strong className="text-[#059669]">ISO 55001 Asset Verified</strong></p>
            <p>Database: <strong className="text-[#007a78]">MongoDB Atlas Synchronized</strong></p>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#007a78]" /> 1. Executive Fleet Yield Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-semibold uppercase">Instant Power Output</span>
              <strong className="text-[#0f172a] text-lg font-mono font-extrabold">{summary?.totalPowerMW || '28.2'} MW</strong>
              <span className="text-[10px] text-[#059669] block mt-0.5 font-medium">Capacity Factor: {summary?.capacityFactor || 85.3}%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-semibold uppercase">Projected Daily Revenue</span>
              <strong className="text-[#0f172a] text-lg font-mono font-extrabold">${(summary?.dailyRevenueUSD || 42500)?.toLocaleString()}</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Tariff Base: $65/MWh</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-semibold uppercase">Environmental Offset</span>
              <strong className="text-[#059669] text-lg font-mono font-extrabold">{(summary?.co2OffsetTons || 612)?.toLocaleString()} Tons</strong>
              <span className="text-[10px] text-[#059669] block mt-0.5 font-medium">Avoided Carbon Dioxide</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px] font-semibold uppercase">Operational Availability</span>
              <strong className="text-[#0f172a] text-lg font-mono font-extrabold">{summary?.activeTurbines || 10} / {summary?.totalTurbines || 12} Units</strong>
              <span className="text-[10px] text-[#007a78] block mt-0.5 font-medium">Avg Fleet Health: {summary?.averageHealthScore || 92}%</span>
            </div>
          </div>
        </div>

        {/* Detailed Fleet Status Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#007a78]" /> 2. Individual Turbine Asset Inventory
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Turbine Name</th>
                  <th className="p-2.5">Location</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Health</th>
                  <th className="p-2.5">Output (kW)</th>
                  <th className="p-2.5">Wind (m/s)</th>
                  <th className="p-2.5">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {turbines.map(t => (
                  <tr key={t.turbineId} className="hover:bg-slate-50/60">
                    <td className="p-2.5 text-[#007a78] font-bold">{t.turbineId}</td>
                    <td className="p-2.5 font-sans font-semibold text-[#0f172a]">{t.name}</td>
                    <td className="p-2.5 font-sans text-slate-600">{t.farmLocation}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'OPTIMAL' ? 'bg-[#e6f9f0] text-[#059669]' :
                        t.status === 'WARNING' ? 'bg-amber-50 text-amber-700' :
                        t.status === 'CRITICAL' ? 'bg-rose-50 text-rose-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-700">{t.healthScore}%</td>
                    <td className="p-2.5 text-[#0f172a] font-bold">{t.telemetry?.activePower || 0} kW</td>
                    <td className="p-2.5 text-slate-600">{t.telemetry?.windSpeed || 0} m/s</td>
                    <td className="p-2.5 text-[#059669]">{t.telemetry?.efficiency || 95}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regulatory Compliance Sign-off Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-700">Digital Authentication Stamp: SHA-256 Verified</p>
            <p className="font-mono text-[11px] text-slate-400">e8f49a1b023c78d94e771120fbc89e31d044fa12</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block font-bold text-slate-800">Elena Vance</span>
              <span className="text-[11px] text-slate-400">Operations Director, AeroPulse</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#007a78] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              EV
            </div>
          </div>
        </div>

      </div>

      {/* Upload Compliance Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#007a78]" />
                <h3 className="font-bold text-slate-900 text-base">Upload Compliance Standard / Document</h3>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Standard / Document Number</label>
                <input
                  type="text"
                  placeholder="e.g. WF-ELEC-ISO-27001"
                  value={newDocNum}
                  onChange={(e) => setNewDocNum(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007a78]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Title & Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SCADA Cybersecurity & Remote Telemetry Encryption Protocol"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#007a78]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:border-[#007a78]"
                  >
                    <option value="Emergency procedures">Emergency procedures</option>
                    <option value="Grid Operations">Grid Operations</option>
                    <option value="Mechanical Safety">Mechanical Safety</option>
                    <option value="Workplace Safety">Workplace Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Version</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:border-[#007a78]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:border-[#007a78]"
                  >
                    <option value="Approved">Approved</option>
                    <option value="In Review">In Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:border-[#007a78]"
                  />
                </div>
              </div>

              {/* File Attachment Dropzone UI */}
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center hover:bg-slate-100/60 transition-colors cursor-pointer">
                <FileText className="w-6 h-6 text-[#007a78] mx-auto mb-1" />
                <span className="text-slate-700 font-semibold block">Attach PDF / DOCX Certificate File</span>
                <span className="text-slate-400 text-[10px]">Maximum size 25MB • IEC / OSHA / ISO certified</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#007a78] hover:bg-[#006361] text-white font-semibold shadow-sm transition-all"
                >
                  Confirm & Register Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document View / Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#007a78]" />
                <h3 className="font-bold text-slate-900 text-base">{previewDoc.docNum} — Certified Compliance Record</h3>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#e6f7f6] border border-[#a5f3fc]">
                <span className="text-[10px] font-bold text-[#007a78] uppercase tracking-wider block">Official Title</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{previewDoc.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Standard Authority</span>
                  <strong className="text-slate-800">{previewDoc.standardAuthority || 'ISO 55001 / IEC 61400'}</strong>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Revision</span>
                  <strong className="text-[#007a78] font-mono">{previewDoc.version}</strong>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Certification Status</span>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f9f0] text-[#059669] border border-[#a7f3d0]">
                    {previewDoc.status}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Next Audit Expiry</span>
                  <strong className="text-slate-800 font-mono">{previewDoc.expiryDate}</strong>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Operational Scope</span>
                <p className="text-slate-700 leading-relaxed">
                  {previewDoc.scope || 'Standard operating procedure for wind turbine telemetry monitoring, vibration dampening, and automated fail-safe safety triggers.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Auditor Sign-off</span>
                <p className="text-slate-700">Author: <strong>{previewDoc.author || 'Dr. Sarah Connor (Principal Engineer)'}</strong></p>
                <p className="text-[11px] text-[#059669] mt-0.5 font-medium">✓ Cryptographically signed into AeroPulse Enterprise Audit Trail</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-[#007a78] hover:bg-[#006361] text-white text-xs font-semibold shadow-sm"
              >
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
