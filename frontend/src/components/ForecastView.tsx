import React, { useState, useEffect } from 'react';
import { HourlyForecast, ZoneData } from '../types';
import { 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  Flame, 
  Thermometer, 
  Droplets,
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

interface ForecastViewProps {
  selectedZone: ZoneData;
  onOpenFullBrief: () => void;
}

export const ForecastView: React.FC<ForecastViewProps> = ({ selectedZone, onOpenFullBrief }) => {
  const [timeHorizon, setTimeHorizon] = useState<'24h' | '48h'>('24h');
  const [forecastData, setForecastData] = useState<HourlyForecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHour, setSelectedHour] = useState<HourlyForecast | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8000/api/v1/forecast/${selectedZone.id}`)
      .then(res => res.json())
      .then((data: HourlyForecast[]) => {
        setForecastData(data);
        // Find "NOW" or default to first
        const nowHr = data.find(h => h.isNow) || data[0];
        setSelectedHour(nowHr);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch forecast", err);
        setIsLoading(false);
      });
  }, [selectedZone.id]);

  const visibleData = forecastData.slice(0, timeHorizon === '24h' ? 24 : 48);

  if (isLoading || !selectedHour) {
    return <div className="text-center p-12 text-[#164E35] font-bold animate-pulse">Running ML Predictive Forecast...</div>;
  }


  return (
    <div id="forecast-view" className="max-w-7xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      {/* View Header */}
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#143624] uppercase">
          WHAT HAPPENS NEXT?
        </h1>
        <p className="text-sm text-[#4E6858]">
          48-Hour Predictive ML Risk Model · {selectedZone.name}
        </p>
      </header>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Aggregate Risk Evolution (8 Col) */}
        <section
          id="aggregate-risk-card"
          className="lg:col-span-8 bg-white border border-[#D5E3DB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6"
        >
          {/* Header Row: Title & 24H/48H Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#EAF2ED]">
            <div>
              <div className="text-xs font-bold text-[#143624] uppercase tracking-wider">
                AGGREGATE RISK EVOLUTION
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-[#11291D] font-mono-data">
                  {selectedHour.riskScore}
                </span>
                <span className="text-sm font-bold text-red-600 flex items-center gap-0.5">
                  <ArrowUpRight className="w-4 h-4" />
                  +22 pt peak delta
                </span>
              </div>
            </div>

            {/* Time Horizon Toggles */}
            <div className="flex items-center gap-1 bg-[#F1F6F3] p-1 rounded-xl border border-[#D6E5DC]">
              <button
                id="forecast-toggle-24h"
                onClick={() => setTimeHorizon('24h')}
                className={`px-3.5 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  timeHorizon === '24h'
                    ? 'bg-[#164E35] text-white shadow-xs'
                    : 'text-[#476051] hover:text-[#164E35]'
                }`}
              >
                24H VIEW
              </button>
              <button
                id="forecast-toggle-48h"
                onClick={() => setTimeHorizon('48h')}
                className={`px-3.5 py-1.5 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                  timeHorizon === '48h'
                    ? 'bg-[#164E35] text-white shadow-xs'
                    : 'text-[#476051] hover:text-[#164E35]'
                }`}
              >
                48H
              </button>
            </div>
          </div>

          {/* Interactive Predictive Area Chart */}
          <div className="h-72 sm:h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={visibleData}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length > 0) {
                    setSelectedHour(e.activePayload[0].payload as HourlyForecast);
                  }
                }}
              >
                <defs>
                  <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#164E35" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F6F2" vertical={false} />
                <XAxis dataKey="time" stroke="#889C90" fontSize={11} tickLine={false} />
                <YAxis domain={[30, 100]} stroke="#889C90" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as HourlyForecast;
                      return (
                        <div className="bg-white/95 backdrop-blur-sm border border-[#D5E3DB] p-2.5 rounded-xl shadow-lg text-xs space-y-1">
                          <div className="font-bold text-[#143624]">{d.displayTime}</div>
                          <div className="text-red-600 font-bold">Risk Score: {d.riskScore}/100</div>
                          <div className="text-slate-700">Air Temp: {d.temperature}°C</div>
                          <div className="text-orange-600 font-semibold">LST: {d.lstTemp}°C</div>
                          <div className="text-blue-600">Humidity: {d.humidity}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x="14:00" stroke="#DC2626" strokeDasharray="4 2" label={{ value: 'NOW (Peak)', fill: '#DC2626', fontSize: 11, position: 'top' }} />
                <Area
                  type="monotone"
                  dataKey="riskScore"
                  name="Projected Risk"
                  stroke="#164E35"
                  strokeWidth={3.5}
                  fill="url(#riskAreaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Timeline Scrubber & Selected Hour Inspector */}
          <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#143624] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1F6E43]" />
                Forecast Inspection Point: {selectedHour.displayTime}
              </span>
              <span className="text-[#6B8576]">Click chart or buttons below</span>
            </div>

            {/* Quick Time Selector Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {visibleData.slice(0, 12).map((hour) => (
                <button
                  key={hour.time}
                  onClick={() => setSelectedHour(hour)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer ${
                    selectedHour.time === hour.time
                      ? 'bg-[#164E35] text-white font-bold'
                      : 'bg-white border border-[#D5E3DB] text-[#3E5547] hover:bg-[#EAF5EE]'
                  }`}
                >
                  {hour.time}
                </button>
              ))}
            </div>

            {/* Selected Hour Stats Banner */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
              <div className="bg-white border border-[#E2EBE5] rounded-lg p-2">
                <div className="text-[#6B8576]">Projected Air Temp</div>
                <div className="font-bold text-[#1F2937] font-mono-data text-sm mt-0.5">{selectedHour.temperature} °C</div>
              </div>
              <div className="bg-white border border-[#E2EBE5] rounded-lg p-2">
                <div className="text-red-600 font-medium">Estimated LST</div>
                <div className="font-bold text-red-600 font-mono-data text-sm mt-0.5">{selectedHour.lstTemp} °C</div>
              </div>
              <div className="bg-white border border-[#E2EBE5] rounded-lg p-2">
                <div className="text-[#6B8576]">Relative Humidity</div>
                <div className="font-bold text-blue-600 font-mono-data text-sm mt-0.5">{selectedHour.humidity} %</div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Outlook Summary & Heat Story (4 Col) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Risk Outlook Summary */}
          <section
            id="risk-outlook-summary-card"
            className="bg-white border border-[#D5E3DB] rounded-2xl p-5 shadow-sm space-y-4"
          >
            <h2 className="text-xs font-bold text-[#143624] uppercase tracking-wider">
              RISK OUTLOOK SUMMARY
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/70 border border-red-200">
                <span className="font-medium text-red-900">Critical Risk Zones</span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold font-mono">
                  4
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="font-medium text-amber-900">High Risk Zones</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-bold font-mono">
                  17
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="font-medium text-emerald-900">Elevated / Moderate</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#164E35] text-white font-bold font-mono">
                  42
                </span>
              </div>
            </div>
          </section>

          {/* Card: Today's Heat Story */}
          <section
            id="todays-heat-story-card"
            className="bg-white border border-[#D5E3DB] rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#143624] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#1F6E43]" />
                TODAY'S HEAT STORY
              </div>

              <blockquote className="text-xs sm:text-sm text-[#3E5547] leading-relaxed italic border-l-2 border-[#1F6E43] pl-3">
                &ldquo;Heat risk is intensifying across northern Chennai. Structural thermal retention in industrial zones is projected to peak at 14:00, creating localized micro-climates that will sustain critical temperatures well into the evening hours.&rdquo;
              </blockquote>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#EAF2ED] flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-[#6B8576]">
                GENERATED BY AI · 06:42 AM
              </span>

              <button
                id="btn-full-brief"
                onClick={onOpenFullBrief}
                className="font-bold text-[#164E35] hover:text-[#103A27] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>FULL BRIEF</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
