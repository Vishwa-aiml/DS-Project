import React from 'react';
import { X, AlertTriangle, Flame, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CHENNAI_ZONES } from '../data/mockData';
import { ZoneData } from '../types';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectZone: (zone: ZoneData) => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectZone,
}) => {
  if (!isOpen) return null;

  const criticalAlerts = [
    {
      id: 'alt-1',
      zoneId: 'G143',
      title: 'Zone G143 - Critical Heat Stress',
      severity: 'Level 3 Emergency',
      time: '12 mins ago',
      desc: 'Land Surface Temp recorded at 46.2°C with high solar radiation flux across northern industrial cluster.',
    },
    {
      id: 'alt-2',
      zoneId: 'G201',
      title: 'Zone G201 - Thermal Envelope Spike',
      severity: 'Level 3 Emergency',
      time: '28 mins ago',
      desc: 'Sustained thermal trap identified in Ennore Port corridor. Emergency worker hydration advisory issued.',
    },
    {
      id: 'alt-3',
      zoneId: 'H310',
      title: 'Zone H310 - Transit Asphalt Saturation',
      severity: 'Level 2 Warning',
      time: '1 hour ago',
      desc: 'Madhavaram transport terminal asphalt heat index exceeding normal cooling buffer by +5.2°C.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border-l border-[#D5E3DB] shadow-2xl h-full flex flex-col p-6 space-y-5 animate-in slide-in-from-right-8 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAF2ED]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#143624]">
                Active Heat Advisories
              </h2>
              <div className="text-xs text-[#5D7769]">
                Chennai Metropolitan Area · 3 Urgent Alerts
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B8576] hover:bg-[#F1F6F3] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {criticalAlerts.map((alert) => {
            const matchedZone = CHENNAI_ZONES.find((z) => z.id === alert.zoneId);

            return (
              <div
                key={alert.id}
                className="p-4 rounded-xl bg-red-50/60 border border-red-200 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-red-800 text-sm">{alert.title}</span>
                  <span className="font-mono text-[10px] text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded">
                    {alert.time}
                  </span>
                </div>

                <p className="text-red-900 leading-relaxed font-normal">
                  {alert.desc}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-red-700">{alert.severity}</span>
                  {matchedZone && (
                    <button
                      onClick={() => {
                        onSelectZone(matchedZone);
                        onClose();
                      }}
                      className="text-xs font-bold text-[#164E35] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect Zone</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#EAF2ED]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#F1F6F3] hover:bg-[#E3EEE7] text-[#164E35] font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Mark All as Reviewed
          </button>
        </div>
      </div>
    </div>
  );
};
