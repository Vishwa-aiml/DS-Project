import React, { useState } from 'react';
import { X, Sliders, Thermometer, RefreshCw, Bell, Shield } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempUnit: 'C' | 'F';
  onTempUnitChange: (unit: 'C' | 'F') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  tempUnit,
  onTempUnitChange,
}) => {
  const [refreshInterval, setRefreshInterval] = useState('15m');
  const [criticalThreshold, setCriticalThreshold] = useState('80');
  const [demoMode, setDemoMode] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#D5E3DB] shadow-2xl rounded-2xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAF2ED]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF5EE] text-[#164E35] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-[#143624]">
              Platform Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B8576] hover:bg-[#F1F6F3] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Temperature Units */}
          <div className="flex items-center justify-between p-3 bg-[#F9FCFA] border border-[#E2EBE5] rounded-xl">
            <div>
              <div className="font-bold text-[#143624]">Temperature Unit</div>
              <div className="text-[#6B8576]">Display units across all screens</div>
            </div>
            <div className="flex bg-[#EAF2ED] p-0.5 rounded-lg">
              <button
                onClick={() => onTempUnitChange('C')}
                className={`px-3 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  tempUnit === 'C' ? 'bg-[#164E35] text-white shadow-2xs' : 'text-[#476051]'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => onTempUnitChange('F')}
                className={`px-3 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                  tempUnit === 'F' ? 'bg-[#164E35] text-white shadow-2xs' : 'text-[#476051]'
                }`}
              >
                °F
              </button>
            </div>
          </div>

          {/* Telemetry Ingestion Frequency */}
          <div className="flex items-center justify-between p-3 bg-[#F9FCFA] border border-[#E2EBE5] rounded-xl">
            <div>
              <div className="font-bold text-[#143624]">Telemetry Polling</div>
              <div className="text-[#6B8576]">Automatic sensor synchronization</div>
            </div>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="bg-white border border-[#D5E3DB] rounded-lg px-2.5 py-1 font-mono font-medium text-[#143624]"
            >
              <option value="5m">5 minutes</option>
              <option value="15m">15 minutes (Default)</option>
              <option value="1h">1 hour</option>
            </select>
          </div>

          {/* Critical Risk Alarm Threshold */}
          <div className="flex items-center justify-between p-3 bg-[#F9FCFA] border border-[#E2EBE5] rounded-xl">
            <div>
              <div className="font-bold text-[#143624]">Critical Alert Threshold</div>
              <div className="text-[#6B8576]">Trigger immediate municipality warnings</div>
            </div>
            <input
              type="number"
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(e.target.value)}
              className="w-16 bg-white border border-[#D5E3DB] rounded-lg px-2 py-1 font-mono font-bold text-center text-[#143624]"
              min="50"
              max="95"
            />
          </div>

          {/* Demo Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#F9FCFA] border border-[#E2EBE5] rounded-xl">
            <div>
              <div className="font-bold text-[#143624]">Demo Simulation Engine</div>
              <div className="text-[#6B8576]">Simulate continuous diurnal micro-flux</div>
            </div>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                demoMode ? 'bg-[#164E35]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block w-4 h-4 bg-white rounded-full transition-transform transform ${
                  demoMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#164E35] hover:bg-[#113E2A] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
