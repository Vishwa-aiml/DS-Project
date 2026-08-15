import React, { useState } from 'react';
import { DATA_STREAMS, PIPELINE_STEPS, MODEL_METRICS, FEATURE_IMPORTANCE_LIST } from '../data/mockData';
import { 
  Database, 
  Satellite, 
  Users, 
  Building2, 
  Sun, 
  FileCheck, 
  Cpu, 
  Network, 
  AlertTriangle, 
  Globe, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Sliders,
  Layers,
  BarChart3,
  HelpCircle,
  Binary
} from 'lucide-react';

export const MethodologyView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'all' | 'data-pipeline' | 'ml-models'>('all');

  const getStreamIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-5 h-5 text-emerald-700" />;
      case 'Satellite': return <Satellite className="w-5 h-5 text-teal-700" />;
      case 'Users': return <Users className="w-5 h-5 text-blue-700" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-amber-700" />;
      default: return <Database className="w-5 h-5 text-emerald-700" />;
    }
  };

  const getPipelineIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database': return <Database className="w-4 h-4" />;
      case 'FileCheck': return <FileCheck className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'Network': return <Network className="w-4 h-4" />;
      case 'AlertTriangle': return <AlertTriangle className="w-4 h-4" />;
      case 'Globe': return <Globe className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div id="methodology-view" className="max-w-7xl mx-auto space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D8E6DE]">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-widest text-[#1F6E43]">
            DATA PIPELINES & MACHINE LEARNING ARCHITECTURE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#143624]">
            Methodology & Model Science
          </h1>
          <p className="text-xs sm:text-sm text-[#4F6A5B]">
            Comprehensive documentation of multispectral remote sensing streams, real-time ingestion pipelines, and the production XGBoost model predicting urban heat vulnerability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-[#E4EFE8] p-1 rounded-xl border border-[#D0E2D6] text-xs font-medium">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeSection === 'all' ? 'bg-[#164E35] text-white shadow-2xs' : 'text-[#3B5445] hover:text-[#164E35]'
              }`}
            >
              All Modules
            </button>
            <button
              onClick={() => setActiveSection('data-pipeline')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeSection === 'data-pipeline' ? 'bg-[#164E35] text-white shadow-2xs' : 'text-[#3B5445] hover:text-[#164E35]'
              }`}
            >
              Data Pipelines
            </button>
            <button
              onClick={() => setActiveSection('ml-models')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeSection === 'ml-models' ? 'bg-[#164E35] text-white shadow-2xs' : 'text-[#3B5445] hover:text-[#164E35]'
              }`}
            >
              Model Intelligence
            </button>
          </div>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F2E9] border border-[#C6E2D0] text-[#164E35] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            Model v1.7.3 Production
          </span>
        </div>
      </header>

      {/* SECTION A: Primary Data Ingestion Streams */}
      {(activeSection === 'all' || activeSection === 'data-pipeline') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#577263] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#1F6E43]" />
              Primary Data Ingestion Streams
            </h2>
            <span className="text-xs text-[#6B8576]">4 Core Spatial Feeds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DATA_STREAMS.map((stream) => (
              <div
                key={stream.id}
                id={`stream-card-${stream.id}`}
                className="bg-white border border-[#D5E3DB] rounded-2xl p-5 shadow-sm space-y-4 hover:border-[#B5D4C2] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Icon & Format Tag */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F7F2] flex items-center justify-center">
                      {getStreamIcon(stream.icon)}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${stream.badgeClass}`}>
                      {stream.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-[#143624]">
                    {stream.title}
                  </h3>

                  <p className="text-xs text-[#4E6858] leading-relaxed">
                    {stream.description}
                  </p>
                </div>

                {/* Specs Footer */}
                <div className="pt-3 border-t border-[#EAF2ED] grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#759081]">Frequency:</span>
                    <div className="font-bold text-[#163825] font-mono mt-0.5">{stream.frequency}</div>
                  </div>
                  <div>
                    <span className="text-[#759081]">Resolution:</span>
                    <div className="font-bold text-[#163825] font-mono mt-0.5">{stream.resolution}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION B: Analytic Pipeline Architecture */}
      {(activeSection === 'all' || activeSection === 'data-pipeline') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#577263] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1F6E43]" />
              Analytic Pipeline Architecture
            </h2>
            <span className="text-xs text-[#6B8576] font-mono">&lt; 45ms Latency</span>
          </div>

          <div className="bg-white border border-[#D5E3DB] rounded-2xl p-6 shadow-sm space-y-6">
            <p className="text-xs text-[#4F6A5B] leading-relaxed max-w-3xl">
              From raw multispectral raster bands and AWS telemetry stations to hyper-localized thermal vulnerability indices in under 45 milliseconds.
            </p>

            {/* 6-Step Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PIPELINE_STEPS.map((step) => (
                <div
                  key={step.step}
                  id={`pipeline-step-${step.step}`}
                  className="relative bg-[#F9FCFA] border border-[#DCE8E0] rounded-xl p-4 space-y-2 hover:border-[#1F6E43] transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-extrabold text-[#1F6E43]">
                      {step.step}
                    </span>
                    <div className="w-6 h-6 rounded-md bg-[#EBF5EE] text-[#164E35] flex items-center justify-center">
                      {getPipelineIcon(step.icon)}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-[#143624] group-hover:text-[#1F6E43] transition-colors">
                    {step.name}
                  </div>

                  <div className="text-[11px] text-[#6B8576] leading-tight">
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Core Formula Explainer */}
            <div className="p-4 bg-[#F2F8F4] border border-[#C6E2D0] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[#164E35] uppercase tracking-wide">
                  Composite Heat Risk Formula:
                </span>
                <div className="font-mono text-[#183827] text-sm">
                  Risk = 0.34(LST) + 0.22(Humidity) + 0.18(1 - NDVI) + 0.11(1 - Albedo) + 0.08(PopDensity)
                </div>
              </div>

              <span className="text-[11px] text-[#557262] shrink-0 font-medium">
                Calibrated against Chennai ground-truth sensors
              </span>
            </div>
          </div>
        </section>
      )}

      {/* SECTION C: Production Model Intelligence & SHAP Feature Importance */}
      {(activeSection === 'all' || activeSection === 'ml-models') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#577263] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#1F6E43]" />
              Machine Learning Model Intelligence
            </h2>
            <span className="text-xs font-mono text-[#6B8576]">Last Retrained: Oct 2023</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Card: Production Model Architecture (6 Col) */}
            <div
              id="production-architecture-card"
              className="lg:col-span-6 bg-white border border-[#D5E3DB] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#143624] uppercase tracking-wider">
                    PRODUCTION MODEL ARCHITECTURE
                  </span>
                  <span className="text-xs font-bold text-[#164E35] font-mono bg-[#EBF5EE] px-2 py-0.5 rounded-md border border-[#C6E2D0]">
                    0.912 Global AUC
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-xl font-extrabold text-[#11291D]">
                    eXtreme Gradient Boosting (XGBoost)
                  </h3>
                  <div className="text-xs text-[#5D7769] font-medium mt-0.5">
                    Version 1.7.3 · Gradient Boosted Ensemble Decision Trees
                  </div>
                </div>

                {/* 3 Metric Value Boxes */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-3 text-center">
                    <div className="text-xs text-[#6B8576]">Precision</div>
                    <div className="text-xl font-extrabold text-[#163825] font-mono-data mt-1">
                      0.884
                    </div>
                  </div>

                  <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-3 text-center">
                    <div className="text-xs text-[#6B8576]">Recall</div>
                    <div className="text-xl font-extrabold text-[#1F6E43] font-mono-data mt-1">
                      0.901
                    </div>
                  </div>

                  <div className="bg-[#F8FAF8] border border-[#E2EBE5] rounded-xl p-3 text-center">
                    <div className="text-xs text-[#6B8576]">F1 Score</div>
                    <div className="text-xl font-extrabold text-[#163825] font-mono-data mt-1">
                      0.892
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanatory Callout */}
              <div className="p-3.5 bg-[#F9FCFA] border-l-3 border-[#1F6E43] rounded-r-xl text-xs text-[#3E5B4B] leading-relaxed">
                <span className="font-bold text-[#143624]">Optimization Target: </span>
                The current XGBoost implementation favors recall slightly over precision to minimize false negatives in critical heat stress areas, ensuring proactive municipal intervention planning.
              </div>
            </div>

            {/* Right Card: Feature Importance Top 5 (6 Col) */}
            <div
              id="feature-importance-card"
              className="lg:col-span-6 bg-white border border-[#D5E3DB] rounded-2xl p-6 shadow-sm space-y-5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#EAF2ED]">
                <span className="text-xs font-bold text-[#143624] uppercase tracking-wider">
                  FEATURE IMPORTANCE (TOP 5)
                </span>
                <span className="text-xs text-[#5D7769] font-mono">SHAP Attribution</span>
              </div>

              <div className="space-y-3.5 text-xs">
                {FEATURE_IMPORTANCE_LIST.map((feat, idx) => {
                  const barWidthPct = (feat.weight / 0.35) * 100;
                  const barColors = [
                    'bg-[#163825]',
                    'bg-[#1F6E43]',
                    'bg-[#4A7C59]',
                    'bg-[#7EA189]',
                    'bg-[#A4BFAD]',
                  ];

                  return (
                    <div key={feat.feature} className="space-y-1">
                      <div className="flex items-center justify-between text-[#2D4537] font-medium">
                        <span className="truncate">{feat.feature}</span>
                        <span className="font-mono font-bold text-[#143624]">{feat.weight.toFixed(2)}</span>
                      </div>
                      <div className="h-2.5 bg-[#F1F6F3] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColors[idx]}`}
                          style={{ width: `${barWidthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-[11px] text-[#6B8576] flex items-center justify-between">
                <span>Derived from 42,000 spatial multi-sensor training observations</span>
                <span className="font-mono font-bold text-[#164E35]">Σ = 0.93</span>
              </div>
            </div>

            {/* Bottom Card: Algorithm Comparison Matrix (12 Col Full Width) */}
            <div
              id="algorithm-comparison-card"
              className="lg:col-span-12 bg-white border border-[#D5E3DB] rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#EAF2ED]">
                <div>
                  <span className="text-xs font-bold text-[#143624] uppercase tracking-wider">
                    ALGORITHM COMPARISON MATRIX
                  </span>
                  <p className="text-xs text-[#5D7769] mt-0.5">
                    Benchmark evaluation against baseline models on held-out Chennai ground-truth datasets.
                  </p>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EAF2ED] text-[#6B8576] font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Model Type</th>
                      <th className="py-3 px-3">AUC</th>
                      <th className="py-3 px-3">F1 Score</th>
                      <th className="py-3 px-3">Inference Time</th>
                      <th className="py-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAF2ED]">
                    {MODEL_METRICS.map((row) => (
                      <tr
                        key={row.name}
                        className={`hover:bg-[#F9FCFA] transition-colors ${
                          row.status === 'Production' ? 'bg-[#F2F8F4]/60 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3.5 px-3 flex items-center gap-2 text-[#143624]">
                          {row.status === 'Production' && (
                            <CheckCircle2 className="w-4 h-4 text-[#1F6E43]" />
                          )}
                          <span>{row.name}</span>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[#183827]">
                          {row.auc.toFixed(3)}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[#183827]">
                          {row.f1.toFixed(3)}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[#587565]">
                          {row.inferenceTime}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                              row.status === 'Production'
                                ? 'bg-[#E5F2E9] border border-[#C6E2D0] text-[#164E35]'
                                : row.status === 'Challenger'
                                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                                : 'bg-gray-100 border border-gray-200 text-gray-600'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION D: Calibration, Validation & Verification FAQ */}
      <section className="bg-white border border-[#D5E3DB] rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#577263] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1F6E43]" />
          Calibration & Spatial Cross-Validation Standards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#4F6A5B]">
          <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#E2EBE5] space-y-1.5">
            <div className="font-bold text-[#143624]">K-Fold Spatial Block Validation</div>
            <p className="leading-relaxed">
              Spatial cross-validation uses spatial buffering (5km blocks) to prevent spatial autocorrelation leakage between training and validation folds.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#E2EBE5] space-y-1.5">
            <div className="font-bold text-[#143624]">Ground-Truth Sensor Alignment</div>
            <p className="leading-relaxed">
              Automated Weather Stations (AWS) from IMD and Chennai Smart City mesh are checked hourly against Landsat-9 TIRS thermal bands.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#E2EBE5] space-y-1.5">
            <div className="font-bold text-[#143624]">Algorithmic Drift Detection</div>
            <p className="leading-relaxed">
              Daily telemetry drift checks flag sensor calibration anomalies when residual errors exceed ±1.8°C over consecutive readings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
