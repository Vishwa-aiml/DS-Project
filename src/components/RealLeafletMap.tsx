import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ZoneData, MapLayerType } from '../types';
import { 
  Layers, 
  Map as MapIcon, 
  Satellite, 
  Navigation, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  Thermometer,
  ShieldAlert,
  Trees,
  Users
} from 'lucide-react';

interface RealLeafletMapProps {
  zones: ZoneData[];
  selectedZone: ZoneData | null;
  onSelectZone: (zone: ZoneData) => void;
  activeLayer: MapLayerType;
  onLayerChange: (layer: MapLayerType) => void;
}

type TileSource = 'satellite' | 'streets' | 'light' | 'dark';

export const RealLeafletMap: React.FC<RealLeafletMapProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  activeLayer,
  onLayerChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [tileSource, setTileSource] = useState<TileSource>('satellite');
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Helper to get color according to active layer
  const getZoneColor = (zone: ZoneData, layer: MapLayerType): string => {
    switch (layer) {
      case 'lst':
        if (zone.lstTemp >= 46) return '#DC2626'; // Deep Red
        if (zone.lstTemp >= 43) return '#EA580C'; // Orange
        if (zone.lstTemp >= 40) return '#D97706'; // Amber
        if (zone.lstTemp >= 37) return '#CA8A04'; // Yellow
        return '#16A34A'; // Green
      case 'temperature':
        if (zone.airTemp >= 38.5) return '#DC2626';
        if (zone.airTemp >= 37.0) return '#EA580C';
        if (zone.airTemp >= 35.5) return '#D97706';
        return '#16A34A';
      case 'ndvi':
        if (zone.ndviScore < 0.18) return '#DC2626'; // Very low vegetation (High risk)
        if (zone.ndviScore < 0.25) return '#EA580C';
        if (zone.ndviScore < 0.40) return '#EAB308';
        return '#16A34A'; // High vegetation
      case 'population-density':
        if (zone.populationDensity > 22000) return '#7C3AED'; // High density purple
        if (zone.populationDensity > 17000) return '#DC2626';
        if (zone.populationDensity > 13000) return '#EA580C';
        return '#2563EB';
      case 'heat-risk':
      default:
        if (zone.riskScore >= 85) return '#DC2626';
        if (zone.riskScore >= 75) return '#EA580C';
        if (zone.riskScore >= 65) return '#D97706';
        return '#16A34A';
    }
  };

  const getMetricDisplay = (zone: ZoneData, layer: MapLayerType) => {
    switch (layer) {
      case 'lst':
        return `${zone.lstTemp}°C LST`;
      case 'temperature':
        return `${zone.airTemp}°C Air`;
      case 'ndvi':
        return `${zone.ndviScore.toFixed(2)} NDVI`;
      case 'population-density':
        return `${(zone.populationDensity / 1000).toFixed(1)}k/km²`;
      case 'heat-risk':
      default:
        return `Risk ${zone.riskScore}`;
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Chennai Metropolitan Area
    const map = L.map(mapContainerRef.current, {
      center: [13.0827, 80.2500],
      zoom: 11.5,
      zoomControl: false,
      attributionControl: false,
    });

    // Add Attribution in bottom right with minimal styling
    L.control
      .attribution({
        position: 'bottomright',
        prefix: '<span class="text-[10px] text-gray-500 font-mono">© OpenStreetMap · ESRI Satellite</span>',
      })
      .addTo(map);

    map.on('mousemove', (e) => {
      setMouseCoords({
        lat: Number(e.latlng.lat.toFixed(4)),
        lng: Number(e.latlng.lng.toFixed(4)),
      });
    });

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = '';
    let maxZoom = 19;

    switch (tileSource) {
      case 'satellite':
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        break;
      case 'streets':
        url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        break;
      case 'light':
        url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
        break;
      case 'dark':
        url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        break;
    }

    const newTileLayer = L.tileLayer(url, {
      maxZoom,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [tileSource]);

  // Render Overlays (Circles, Zones, Markers)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    zones.forEach((zone) => {
      const isSelected = selectedZone?.id === zone.id;
      const color = getZoneColor(zone, activeLayer);
      const radius = zone.radius || 1600;

      // 1. Outer Thermal Buffer Circle
      const circle = L.circle([zone.lat, zone.lng], {
        radius: isSelected ? radius * 1.15 : radius,
        color: color,
        weight: isSelected ? 3 : 1.5,
        opacity: 0.9,
        fillColor: color,
        fillOpacity: isSelected ? 0.45 : 0.28,
        className: isSelected ? 'leaflet-zone-selected pulse-animation' : 'leaflet-zone',
      });

      circle.on('click', () => {
        onSelectZone(zone);
      });

      circle.bindTooltip(
        `<div class="p-1 font-sans text-xs">
          <div class="font-bold text-gray-900">${zone.id} · ${zone.name}</div>
          <div class="text-gray-600 mt-0.5">${getMetricDisplay(zone, activeLayer)}</div>
        </div>`,
        { direction: 'top', offset: [0, -10], opacity: 0.95 }
      );

      layerGroup.addLayer(circle);

      // 2. Custom Rich Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: translate(-50%, -50%);
            cursor: pointer;
          ">
            <div style="
              background: ${isSelected ? '#143624' : 'white'};
              color: ${isSelected ? '#FFFFFF' : '#143624'};
              border: 2px solid ${color};
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              padding: 3px 7px;
              border-radius: 8px;
              font-family: monospace;
              font-weight: 800;
              font-size: 11px;
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: ${color}; display: inline-block;"></span>
              <span>${zone.id}</span>
              <span style="opacity: 0.75; font-size: 10px;">${getMetricDisplay(zone, activeLayer).split(' ')[0]}</span>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 6px solid ${isSelected ? '#143624' : color};
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([zone.lat, zone.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectZone(zone);
      });

      layerGroup.addLayer(marker);
    });
  }, [zones, selectedZone, activeLayer, onSelectZone]);

  // Pan to selected zone when changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedZone) return;

    map.flyTo([selectedZone.lat, selectedZone.lng], 13, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [selectedZone]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([13.0827, 80.2500], 11.5, { duration: 1.0 });
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#D5E3DB] shadow-sm bg-[#0B1510] flex flex-col">
      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Mode Switcher Pill */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#D5E3DB] shadow-md rounded-xl p-1 flex items-center gap-1 text-xs">
          <button
            onClick={() => onLayerChange('heat-risk')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayer === 'heat-risk'
                ? 'bg-[#164E35] text-white shadow-2xs'
                : 'text-[#3E5547] hover:bg-[#F0F5F2]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Heat Risk</span>
          </button>

          <button
            onClick={() => onLayerChange('lst')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayer === 'lst'
                ? 'bg-[#164E35] text-white shadow-2xs'
                : 'text-[#3E5547] hover:bg-[#F0F5F2]'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>LST (°C)</span>
          </button>

          <button
            onClick={() => onLayerChange('ndvi')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayer === 'ndvi'
                ? 'bg-[#164E35] text-white shadow-2xs'
                : 'text-[#3E5547] hover:bg-[#F0F5F2]'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>NDVI Cover</span>
          </button>

          <button
            onClick={() => onLayerChange('population-density')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayer === 'population-density'
                ? 'bg-[#164E35] text-white shadow-2xs'
                : 'text-[#3E5547] hover:bg-[#F0F5F2]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Pop Density</span>
          </button>
        </div>

        {/* Free Map Tile Provider Switcher */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#D5E3DB] shadow-md rounded-xl p-1 flex items-center gap-1 text-xs">
          <button
            onClick={() => setTileSource('satellite')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              tileSource === 'satellite'
                ? 'bg-[#164E35] text-white'
                : 'text-[#476051] hover:bg-[#F0F5F2]'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Satellite</span>
          </button>

          <button
            onClick={() => setTileSource('streets')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              tileSource === 'streets'
                ? 'bg-[#164E35] text-white'
                : 'text-[#476051] hover:bg-[#F0F5F2]'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Streets</span>
          </button>

          <button
            onClick={() => setTileSource('light')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              tileSource === 'light'
                ? 'bg-[#164E35] text-white'
                : 'text-[#476051] hover:bg-[#F0F5F2]'
            }`}
          >
            Light
          </button>

          <button
            onClick={() => setTileSource('dark')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              tileSource === 'dark'
                ? 'bg-[#164E35] text-white'
                : 'text-[#476051] hover:bg-[#F0F5F2]'
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Actual Leaflet Map Canvas Target */}
      <div ref={mapContainerRef} className="w-full flex-1 z-10" />

      {/* Floating Map Navigation Controls (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md border border-[#D5E3DB] shadow-md rounded-xl p-1">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded-lg text-[#164E35] hover:bg-[#EBF3EE] transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded-lg text-[#164E35] hover:bg-[#EBF3EE] transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-px bg-[#E2EBE5] my-0.5" />
        <button
          onClick={handleResetView}
          title="Reset to Chennai Metropolitan Center"
          className="p-2 rounded-lg text-[#164E35] hover:bg-[#EBF3EE] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Right Live Telemetry & Legend Box */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col items-end gap-2 pointer-events-none">
        {/* Dynamic Gradient Legend */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#D5E3DB] shadow-md rounded-xl p-3 text-xs space-y-1.5 max-w-xs">
          <div className="flex items-center justify-between font-bold text-[#143624]">
            <span className="capitalize">{activeLayer.replace('-', ' ')} Spectrum</span>
            <span className="font-mono text-[10px] text-[#557262]">Free Live Tiles</span>
          </div>

          <div className="h-2 w-48 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-600" />

          <div className="flex items-center justify-between text-[10px] text-[#6B8576] font-mono">
            <span>Low Risk / Safe</span>
            <span>Critical Hotspot</span>
          </div>
        </div>

        {/* Live Cursor Coordinate Pill */}
        {mouseCoords && (
          <div className="bg-[#143624]/90 backdrop-blur-md text-emerald-300 font-mono text-[11px] px-3 py-1 rounded-lg border border-emerald-800 shadow-md">
            {mouseCoords.lat}°N, {mouseCoords.lng}°E
          </div>
        )}
      </div>
    </div>
  );
};
