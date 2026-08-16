import React, { useState } from 'react';
import { CHENNAI_ZONES } from '../data/mockData';
import { ZoneData } from '../types';
import { 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowRight, 
  ArrowDownRight, 
  ChevronRight, 
  Sparkles,
  Layers,
  MapPin
} from 'lucide-react';

interface PriorityViewProps {
  onSelectZone: (zone: ZoneData) => void;
  selectedZone: ZoneData;
  onExploreZone: (zone: ZoneData) => void;
}

export const PriorityView: React.FC<PriorityViewProps> = ({
  onSelectZone,
  selectedZone,
  onExploreZone,
}) => {
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const getTrendIcon = (trend: ZoneData['trend']) => {
    if (trend === 'up') return <ArrowUpRight className="w-4 h-4 text-red-600" />;
    if (trend === 'down') return <ArrowDownRight className="w-4 h-4 text-emerald-600" />;
    return <ArrowRight className="w-4 h-4 text-amber-600" />;
  };

  return (
    <div id="priority-view" className="max-w-7xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#143624] uppercase">
          AREAS NEEDING ATTENTION
        </h1>
        <p className="text-xs sm:text-sm text-[#4E6858] max-w-3xl">
          Strategic risk prioritization matrix identifying census tracts with intersecting critical heat exposure and vulnerable population densities.
        </p>
      </header>

      {/* Main Two-Column Grid: Matrix on Left, Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: 4-Quadrant Strategic Matrix (7 Col) */}
        <section
          id="prioritization-matrix-card"
          className="lg:col-span-7 bg-white border border-[#D5E3DB] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#EAF2ED]">
            <div>
              <div className="text-xs font-bold text-[#143624] uppercase tracking-wider">
                STRATEGIC INTERVENTION MATRIX
              </div>
              <div className="text-xs text-[#5D7769]">
                Heat Risk vs. Population Exposure Index
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#EAF5EE] text-[#164E35] font-semibold border border-[#C6E2D0]">
              7 Priority Hotspots Plotted
            </span>
          </div>

          {/* 4-Quadrant Canvas */}
          <div className="relative w-full h-80 sm:h-96 my-4 bg-[#F9FCFA] border border-[#DCE8E0] rounded-xl p-6 select-none flex items-center justify-center overflow-hidden">
            {/* Quadrant Background Grids & Labels */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-90 pointer-events-none">
              {/* Top Left: High Priority */}
              <div className="border-r border-b border-[#D8E6DE] bg-amber-50/20 p-3">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100/80 px-2 py-0.5 rounded">
                  High Priority
                </span>
              </div>
              {/* Top Right: Critical Priority */}
              <div className="border-b border-[#D8E6DE] bg-red-50/30 p-3 flex justify-end">
                <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider bg-red-100/90 px-2 py-0.5 rounded">
                  Critical Priority (Action Now)
                </span>
              </div>
              {/* Bottom Left: Low Priority */}
              <div className="border-r border-[#D8E6DE] bg-slate-50/30 p-3 flex items-end">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                  Low Priority
                </span>
              </div>
              {/* Bottom Right: Monitor */}
              <div className="bg-blue-50/20 p-3 flex items-end justify-end">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded">
                  Monitor
                </span>
              </div>
            </div>

            {/* Axis Center Crosshairs */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#C5DAD0]" />
            <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#C5DAD0]" />

            {/* Axis Labels */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-[#5A7767] tracking-wider uppercase">
              Heat Risk Index (Low → High)
            </div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#5A7767] tracking-wider uppercase">
              Population Exposure (Low → High)
            </div>

            {/* Interactive Plotted Hotspot Nodes */}
            <div className="relative w-full h-full">
              {CHENNAI_ZONES.map((zone) => {
                // Map values to percent positions:
                // X: popExposureScore (0 to 100) -> 8% to 92%
                // Y: riskScore (40 to 100) -> 90% to 10% (inverted)
                const leftPct = 10 + (zone.popExposureScore / 100) * 80;
                const topPct = 90 - ((zone.riskScore - 50) / 50) * 80;

                const isSelected = selectedZone.id === zone.id;
                const isHovered = hoveredZoneId === zone.id;

                const isCritical = zone.riskScore > 85 && zone.popExposureScore > 60;

                return (
                  <div
                    key={zone.id}
                    id={`matrix-node-${zone.id}`}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                    onClick={() => onSelectZone(zone)}
                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                  >
                    {/* Node Dot */}
                    <div
                      className={`relative flex items-center justify-center transition-all duration-200 ${
                        isSelected || isHovered
                          ? 'scale-125 ring-4 ring-[#164E35]/30'
                          : 'hover:scale-110'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shadow-md ${
                          isCritical
                            ? 'bg-red-600 ring-2 ring-white'
                            : zone.riskScore >= 80
                            ? 'bg-amber-600 ring-2 ring-white'
                            : 'bg-[#164E35] ring-2 ring-white'
                        }`}
                      >
                        {zone.id}
                      </span>
                    </div>

                    {/* Floating Info Tag */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap bg-white border border-[#D5E3DB] shadow-md px-2 py-0.5 rounded text-[10px] font-bold text-[#143624] pointer-events-none transition-opacity ${
                        isSelected || isHovered ? 'opacity-100 z-30' : 'opacity-70 group-hover:opacity-100'
                      }`}
                    >
                      {zone.name.split(' ')[0]} ({zone.trendValue || zone.riskScore})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-[#5D7769]">
            <span>Click any node to view detailed micro-zone specifications</span>
            <span className="font-semibold text-red-600">Top-right: 4 Red Hotspots</span>
          </div>
        </section>

        {/* Right Column: Top Critical Zones Table (5 Col) */}
        <section
          id="critical-zones-table-card"
          className="lg:col-span-5 bg-white border border-[#D5E3DB] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EAF2ED]">
              <h2 className="text-xs font-bold text-[#143624] uppercase tracking-wider">
                TOP CRITICAL ZONES
              </h2>
              <span className="text-xs text-[#6B8576]">Composite Risk Rank</span>
            </div>

            {/* Table */}
            <div className="mt-3 divide-y divide-[#F0F6F2]">
              {CHENNAI_ZONES.slice(0, 7).map((zone, idx) => {
                const isSelected = selectedZone.id === zone.id;
                return (
                  <div
                    key={zone.id}
                    onClick={() => onSelectZone(zone)}
                    className={`py-3 px-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAF5EE] border border-[#C6E2D0]'
                        : 'hover:bg-[#F7FAF8]'
                    }`}
                  >
                    {/* Zone ID & Name */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#6B8576]">
                        0{idx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-[#143624]">
                          {zone.id}
                        </div>
                        <div className="text-xs text-[#5D7769] truncate max-w-[140px]">
                          {zone.name}
                        </div>
                      </div>
                    </div>

                    {/* Risk Score & Trend */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold font-mono text-slate-800">
                        {zone.trendValue || zone.riskScore}
                      </span>
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-[#D5E3DB] shadow-2xs">
                        {getTrendIcon(zone.trend)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action to Explore Selected Zone */}
          <div className="pt-3 border-t border-[#EAF2ED]">
            <button
              id="btn-inspect-priority-zone"
              onClick={() => onExploreZone(selectedZone)}
              className="w-full py-3 px-4 rounded-xl bg-[#164E35] hover:bg-[#113E2A] text-white font-semibold text-xs tracking-wider uppercase shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Inspect Zone {selectedZone.id} in Map</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
