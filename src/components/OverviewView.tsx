import React, { useState } from 'react';
import { MainTab, ZoneData } from '../types';
import { MapComponent } from './MapComponent';
import { RealLeafletMap } from './RealLeafletMap';
import { CHENNAI_ZONES } from '../data/mockData';
import { 
  ArrowRight, 
  MapPin, 
  Sun, 
  Trees, 
  Building2, 
  Users, 
  Flame, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles,
  Layers,
  Satellite
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (tab: MainTab) => void;
  onSelectZone: (zone: ZoneData) => void;
  selectedZone: ZoneData | null;
  selectedCity: string;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onSelectZone,
  selectedZone,
  selectedCity,
}) => {
  const [heroMapMode, setHeroMapMode] = useState<'real' | 'hex'>('real');
  const [activeLayer, setActiveLayer] = useState<'heat-risk' | 'lst' | 'ndvi' | 'population-density'>('heat-risk');

  return (
    <div id="overview-view" className="max-w-7xl mx-auto space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Top Hero Section: Two-Column Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        {/* Left Column: Hero Copy & Value Proposition */}
        <div className="lg:col-span-6 flex flex-col justify-between py-2 space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5F2E9] border border-[#C6E2D0] text-[#1A5C39] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#1F6E43]" />
              Urban Heat Intelligence
            </div>

            <h1 className="text-3xl sm:text-4xl xl:text-[44px] leading-[1.15] font-extrabold tracking-tight text-[#162D20]">
              SEE THE HEAT.{' '}
              <span className="text-[#162D20]">PREDICT THE RISK.</span>{' '}
              <br className="hidden sm:block" />
              <span className="text-[#1F6E43]">PRIORITIZE THE RESPONSE.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#476051] leading-relaxed max-w-xl font-normal">
              Transform environmental, weather, urban, and population data into localized heat-risk intelligence. Deploy resources where they matter most.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="hero-explore-btn"
              onClick={() => onNavigate('explore')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#164E35] hover:bg-[#113E2A] text-white font-semibold text-sm shadow-sm hover:shadow transition-all cursor-pointer group"
            >
              <span>EXPLORE PLATFORM</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              id="hero-methodology-btn"
              onClick={() => onNavigate('methodology')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-transparent hover:bg-[#E3EFE7] border border-[#BACFC2] text-[#164E35] font-semibold text-sm transition-colors cursor-pointer"
            >
              <span>VIEW METHODOLOGY</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Live Map Preview Card */}
        <div className="lg:col-span-6 bg-white border border-[#D5E3DB] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          {/* Card Top Title & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-[#EAF2ED]">
            <div className="flex items-center gap-2 text-[#183E2B] font-bold text-xs sm:text-sm tracking-wide uppercase">
              <MapPin className="w-4 h-4 text-[#1F6E43]" />
              <span>{selectedCity}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-[#EAF2ED] p-0.5 rounded-lg border border-[#D5E3DB] text-[11px] font-medium">
                <button
                  onClick={() => setHeroMapMode('real')}
                  className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    heroMapMode === 'real' ? 'bg-[#164E35] text-white shadow-2xs' : 'text-[#476051]'
                  }`}
                >
                  Real Map
                </button>
                <button
                  onClick={() => setHeroMapMode('hex')}
                  className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    heroMapMode === 'hex' ? 'bg-[#164E35] text-white shadow-2xs' : 'text-[#476051]'
                  }`}
                >
                  Grid
                </button>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 text-[11px] font-bold tracking-wide">
                CRITICAL: G143
              </span>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="h-[300px] sm:h-[340px] w-full relative rounded-xl overflow-hidden">
            {heroMapMode === 'real' ? (
              <RealLeafletMap
                zones={CHENNAI_ZONES}
                selectedZone={selectedZone}
                onSelectZone={(zone) => {
                  onSelectZone(zone);
                  onNavigate('explore');
                }}
                activeLayer={activeLayer}
                onLayerChange={(layer) => setActiveLayer(layer as any)}
              />
            ) : (
              <MapComponent
                selectedZone={selectedZone}
                onSelectZone={(zone) => {
                  onSelectZone(zone);
                  onNavigate('explore');
                }}
                isHeroPreview={true}
              />
            )}
          </div>
        </div>
      </section>

      {/* 5 Key Metric Cards Row */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Metric 1: City Heat Risk */}
        <div id="metric-heat-risk" className="bg-white border border-[#D8E6DE] rounded-xl p-4 shadow-sm hover:border-[#B5D4C2] transition-all">
          <div className="text-xs font-semibold text-[#577263] uppercase tracking-wider mb-1">
            City Heat Risk
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#EA580C] font-mono-data">68</span>
            <span className="text-[11px] font-semibold text-[#6E8879] uppercase">INDEX VALUE</span>
          </div>
          <div className="mt-2 text-xs text-[#6B8576]">
            Elevated thermal load city-wide
          </div>
        </div>

        {/* Metric 2: Critical Zones */}
        <div id="metric-critical-zones" className="bg-white border border-[#D8E6DE] rounded-xl p-4 shadow-sm hover:border-[#B5D4C2] transition-all">
          <div className="text-xs font-semibold text-[#577263] uppercase tracking-wider mb-1">
            Critical Zones
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#DC2626] font-mono-data">4</span>
            <span className="text-[11px] font-semibold text-red-600 uppercase">Immediate Action</span>
          </div>
          <div className="mt-2 text-xs text-[#6B8576]">
            G143, G201, H310, F092
          </div>
        </div>

        {/* Metric 3: High Risk Zones */}
        <div id="metric-high-risk-zones" className="bg-white border border-[#D8E6DE] rounded-xl p-4 shadow-sm hover:border-[#B5D4C2] transition-all">
          <div className="text-xs font-semibold text-[#577263] uppercase tracking-wider mb-1">
            High Risk Zones
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#D97706] font-mono-data">17</span>
            <span className="text-[11px] font-semibold text-amber-700 uppercase">Monitored</span>
          </div>
          <div className="mt-2 text-xs text-[#6B8576]">
            Dense built-up clusters
          </div>
        </div>

        {/* Metric 4: Population Exposure */}
        <div id="metric-pop-exposure" className="bg-white border border-[#D8E6DE] rounded-xl p-4 shadow-sm hover:border-[#B5D4C2] transition-all">
          <div className="text-xs font-semibold text-[#577263] uppercase tracking-wider mb-1">
            Population Exposure
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#1A2E23] font-mono-data">2.4M</span>
            <span className="text-[11px] font-semibold text-[#6E8879] uppercase">Residents</span>
          </div>
          <div className="mt-2 text-xs text-[#6B8576]">
            High vulnerability demographic
          </div>
        </div>

        {/* Metric 5: Outlook */}
        <div id="metric-outlook" className="col-span-2 sm:col-span-1 bg-white border border-[#D8E6DE] rounded-xl p-4 shadow-sm hover:border-[#B5D4C2] transition-all">
          <div className="text-xs font-semibold text-[#577263] uppercase tracking-wider mb-1">
            Outlook
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#DC2626] font-mono-data">INC ↑</span>
          </div>
          <div className="mt-2 text-xs text-red-600 font-medium">
            Peak expected at 14:00 today
          </div>
        </div>
      </section>

      {/* Bottom Section: Multi-layered Approach & 4 Analytical Pillars */}
      <section className="space-y-6 pt-4">
        {/* Section Header with vertical green accent bar */}
        <div className="flex items-center gap-3 border-l-4 border-[#1F6E43] pl-3.5">
          <h2 className="text-lg sm:text-xl font-bold text-[#143624]">
            One city. Thousands of zones. A multi-layered approach to urban micro-climate analysis.
          </h2>
        </div>

        {/* 4 Pillar Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1: Weather */}
          <div id="pillar-weather" className="bg-white border border-[#D8E6DE] rounded-xl p-5 shadow-sm space-y-3 hover:border-[#B5D4C2] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#EBF5EE] text-[#1F6E43] flex items-center justify-center">
              <Sun className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold tracking-wider text-[#163D28] uppercase">
              Weather
            </h3>
            <p className="text-xs text-[#4F6A5B] leading-relaxed">
              Real-time meteorological inputs, solar radiation, and humidity patterns at granular resolutions.
            </p>
          </div>

          {/* Pillar 2: Environment */}
          <div id="pillar-environment" className="bg-white border border-[#D8E6DE] rounded-xl p-5 shadow-sm space-y-3 hover:border-[#B5D4C2] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#EBF5EE] text-[#1F6E43] flex items-center justify-center">
              <Trees className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold tracking-wider text-[#163D28] uppercase">
              Environment
            </h3>
            <p className="text-xs text-[#4F6A5B] leading-relaxed">
              Vegetation indices, albedo measurements, and natural cooling sink identification.
            </p>
          </div>

          {/* Pillar 3: Urban */}
          <div id="pillar-urban" className="bg-white border border-[#D8E6DE] rounded-xl p-5 shadow-sm space-y-3 hover:border-[#B5D4C2] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#EBF5EE] text-[#1F6E43] flex items-center justify-center">
              <Building2 className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold tracking-wider text-[#163D28] uppercase">
              Urban
            </h3>
            <p className="text-xs text-[#4F6A5B] leading-relaxed">
              Building density, material thermal mass, and infrastructure-induced heat island effects.
            </p>
          </div>

          {/* Pillar 4: Exposure */}
          <div id="pillar-exposure" className="bg-white border border-[#D8E6DE] rounded-xl p-5 shadow-sm space-y-3 hover:border-[#B5D4C2] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#EBF5EE] text-[#1F6E43] flex items-center justify-center">
              <Users className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold tracking-wider text-[#163D28] uppercase">
              Exposure
            </h3>
            <p className="text-xs text-[#4F6A5B] leading-relaxed">
              Demographic vulnerability overlays, socio-economic factors, and critical infrastructure locations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
