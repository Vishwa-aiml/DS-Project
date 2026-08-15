import React, { useState } from 'react';
import { CHENNAI_ZONES } from '../data/mockData';
import { ZoneData, MapLayerType } from '../types';
import { Plus, Minus, Layers, Maximize2, ShieldAlert, Thermometer, Wind, Droplets, Info } from 'lucide-react';

interface MapComponentProps {
  selectedZone: ZoneData | null;
  onSelectZone: (zone: ZoneData) => void;
  activeLayer?: MapLayerType;
  isHeroPreview?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  selectedZone,
  onSelectZone,
  activeLayer = 'heat-risk',
  isHeroPreview = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredZone, setHoveredZone] = useState<ZoneData | null>(null);

  // Generate hexagonal honeycomb cells
  const hexCells = [
    // Core critical heat cluster (Zone G143 & G201)
    { id: 'hex-1', q: 0, r: 0, x: 420, y: 190, temp: 47.2, risk: 94, color: '#DC2626', zone: 'G143' },
    { id: 'hex-2', q: 1, r: -1, x: 470, y: 190, temp: 46.5, risk: 91, color: '#E11D48', zone: 'G201' },
    { id: 'hex-3', q: -1, r: 1, x: 370, y: 190, temp: 45.8, risk: 89, color: '#EF4444', zone: 'G143' },
    { id: 'hex-4', q: 0, r: -1, x: 445, y: 147, temp: 46.8, risk: 92, color: '#DC2626', zone: 'G201' },
    { id: 'hex-5', q: 0, r: 1, x: 395, y: 233, temp: 45.2, risk: 88, color: '#F97316', zone: 'H310' },
    { id: 'hex-6', q: -1, r: 0, x: 345, y: 233, temp: 44.5, risk: 85, color: '#F97316', zone: 'H310' },
    { id: 'hex-7', q: 1, r: 0, x: 495, y: 233, temp: 44.1, risk: 84, color: '#F59E0B', zone: 'F092' },
    // Outer high/moderate heat ring
    { id: 'hex-8', q: 1, r: 1, x: 470, y: 276, temp: 42.8, risk: 82, color: '#F59E0B', zone: 'C011' },
    { id: 'hex-9', q: 0, r: 2, x: 420, y: 319, temp: 41.9, risk: 78, color: '#FBBF24', zone: 'C011' },
    { id: 'hex-10', q: -1, r: 2, x: 370, y: 319, temp: 40.5, risk: 74, color: '#FCD34D', zone: 'M105' },
    { id: 'hex-11', q: -2, r: 2, x: 320, y: 319, temp: 39.8, risk: 70, color: '#EAB308', zone: 'M105' },
    { id: 'hex-12', q: -2, r: 1, x: 295, y: 276, temp: 39.2, risk: 68, color: '#84CC16', zone: 'N018' },
    { id: 'hex-13', q: -2, r: 0, x: 270, y: 233, temp: 38.6, risk: 65, color: '#84CC16', zone: 'N018' },
    { id: 'hex-14', q: -1, r: -1, x: 395, y: 104, temp: 42.1, risk: 79, color: '#F59E0B', zone: 'G201' },
    { id: 'hex-15', q: 1, r: -2, x: 495, y: 104, temp: 41.4, risk: 76, color: '#FBBF24', zone: 'G201' },
    { id: 'hex-16', q: 2, r: -2, x: 545, y: 147, temp: 40.8, risk: 73, color: '#FBBF24', zone: 'F092' },
    { id: 'hex-17', q: 2, r: -1, x: 570, y: 190, temp: 40.2, risk: 71, color: '#EAB308', zone: 'F092' },
    { id: 'hex-18', q: 2, r: 0, x: 545, y: 233, temp: 39.5, risk: 69, color: '#EAB308', zone: 'F092' },
    // Outer green/cooler zone boundary (South / Adyar / Parks)
    { id: 'hex-19', q: 0, r: 3, x: 445, y: 362, temp: 37.4, risk: 60, color: '#22C55E', zone: 'T044' },
    { id: 'hex-20', q: 1, r: 2, x: 495, y: 319, temp: 38.0, risk: 64, color: '#84CC16', zone: 'T044' },
    { id: 'hex-21', q: -1, r: 3, x: 395, y: 405, temp: 36.8, risk: 56, color: '#22C55E', zone: 'A042' },
    { id: 'hex-22', q: 0, r: 4, x: 470, y: 448, temp: 35.2, risk: 51, color: '#16A34A', zone: 'A042' },
    { id: 'hex-23', q: 1, r: 3, x: 520, y: 405, temp: 35.8, risk: 53, color: '#22C55E', zone: 'A042' },
  ];

  const getHexPoints = (cx: number, cy: number, r: number = 28) => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  const getLayerFill = (cell: typeof hexCells[0]) => {
    if (activeLayer === 'temperature') {
      if (cell.temp >= 45) return '#DC2626';
      if (cell.temp >= 42) return '#F97316';
      if (cell.temp >= 39) return '#EAB308';
      return '#22C55E';
    }
    if (activeLayer === 'ndvi') {
      if (cell.risk > 85) return '#D97706'; // Low veg
      if (cell.risk > 70) return '#CA8A04';
      return '#15803D'; // High veg
    }
    if (activeLayer === 'population-density') {
      if (cell.zone === 'F092' || cell.zone === 'T044') return '#7C3AED';
      if (cell.zone === 'G143' || cell.zone === 'C011') return '#9333EA';
      return '#A855F7';
    }
    // Default: heat risk
    return cell.color;
  };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#E8F0EA] rounded-xl overflow-hidden border border-[#D5E3DB] select-none flex flex-col justify-between">
      {/* Map SVG Canvas */}
      <div className="relative w-full h-full flex-1 overflow-hidden">
        <svg
          viewBox="180 50 480 430"
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Map Base / Landmass */}
          <rect x="150" y="30" width="550" height="500" fill="#EAF3EC" />

          {/* Ocean / Bay of Bengal on East */}
          <path
            d="M 570 30 C 585 100, 595 180, 605 260 C 615 340, 625 420, 640 500 L 720 500 L 720 30 Z"
            fill="#CFE6F5"
            stroke="#B5D7EC"
            strokeWidth="1.5"
          />

          {/* Coastline Label */}
          <text x="635" y="240" fill="#6B9CB8" fontSize="11" fontWeight="600" letterSpacing="2" className="select-none font-sans" transform="rotate(82 635 240)">
            BAY OF BENGAL
          </text>

          {/* Adyar & Cooum Rivers */}
          <path
            d="M 200 290 Q 320 280, 420 300 T 520 310 T 605 305"
            fill="none"
            stroke="#A7D4EC"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <text x="250" y="280" fill="#75A4BE" fontSize="8" fontStyle="italic">Cooum River</text>

          <path
            d="M 220 420 Q 360 410, 470 430 T 550 450 T 618 460"
            fill="none"
            stroke="#A7D4EC"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="320" y="415" fill="#75A4BE" fontSize="8" fontStyle="italic">Adyar River</text>

          {/* Major Roads & Corridors (Grey subtle lines) */}
          <path d="M 230 180 L 590 180" stroke="#CBDDD3" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M 210 240 L 600 250" stroke="#CBDDD3" strokeWidth="2.5" />
          <path d="M 240 360 L 610 380" stroke="#CBDDD3" strokeWidth="2" />
          <path d="M 430 70 L 430 480" stroke="#CBDDD3" strokeWidth="2.5" />
          <path d="M 520 80 L 550 480" stroke="#CBDDD3" strokeWidth="2" strokeDasharray="4 2" />
          <path d="M 330 110 L 370 480" stroke="#CBDDD3" strokeWidth="2" />

          {/* Key Geographic Landmark Labels */}
          <g className="text-gray-500 text-[9px] font-sans font-medium select-none pointer-events-none">
            <text x="370" y="115" fill="#4B6655" fontWeight="600">Madhavaram Bus Depot</text>
            <text x="440" y="85" fill="#2E7D32" fontWeight="600">Botanical Garden</text>
            <text x="460" y="145" fill="#4B6655">PERAMBUR</text>
            <text x="540" y="125" fill="#4B6655" fontWeight="600">ROYAPURAM</text>
            <text x="560" y="110" fill="#2563EB" fontSize="8">N4 Beach</text>
            <text x="340" y="325" fill="#4B6655">ANNA NAGAR</text>
            <text x="450" y="270" fill="#14432A" fontSize="14" fontWeight="800" letterSpacing="0.5">Chennai</text>
            <text x="450" y="286" fill="#14432A" fontSize="11" fontWeight="700">சென்னை</text>
            <text x="440" y="305" fill="#64748B" fontSize="8">EGMORE</text>
            <text x="260" y="375" fill="#4B6655">KOYAMBEDU</text>
            <text x="420" y="380" fill="#4B6655" fontWeight="600">T. NAGAR</text>
            <text x="490" y="445" fill="#4B6655">ADYAR</text>
            <text x="575" y="340" fill="#0D9488" fontSize="8" fontWeight="600">Marina Beach</text>
            <text x="530" y="475" fill="#4B6655">THIRUVANMIYUR</text>
          </g>

          {/* Hexagonal Heat Cells Layer */}
          <g id="heatmap-hex-grid">
            {hexCells.map((cell) => {
              const zoneData = CHENNAI_ZONES.find((z) => z.id === cell.zone);
              const isSelected = selectedZone?.id === cell.zone;
              const isHovered = hoveredZone?.id === cell.zone;
              const fill = getLayerFill(cell);

              return (
                <polygon
                  key={cell.id}
                  id={`hex-cell-${cell.id}`}
                  points={getHexPoints(cell.x, cell.y, 29)}
                  fill={fill}
                  fillOpacity={isSelected || isHovered ? 0.85 : 0.65}
                  stroke={isSelected ? '#14432A' : '#FFFFFF'}
                  strokeWidth={isSelected ? 3 : 1.2}
                  className="cursor-pointer transition-all duration-200 hover:fill-opacity-90"
                  onClick={() => {
                    if (zoneData) onSelectZone(zoneData);
                  }}
                  onMouseEnter={() => {
                    if (zoneData) setHoveredZone(zoneData);
                  }}
                  onMouseLeave={() => setHoveredZone(null)}
                />
              );
            })}
          </g>

          {/* Hotspot Target Markers / Critical Beacon on Zone G143 */}
          <g id="critical-hotspot-markers">
            {/* Zone G143 Pulsing Beacon */}
            <circle cx="420" cy="190" r="18" fill="none" stroke="#DC2626" strokeWidth="1.5" className="animate-ping opacity-75 origin-center" />
            <circle cx="420" cy="190" r="6" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="420" cy="190" r="2" fill="#FFFFFF" />

            {/* Zone G201 Beacon */}
            <circle cx="470" cy="190" r="4.5" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Zone H310 Beacon */}
            <circle cx="395" cy="233" r="4.5" fill="#EA580C" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Zone T044 Beacon */}
            <circle cx="445" cy="362" r="4.5" fill="#D97706" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredZone && (
          <div
            id="map-hover-tooltip"
            className="absolute top-4 left-4 pointer-events-none bg-white/95 backdrop-blur-sm border border-[#CDE0D5] shadow-lg rounded-lg p-2.5 z-30 transition-all text-xs"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-[#14432A]">{hoveredZone.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                hoveredZone.riskCategory === 'Critical'
                  ? 'bg-red-100 text-red-700'
                  : hoveredZone.riskCategory === 'High'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {hoveredZone.riskCategory} ({hoveredZone.riskScore}/100)
              </span>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-2 text-[#4B6655]">
              <div>Air Temp: <span className="font-semibold text-slate-800">{hoveredZone.airTemp}°C</span></div>
              <div>LST: <span className="font-semibold text-red-600">{hoveredZone.lstTemp}°C</span></div>
              <div>Humidity: <span className="font-semibold text-slate-800">{hoveredZone.humidity}%</span></div>
              <div>Green Cover: <span className="font-semibold text-slate-800">{hoveredZone.greenCoverPct}%</span></div>
            </div>
          </div>
        )}

        {/* Map Zoom Controls */}
        <div id="map-zoom-controls" className="absolute bottom-4 right-4 flex flex-col bg-white/90 backdrop-blur-sm border border-[#CDE0D5] rounded-lg shadow-sm overflow-hidden z-20">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
            className="p-2 hover:bg-[#EAF5EE] text-[#2C4A37] border-b border-[#DDECE3] transition-colors cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="p-2 hover:bg-[#EAF5EE] text-[#2C4A37] transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Legend Footer Bar */}
      <div id="map-legend-footer" className="bg-white/90 backdrop-blur-md border-t border-[#DDECE3] px-3.5 py-2 flex items-center justify-between text-xs text-[#526D5E]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#233F2E]">Vulnerability Index:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-500">Low</span>
            <div className="w-24 sm:w-32 h-2.5 rounded-full bg-gradient-to-r from-[#22C55E] via-[#FBBF24] via-[#F97316] to-[#DC2626]" />
            <span className="text-[11px] text-gray-500 font-semibold text-red-600">High (Critical)</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600" /> &gt;45°C LST
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" /> Green Sink
          </span>
        </div>
      </div>
    </div>
  );
};
