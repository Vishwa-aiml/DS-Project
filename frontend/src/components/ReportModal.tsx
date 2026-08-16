import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { X, Download, Printer, CheckCircle, FileText, Sparkles, Building, Flame, Trees } from 'lucide-react';
import { CHENNAI_ZONES } from '../data/mockData';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('report-modal-content');
      if (element) {
        const canvas = await html2canvas(element, {
          scale: 2, // High resolution
          useCORS: true,
          backgroundColor: '#FFFFFF',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('THERMALENS_Briefing_Report.pdf');

        setDownloadSuccess(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#164E35', '#22C55E', '#F59E0B'],
        });
        setTimeout(() => setDownloadSuccess(false), 4000);
      }
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert(`Failed to generate PDF: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="report-modal-content"
        className="bg-white border border-[#D5E3DB] shadow-2xl rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EAF2ED] flex items-center justify-between bg-[#F7FAF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#164E35] text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#143624]">
                Urban Heat Vulnerability & Action Brief
              </h2>
              <div className="text-xs text-[#5D7769]">
                {selectedCity} · Assessment Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B8576] hover:bg-[#EAF2ED] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#354E40]">
          {/* Executive Summary Box */}
          <div className="p-4 bg-[#EAF5EE] border border-[#C6E2D0] rounded-xl space-y-2">
            <div className="font-bold text-sm text-[#143624] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1F6E43]" />
              Executive Climate Summary
            </div>
            <p className="leading-relaxed text-[#2C4435]">
              Urban heat loads in northern industrial zones have exceeded safe physiological thresholds for 4 consecutive diurnal cycles. Immediate emergency hydration deployment and cool-roof retrofitting are prioritized for industrial census tracts.
            </p>
          </div>

          {/* Critical Zones Quick Table */}
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[11px] text-[#577263]">
              Critical Priority Census Tracts
            </div>
            <div className="border border-[#E2EBE5] rounded-xl overflow-hidden divide-y divide-[#EAF2ED]">
              {CHENNAI_ZONES.slice(0, 4).map((z) => (
                <div key={z.id} className="p-2.5 flex items-center justify-between bg-[#FDFEFE]">
                  <div>
                    <span className="font-bold text-[#143624] mr-2">{z.id}</span>
                    <span className="text-[#5B7767]">{z.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-red-600 font-bold">LST: {z.lstTemp}°C</span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">
                      Risk: {z.trendValue || z.riskScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Checklist */}
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[11px] text-[#577263]">
              Recommended Immediate Interventions
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 p-2 bg-[#F9FCFA] border border-[#E2EBE5] rounded-lg">
                <CheckCircle className="w-4 h-4 text-[#1F6E43] shrink-0" />
                <span>Activate emergency cooling & hydration centers across Zone G143 & G201 transport hubs.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#F9FCFA] border border-[#E2EBE5] rounded-lg">
                <CheckCircle className="w-4 h-4 text-[#1F6E43] shrink-0" />
                <span>Enforce outdoor construction labor recess during peak thermal window (12:00 – 15:30).</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#F9FCFA] border border-[#E2EBE5] rounded-lg">
                <CheckCircle className="w-4 h-4 text-[#1F6E43] shrink-0" />
                <span>Deploy high-albedo road surface misting tankers along Royapuram coastal arterial.</span>
              </div>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-center">
              ✓ Report downloaded successfully as THERMALENS_Briefing_Report.pdf
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div data-html2canvas-ignore="true" className="p-4 border-t border-[#EAF2ED] bg-[#F7FAF8] flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-semibold text-[#3E5547] hover:bg-[#EAF2ED] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sheet</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#5B7767] hover:bg-[#EAF2ED] rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="px-5 py-2 text-xs font-bold bg-[#164E35] hover:bg-[#113E2A] text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Download Brief PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
