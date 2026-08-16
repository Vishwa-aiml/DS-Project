import React, { useState } from 'react';
import { ZoneData, ExploreSubTab, MapLayerType } from '../types';
import { CHENNAI_ZONES, RISK_TREND_HISTORY } from '../data/mockData';
import { MapComponent } from './MapComponent';
import { RealLeafletMap } from './RealLeafletMap';
import { 
  Layers, 
  Clock, 
  BarChart3, 
  Users, 
  Wrench, 
  Download, 
  FileText, 
  HelpCircle, 
  BookOpen, 
  X, 
  AlertTriangle, 
  Thermometer, 
  Flame,
  Droplets, 
  Wind, 
  Trees, 
  Building, 
  ArrowUpRight, 
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info,
  MapPin,
  Satellite
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';

interface ExploreViewProps {
  selectedZone: ZoneData;
  onSelectZone: (zone: ZoneData) => void;
  onOpenReport: () => void;
  onOpenMethodology: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  selectedZone,
  onSelectZone,
  onOpenReport,
  onOpenMethodology,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ExploreSubTab>('map-layers');
  const [activeMapLayer, setActiveMapLayer] = useState<MapLayerType>('heat-risk');
  const [mapMode, setMapMode] = useState<'real' | 'hex'>('real');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [interventionApplied, setInterventionApplied] = useState<{ [key: string]: boolean }>({});

  const toggleIntervention = (key: string) => {
    setInterventionApplied((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navItems: { id: ExploreSubTab; label: string; icon: React.ElementType }[] = [
    { id: 'map-layers', label: 'Map Layers', icon: Layers },
    { id: 'time-series', label: 'Time Series', icon: Clock },
    { id: 'risk-analytics', label: 'Risk Analytics', icon: BarChart3 },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'interventions', label: 'Interventions', icon: Wrench },
    { id: 'export', label: 'Export', icon: Download },
  ];

  const mapLayerOptions: { id: MapLayerType; label: string }[] = [
    { id: 'heat-risk', label: 'Heat Risk' },
    { id: 'temperature', label: 'Temperature' },
    { id: 'lst', label: 'LST' },
    { id: 'ndvi', label: 'NDVI' },
    { id: 'population-density', label: 'Population Density' },
  ];

  return (
    <div id="explore-view" className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 pb-12 animate-in fade-in duration-300 min-h-[720px]">
      {/* Left Sidebar Navigation */}
      <aside id="explore-sidebar" className="w-full lg:w-64 shrink-0 bg-white border border-[#D5E3DB] rounded-2xl p-4 flex flex-col justify-between shadow-sm">
        <div className="space-y-6">
          {/* Sidebar Brand Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#EAF2ED]">
            <div className="w-9 h-9 rounded-lg bg-[#164E35] text-white flex items-center justify-center font-bold text-sm">
              UH
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#143624]">
                Urban Heat Index
              </div>
              <div className="text-[11px] font-mono text-[#5A7767]">
                V1.4.2-STABLE
              </div>
            </div>
          </div>

          {/* Sidebar Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-${item.id}`}
                  onClick={() => setActiveSubTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#EAF5EE] text-[#164E35] font-semibold border-l-3 border-[#1F6E43]'
                      : 'text-[#476051] hover:bg-[#F3F8F5] hover:text-[#184E32]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1F6E43]' : 'text-[#6A8576]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Zone Selector List */}
          <div className="pt-2 border-t border-[#EAF2ED]">
            <div className="text-[11px] font-bold text-[#6B8576] uppercase tracking-wider mb-2 px-1">
              Select Zone
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {CHENNAI_ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => onSelectZone(zone)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    selectedZone.id === zone.id
                      ? 'bg-[#E5F0E8] text-[#164E35] font-bold'
                      : 'text-[#3E5547] hover:bg-[#F4F9F6]'
                  }`}
                >
                  <span className="truncate">{zone.id} - {zone.name}</span>
                  <span className={`text-[10px] px-1 py-0.5 rounded font-mono ${
                    zone.riskCategory === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {zone.riskScore}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="space-y-4 pt-6 border-t border-[#EAF2ED]">
          <button
            id="sidebar-generate-report-btn"
            onClick={onOpenReport}
            className="w-full py-3 px-4 rounded-xl bg-[#164E35] hover:bg-[#113E2A] text-white font-semibold text-xs tracking-wider uppercase shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Report</span>
          </button>

          <div className="flex items-center justify-around text-xs text-[#6B8576] pt-1">
            <button
              onClick={onOpenMethodology}
              className="hover:text-[#164E35] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Methodology</span>
            </button>
            <span>·</span>
            <a
              href="mailto:support@thermalens.org"
              className="hover:text-[#164E35] transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Support</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area: Changes with subtab */}
      <main id="explore-main-content" className="flex-1 flex flex-col min-w-0">
        {/* SUBTAB 1: MAP LAYERS (Image 4.png) */}
        {activeSubTab === 'map-layers' && (
          <div className="relative flex-1 flex flex-col lg:flex-row gap-6">
            {/* Center Map Canvas */}
            <div className="flex-1 flex flex-col bg-white border border-[#D5E3DB] rounded-2xl p-4 shadow-sm relative overflow-hidden min-h-[580px]">
              {/* Floating Top Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-[#EAF2ED]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#143624]">
                      Explore Heat Risk
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#164E35] border border-emerald-200">
                      Real Map Active
                    </span>
                  </div>
                  <div className="text-xs text-[#5D7769] mt-0.5">
                    Chennai Metropolitan Area (13.0827° N, 80.2707° E) · Free High-Res Imagery
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* View Type Toggle (Real Map vs Hex Matrix) */}
                  <div className="flex bg-[#EAF2ED] p-0.5 rounded-xl border border-[#D5E3DB] text-xs font-medium">
                    <button
                      onClick={() => setMapMode('real')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        mapMode === 'real'
                          ? 'bg-[#164E35] text-white shadow-2xs'
                          : 'text-[#476051] hover:text-[#164E35]'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Real Map</span>
                    </button>
                    <button
                      onClick={() => setMapMode('hex')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        mapMode === 'hex'
                          ? 'bg-[#164E35] text-white shadow-2xs'
                          : 'text-[#476051] hover:text-[#164E35]'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Spatial Grid</span>
                    </button>
                  </div>

                  {/* Floating Map Layers Selector Filter */}
                  {mapMode === 'hex' && (
                    <div className="flex items-center gap-1 bg-[#F1F6F3] p-1 rounded-xl border border-[#D6E5DC] overflow-x-auto max-w-full">
                      {mapLayerOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setActiveMapLayer(opt.id)}
                          className={`whitespace-nowrap px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                            activeMapLayer === opt.id
                              ? 'bg-[#164E35] text-white shadow-xs font-semibold'
                              : 'text-[#476051] hover:text-[#164E35]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Map Canvas Component */}
              <div className="flex-1 w-full min-h-[460px] relative">
                {mapMode === 'real' ? (
                  <RealLeafletMap
                    zones={CHENNAI_ZONES}
                    selectedZone={selectedZone}
                    onSelectZone={(zone) => {
                      onSelectZone(zone);
                      setIsDrawerOpen(true);
                    }}
                    activeLayer={activeMapLayer}
                    onLayerChange={setActiveMapLayer}
                  />
                ) : (
                  <MapComponent
                    selectedZone={selectedZone}
                    onSelectZone={(zone) => {
                      onSelectZone(zone);
                      setIsDrawerOpen(true);
                    }}
                    activeLayer={activeMapLayer}
                  />
                )}
              </div>
            </div>

            {/* Right Side Drawer / Zone Inspector Card (Image 4.png) */}
            {isDrawerOpen && (
              <aside
                id="zone-inspector-drawer"
                className="w-full lg:w-80 shrink-0 bg-white border border-[#D5E3DB] rounded-2xl p-5 shadow-sm space-y-5 animate-in slide-in-from-right-4 duration-200"
              >
                {/* Drawer Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#EAF2ED]">
                  <div>
                    <div className="text-lg font-extrabold text-[#143624]">
                      Zone {selectedZone.id}
                    </div>
                    <div className="text-xs font-medium text-[#5D7769]">
                      {selectedZone.name}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 rounded-lg text-[#6B8576] hover:bg-[#F1F6F3] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Critical Heat Alert Banner */}
                {selectedZone.riskCategory === 'Critical' && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-red-700">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Critical Heat Alert</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-red-700 font-normal">
                      {selectedZone.alertText || 'Sustained LST > 45°C detected. Immediate intervention recommended for outdoor workers.'}
                    </p>
                  </div>
                )}

                {/* Current Conditions 4-Grid */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#6B8576] uppercase tracking-wider">
                    Current Conditions
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-3">
                      <div className="text-[11px] text-[#6B8576] flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-slate-500" />
                        Air Temp
                      </div>
                      <div className="text-lg font-bold text-[#1F2937] font-mono-data mt-0.5">
                        {selectedZone.airTemp} °C
                      </div>
                    </div>

                    <div className="bg-[#FEF2F2] border border-red-200 rounded-xl p-3">
                      <div className="text-[11px] text-red-600 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-red-600" />
                        LST
                      </div>
                      <div className="text-lg font-bold text-red-600 font-mono-data mt-0.5">
                        {selectedZone.lstTemp} °C
                      </div>
                    </div>

                    <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-3">
                      <div className="text-[11px] text-[#6B8576] flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        Humidity
                      </div>
                      <div className="text-lg font-bold text-[#1F2937] font-mono-data mt-0.5">
                        {selectedZone.humidity} %
                      </div>
                    </div>

                    <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-3">
                      <div className="text-[11px] text-[#6B8576] flex items-center gap-1">
                        <Wind className="w-3 h-3 text-teal-600" />
                        Wind
                      </div>
                      <div className="text-lg font-bold text-[#1F2937] font-mono-data mt-0.5">
                        {selectedZone.windSpeed} m/s
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vulnerability Index Breakdown */}
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-bold text-[#6B8576] uppercase tracking-wider">
                    Vulnerability Index
                  </div>

                  {/* Overall Risk Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#273F30]">Overall Risk</span>
                      <span className="font-bold text-red-600 font-mono-data">
                        {selectedZone.riskScore}/100
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 rounded-full"
                        style={{ width: `${selectedZone.riskScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-[#476051] pt-1">
                    <div className="flex items-center justify-between py-1 border-b border-[#F0F5F2]">
                      <span>Demographic Risk</span>
                      <span className="font-semibold text-[#183E2B]">High ({selectedZone.demographicRisk})</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#F0F5F2]">
                      <span>Infrastructure Index</span>
                      <span className="font-semibold text-red-700">Poor ({selectedZone.infrastructureIndex})</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#F0F5F2]">
                      <span>Green Cover</span>
                      <span className="font-semibold text-red-700">&lt; {selectedZone.greenCoverPct}%</span>
                    </div>
                  </div>
                </div>

                {/* View Detailed Report Button */}
                <button
                  id="drawer-detailed-report-btn"
                  onClick={() => setActiveSubTab('risk-analytics')}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#BACFC2] hover:bg-[#EAF5EE] text-[#164E35] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Detailed Zone Analytics</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </aside>
            )}
          </div>
        )}

        {/* SUBTAB 2: RISK ANALYTICS (Image 6.png) */}
        {activeSubTab === 'risk-analytics' && (
          <div id="risk-analytics-container" className="space-y-6">
            {/* Zone Intelligence Header Banner */}
            <div className="bg-white border border-[#D5E3DB] rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#143624]">
                  Zone Intelligence
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-2xl font-extrabold text-[#11291D]">
                    ZONE {selectedZone.id}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-bold">
                    CRITICAL RISK
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 bg-[#F5FAF7] border border-[#D5E6DC] rounded-xl px-4 py-2">
                <span className="text-2xl font-black text-[#14432A] font-mono-data">
                  {selectedZone.riskScore}/100
                </span>
                <span className="text-xs font-semibold text-[#5A7767] uppercase">
                  Composite Risk Score
                </span>
              </div>
            </div>

            {/* Analytics Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Card 1: Risk Trend Analysis (Line Chart) */}
              <div className="lg:col-span-8 bg-white border border-[#D5E3DB] rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#143624] uppercase tracking-wider">
                    Risk Trend Analysis
                  </h3>
                  <span className="text-xs text-[#5D7769] font-medium">October 2023 · 30-Day Evaluation</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={RISK_TREND_HISTORY}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEF5F0" />
                      <XAxis dataKey="date" stroke="#889C90" fontSize={11} />
                      <YAxis domain={[40, 100]} stroke="#889C90" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#D5E3DB',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <ReferenceLine y={80} label="Critical Risk (80)" stroke="#DC2626" strokeDasharray="3 3" />
                      <Line
                        type="monotone"
                        dataKey="risk"
                        name="Composite Heat Risk"
                        stroke="#164E35"
                        strokeWidth={3}
                        dot={{ fill: '#164E35', r: 4 }}
                        activeDot={{ r: 6, fill: '#DC2626' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="lst"
                        name="Land Surface Temp (°C)"
                        stroke="#EA580C"
                        strokeWidth={2}
                        strokeDasharray="4 2"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Card 2: Risk Contributors (Breakdown) */}
              <div className="lg:col-span-4 bg-white border border-[#D5E3DB] rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-[#143624] uppercase tracking-wider">
                  Risk Contributors
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between font-medium text-[#2C4435] mb-1">
                      <span>Land Surface Temp</span>
                      <span className="font-bold text-red-600">{selectedZone.contributors.lst}%</span>
                    </div>
                    <div className="h-2 bg-[#F1F6F3] rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 rounded-full" style={{ width: `${selectedZone.contributors.lst * 2.5}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-[#2C4435] mb-1">
                      <span>Humidity Index</span>
                      <span className="font-bold text-blue-600">{selectedZone.contributors.humidity}%</span>
                    </div>
                    <div className="h-2 bg-[#F1F6F3] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selectedZone.contributors.humidity * 2.5}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-[#2C4435] mb-1">
                      <span>Albedo Deficiency</span>
                      <span className="font-bold text-amber-600">{selectedZone.contributors.albedoDeficiency}%</span>
                    </div>
                    <div className="h-2 bg-[#F1F6F3] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-600 rounded-full" style={{ width: `${selectedZone.contributors.albedoDeficiency * 2.5}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-[#2C4435] mb-1">
                      <span>Vegetation Lack</span>
                      <span className="font-bold text-emerald-700">{selectedZone.contributors.vegetationLack}%</span>
                    </div>
                    <div className="h-2 bg-[#F1F6F3] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${selectedZone.contributors.vegetationLack * 2.5}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-medium text-[#2C4435] mb-1">
                      <span>Other Morphology</span>
                      <span className="font-bold text-gray-600">{selectedZone.contributors.other}%</span>
                    </div>
                    <div className="h-2 bg-[#F1F6F3] rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: `${selectedZone.contributors.other * 2.5}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Exposure Metrics */}
              <div className="lg:col-span-6 bg-white border border-[#D5E3DB] rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-[#143624] uppercase tracking-wider">
                  Exposure Metrics
                </h3>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-3.5">
                    <div className="text-xs text-[#6B8576]">Population Density</div>
                    <div className="text-xl font-bold text-[#162E20] font-mono-data mt-1">
                      {selectedZone.populationDensity.toLocaleString()} <span className="text-xs font-normal text-[#6B8576]">/sq km</span>
                    </div>
                  </div>
                  <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-3.5">
                    <div className="text-xs text-[#6B8576]">Built-up Density</div>
                    <div className="text-xl font-bold text-red-600 font-mono-data mt-1">
                      {selectedZone.builtUpDensity} %
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Environmental Indicators */}
              <div className="lg:col-span-6 bg-white border border-[#D5E3DB] rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-[#143624] uppercase tracking-wider">
                  Environmental Indicators
                </h3>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-3.5">
                    <div className="text-xs text-[#6B8576]">Mean LST Current</div>
                    <div className="text-xl font-bold text-red-600 font-mono-data mt-1">
                      {selectedZone.meanLst} °C
                    </div>
                  </div>
                  <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-3.5">
                    <div className="text-xs text-[#6B8576]">NDVI Score</div>
                    <div className="text-xl font-bold text-amber-700 font-mono-data mt-1">
                      {selectedZone.ndviScore} <span className="text-xs font-normal text-[#6B8576]">(Low)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: TIME SERIES */}
        {activeSubTab === 'time-series' && (
          <div className="space-y-6 bg-white border border-[#D5E3DB] rounded-2xl p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-[#143624]">Continuous Diurnal Heat Flux</h2>
              <p className="text-xs text-[#5D7769]">Historical Surface Heat Flux & Nighttime Thermal Trap Analysis for {selectedZone.name}</p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={RISK_TREND_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF5F0" />
                  <XAxis dataKey="date" stroke="#889C90" fontSize={11} />
                  <YAxis domain={[30, 50]} stroke="#889C90" fontSize={11} unit="°C" />
                  <Tooltip />
                  <Area type="monotone" dataKey="lst" name="Land Surface Temp" stroke="#DC2626" fill="#FEE2E2" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="air" name="Air Temperature" stroke="#164E35" fill="#EAF5EE" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E2EBE5] text-xs text-[#3E5B4B] space-y-1">
              <span className="font-bold text-[#164E35]">Urban Canopy Thermal Lag:</span>
              <p>In {selectedZone.name}, high-density concrete blocks radiate stored heat until 02:00 AM, elevating baseline nocturnal temperatures by +4.8°C above suburban outskirts.</p>
            </div>
          </div>
        )}

        {/* SUBTAB 4: DEMOGRAPHICS */}
        {activeSubTab === 'demographics' && (
          <div className="space-y-6 bg-white border border-[#D5E3DB] rounded-2xl p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-[#143624]">Vulnerable Populations Exposure</h2>
              <p className="text-xs text-[#5D7769]">Demographic overlays for Zone {selectedZone.id} ({selectedZone.name})</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl">
                <div className="text-xs text-[#6B8576]">Elderly &gt; 65 Years</div>
                <div className="text-2xl font-bold text-[#163B26] mt-1 font-mono-data">18.4%</div>
                <div className="text-[11px] text-amber-700 mt-1">Elevated risk cohort (2,620 people)</div>
              </div>

              <div className="p-4 bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl">
                <div className="text-xs text-[#6B8576]">Outdoor & Informal Labor</div>
                <div className="text-2xl font-bold text-red-600 mt-1 font-mono-data">41.2%</div>
                <div className="text-[11px] text-red-600 mt-1">Direct midday thermal exposure</div>
              </div>

              <div className="p-4 bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl">
                <div className="text-xs text-[#6B8576]">Cooling Access Index</div>
                <div className="text-2xl font-bold text-red-600 mt-1 font-mono-data">28/100</div>
                <div className="text-[11px] text-red-600 mt-1">Severe energy poverty pocket</div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: INTERVENTIONS */}
        {activeSubTab === 'interventions' && (
          <div className="space-y-6 bg-white border border-[#D5E3DB] rounded-2xl p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-[#143624]">Targeted Resilience Interventions</h2>
              <p className="text-xs text-[#5D7769]">Simulate localized heat reduction strategies in {selectedZone.name}</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'cool-roofs', title: 'High-Albedo Cool Roof Coating (50,000 sq m)', tempReduction: '-1.8 °C LST', cost: '₹ 18 Lakhs', desc: 'Reflective polymer paint application across industrial sheds.' },
                { id: 'green-canopy', title: 'Dense Urban Miyawaki Micro-Forests (2 Hectares)', tempReduction: '-2.4 °C LST', cost: '₹ 32 Lakhs', desc: 'Fast-growing indigenous canopy species along arterial corridors.' },
                { id: 'misting-hubs', title: 'Public Hydration & Solar-Powered Misting Stations (12 Units)', tempReduction: '-3.1 °C Felt', cost: '₹ 14 Lakhs', desc: 'Deploys localized thermal relief zones at transit junctions.' },
              ].map((item) => {
                const isSelected = interventionApplied[item.id];
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#EAF5EE] border-[#1F6E43]'
                        : 'bg-[#F9FCFA] border-[#DCE8E0] hover:border-[#BACFC2]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-[#143624]">{item.title}</div>
                      <div className="text-xs text-[#526F5F]">{item.desc}</div>
                      <div className="flex items-center gap-3 text-xs pt-1 font-mono-data">
                        <span className="text-emerald-700 font-bold">Impact: {item.tempReduction}</span>
                        <span className="text-[#6B8576]">Budget: {item.cost}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleIntervention(item.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-[#164E35] text-white'
                          : 'bg-white border border-[#BACFC2] text-[#164E35] hover:bg-[#EAF5EE]'
                      }`}
                    >
                      {isSelected ? 'Applied ✓' : 'Simulate'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB 6: EXPORT */}
        {activeSubTab === 'export' && (
          <div className="space-y-6 bg-white border border-[#D5E3DB] rounded-2xl p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-[#143624]">Data & GIS Layer Export</h2>
              <p className="text-xs text-[#5D7769]">Download high-resolution raster tiles, shapefiles, and tabular metrics.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 border border-[#DCE8E0] rounded-xl text-center space-y-2">
                <div className="font-bold text-sm text-[#143624]">GeoJSON Vector Layers</div>
                <p className="text-xs text-[#526F5F]">Chennai census tracts & heat indices</p>
                <button
                  onClick={onOpenReport}
                  className="w-full py-2 bg-[#164E35] text-white text-xs font-semibold rounded-lg hover:bg-[#113E2A] cursor-pointer"
                >
                  Download GeoJSON
                </button>
              </div>

              <div className="p-4 border border-[#DCE8E0] rounded-xl text-center space-y-2">
                <div className="font-bold text-sm text-[#143624]">GeoTIFF Thermal Rasters</div>
                <p className="text-xs text-[#526F5F]">Landsat 8/9 LST calibrated bands</p>
                <button
                  onClick={onOpenReport}
                  className="w-full py-2 bg-[#164E35] text-white text-xs font-semibold rounded-lg hover:bg-[#113E2A] cursor-pointer"
                >
                  Download GeoTIFF
                </button>
              </div>

              <div className="p-4 border border-[#DCE8E0] rounded-xl text-center space-y-2">
                <div className="font-bold text-sm text-[#143624]">Tabular Risk Index (CSV)</div>
                <p className="text-xs text-[#526F5F]">Raw micro-zone scores & metrics</p>
                <button
                  onClick={onOpenReport}
                  className="w-full py-2 bg-[#164E35] text-white text-xs font-semibold rounded-lg hover:bg-[#113E2A] cursor-pointer"
                >
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
