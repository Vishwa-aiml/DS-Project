import React, { useState } from 'react';
import { AnalyticsSubTab } from '../types';
import { TEMP_DISTRIBUTION_DATA } from '../data/mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  LineChart, 
  Line, 
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { TrendingDown, AlertCircle, Info, Filter, Sparkles } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsSubTab>('environment');
  const [exposureFilter, setExposureFilter] = useState<'critical' | 'baseline'>('critical');

  // Synthetic scatter points for LST vs NDVI
  const scatterPoints = [
    { ndvi: 0.12, lst: 47.5, name: 'Industrial Strip A' },
    { ndvi: 0.14, lst: 46.8, name: 'Port Transit Hub' },
    { ndvi: 0.15, lst: 46.2, name: 'G143 Factory Zone' },
    { ndvi: 0.18, lst: 45.4, name: 'G201 Thermal Yard' },
    { ndvi: 0.20, lst: 44.9, name: 'Royapuram Dense' },
    { ndvi: 0.22, lst: 44.0, name: 'H310 Logistics' },
    { ndvi: 0.25, lst: 43.1, name: 'C011 Rail Terminus' },
    { ndvi: 0.28, lst: 42.0, name: 'Wholesale Depot' },
    { ndvi: 0.32, lst: 40.8, name: 'Commercial Corridor' },
    { ndvi: 0.35, lst: 39.5, name: 'Paved Residential' },
    { ndvi: 0.40, lst: 38.2, name: 'Urban Neighborhood' },
    { ndvi: 0.45, lst: 37.0, name: 'Anna Nagar Avenue' },
    { ndvi: 0.50, lst: 36.1, name: 'Institutional Campus' },
    { ndvi: 0.55, lst: 35.2, name: 'Adyar Riparian Basin' },
    { ndvi: 0.60, lst: 34.0, name: 'Guindy National Reserve' },
    { ndvi: 0.65, lst: 33.1, name: 'Botanical Sanctuary' },
  ];

  // July time-series data for Risk vs Population Exposure
  const julyRiskExposureData = [
    { day: 'Jul 01', heatRisk: 58, popExposure: 52, alert: false },
    { day: 'Jul 04', heatRisk: 62, popExposure: 56, alert: false },
    { day: 'Jul 08', heatRisk: 74, popExposure: 68, alert: false },
    { day: 'Jul 12', heatRisk: 86, popExposure: 84, alert: true }, // Heatwave 1
    { day: 'Jul 15', heatRisk: 91, popExposure: 89, alert: true },
    { day: 'Jul 18', heatRisk: 78, popExposure: 72, alert: false },
    { day: 'Jul 22', heatRisk: 69, popExposure: 63, alert: false },
    { day: 'Jul 26', heatRisk: 88, popExposure: 87, alert: true }, // Heatwave 2
    { day: 'Jul 30', heatRisk: 84, popExposure: 82, alert: true },
  ];

  const subTabs: { id: AnalyticsSubTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'temporal', label: 'Temporal' },
    { id: 'spatial', label: 'Spatial' },
    { id: 'environment', label: 'Environment' },
    { id: 'exposure', label: 'Exposure' },
  ];

  return (
    <div id="analytics-view" className="max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Header & Sub-navigation Tabs */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#143624]">
            Statistical Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#4F6A5B]">
            Correlative modeling between vegetative albedo sinks, radiant thermal loads, and demographic exposure.
          </p>
        </div>

        {/* Sub-tabs list */}
        <div className="flex items-center gap-6 border-b border-[#D8E6DE] overflow-x-auto pb-1">
          {subTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-medium transition-all pb-2.5 relative cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#164E35] font-bold'
                    : 'text-[#5B7767] hover:text-[#184E32]'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1F6E43] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Observed Association: LST vs NDVI (6 Col) */}
        <section
          id="card-lst-ndvi-scatter"
          className="lg:col-span-6 bg-white border border-[#D5E3DB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
        >
          <div>
            <div className="text-xs font-bold text-[#143624] uppercase tracking-wider">
              OBSERVED ASSOCIATION: LST VS NDVI
            </div>
            <p className="text-xs text-[#5B7767] mt-0.5">
              Empirical negative correlation (R² = 0.84): Urban tree canopy reduces peak radiant LST by up to ~14°C.
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F6F2" />
                <XAxis
                  type="number"
                  dataKey="ndvi"
                  name="NDVI Score"
                  domain={[0.0, 0.7]}
                  stroke="#889C90"
                  fontSize={11}
                  label={{ value: 'Normalized Difference Vegetation Index (NDVI)', position: 'bottom', offset: 5, fontSize: 11, fill: '#5B7767' }}
                />
                <YAxis
                  type="number"
                  dataKey="lst"
                  name="Land Surface Temp"
                  domain={[30, 50]}
                  unit="°C"
                  stroke="#889C90"
                  fontSize={11}
                  label={{ value: 'LST (°C)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#5B7767' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-[#D5E3DB] p-2.5 rounded-xl shadow-lg text-xs space-y-1">
                          <div className="font-bold text-[#143624]">{data.name}</div>
                          <div className="text-emerald-700 font-semibold">NDVI: {data.ndvi}</div>
                          <div className="text-red-600 font-bold">LST: {data.lst} °C</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Zones" data={scatterPoints} fill="#164E35" shape="circle" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-3 text-xs text-[#3E5B4B] flex items-center justify-between">
            <span className="font-semibold text-[#164E35]">Key Takeaway:</span>
            <span>Every +0.10 NDVI increase yields ~2.1°C surface cooling.</span>
          </div>
        </section>

        {/* Card 2: Temperature Distribution Histogram (6 Col) */}
        <section
          id="card-temp-distribution"
          className="lg:col-span-6 bg-white border border-[#D5E3DB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
        >
          <div>
            <div className="text-xs font-bold text-[#143624] uppercase tracking-wider">
              TEMPERATURE DISTRIBUTION
            </div>
            <p className="text-xs text-[#5B7767] mt-0.5">
              Frequency distribution of days across temperature brackets (July 2023).
            </p>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TEMP_DISTRIBUTION_DATA} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F6F2" vertical={false} />
                <XAxis dataKey="temp" stroke="#889C90" fontSize={11} />
                <YAxis stroke="#889C90" fontSize={11} label={{ value: 'Number of Days', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#5B7767' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-[#D5E3DB] p-2 rounded-lg shadow text-xs">
                          <div className="font-bold text-[#143624]">Bracket: {d.temp}</div>
                          <div className="text-[#164E35] font-semibold">{d.days} Days Recorded</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="days" fill="#164E35" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-3 text-xs text-[#3E5B4B] flex items-center justify-between">
            <span className="font-semibold text-red-600">Extreme Heat Duration:</span>
            <span>43 total days recorded above 36°C threshold in 2023.</span>
          </div>
        </section>

        {/* Card 3: Risk vs Population Exposure Time Series (12 Col Full Width) */}
        <section
          id="card-risk-population-exposure"
          className="lg:col-span-12 bg-white border border-[#D5E3DB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#EAF2ED]">
            <div>
              <div className="text-xs font-bold text-[#143624] uppercase tracking-wider">
                RISK VS POPULATION EXPOSURE
              </div>
              <p className="text-xs text-[#5B7767] mt-0.5">
                Dual-trajectory tracking of composite heat indices alongside residential density exposure during severe heatwaves.
              </p>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-1 bg-[#F1F6F3] p-1 rounded-xl border border-[#D6E5DC]">
              <button
                onClick={() => setExposureFilter('critical')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  exposureFilter === 'critical'
                    ? 'bg-[#164E35] text-white shadow-xs'
                    : 'text-[#476051] hover:text-[#164E35]'
                }`}
              >
                Critical Zones Only
              </button>
              <button
                onClick={() => setExposureFilter('baseline')}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  exposureFilter === 'baseline'
                    ? 'bg-[#164E35] text-white shadow-xs'
                    : 'text-[#476051] hover:text-[#164E35]'
                }`}
              >
                Metropolitan Baseline
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={julyRiskExposureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF5F0" />
                <XAxis dataKey="day" stroke="#889C90" fontSize={11} />
                <YAxis domain={[40, 100]} stroke="#889C90" fontSize={11} label={{ value: 'Index Scale (0-100)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#5B7767' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#D5E3DB',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine y={80} stroke="#DC2626" strokeDasharray="3 3" label={{ value: 'Critical Alert Zone (80+)', fill: '#DC2626', fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="heatRisk"
                  name="Environmental Heat Risk"
                  stroke="#164E35"
                  strokeWidth={3}
                  dot={{ fill: '#164E35', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="popExposure"
                  name="Vulnerable Population Exposure"
                  stroke="#EA580C"
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  dot={{ fill: '#EA580C', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-red-50/60 border border-red-200 rounded-xl text-red-900">
              <span className="font-bold">Heatwave Spike July 12-15:</span> Intersection of high nocturnal humidity and industrial radiation forced risk indices to 91/100, affecting 890,000 residents in north wards.
            </div>
            <div className="p-3 bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl text-[#3E5B4B]">
              <span className="font-bold text-[#164E35]">Early Warning Reliability:</span> Model predicted peak exposure events 48 hours in advance with 92.4% validation fidelity.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
