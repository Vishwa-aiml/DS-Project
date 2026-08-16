/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MainTab, ZoneData } from './types';
import { CHENNAI_ZONES } from './data/mockData';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { ExploreView } from './components/ExploreView';
import { ForecastView } from './components/ForecastView';
import { AnalyticsView } from './components/AnalyticsView';
import { PriorityView } from './components/PriorityView';
import { MethodologyView } from './components/MethodologyView';
import { ReportModal } from './components/ReportModal';
import { FullBriefModal } from './components/FullBriefModal';
import { SettingsModal } from './components/SettingsModal';
import { AlertsDrawer } from './components/AlertsDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('overview');
  const [zones, setZones] = useState<ZoneData[]>(CHENNAI_ZONES);
  const [selectedZone, setSelectedZone] = useState<ZoneData>(CHENNAI_ZONES[0]);
  const [selectedCity, setSelectedCity] = useState<string>('Chennai Metropolitan Area');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  // Modals & Drawers
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFullBriefModalOpen, setIsFullBriefModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);

  useEffect(() => {
    // Attempt to fetch grid data from backend API
    fetch('http://localhost:8000/api/v1/grid')
      .then(res => res.json())
      .then(data => {
        console.log('Successfully fetched grid data from backend API');
        if (data.features && data.features.length > 0) {
          // Map GeoJSON properties to ZoneData
          const mappedZones: ZoneData[] = data.features.map((feature: any) => {
            const props = feature.properties;
            const gridId = feature.id || props.grid_id;
            
            // Get centroid of the polygon for the marker/circle
            // Simple centroid calculation based on bounding box
            const coords = feature.geometry.coordinates[0];
            const lats = coords.map((c: any) => c[1]);
            const lngs = coords.map((c: any) => c[0]);
            const lat = (Math.min(...lats) + Math.max(...lats)) / 2;
            const lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
            
            return {
              id: gridId,
              code: gridId,
              name: `Grid Cell ${gridId}`,
              sector: 'Chennai Grid',
              riskScore: props.baseline_risk_score || 0,
              riskCategory: (props.baseline_risk_score || 0) > 80 ? 'Critical' : 'Moderate',
              airTemp: props.temperature_c,
              lstTemp: props.lst_c,
              humidity: props.humidity_pct,
              windSpeed: props.wind_speed_ms,
              demographicRisk: 50, // mock
              infrastructureIndex: 50, // mock
              greenCoverPct: Math.max(0, props.ndvi * 100),
              populationDensity: props.vulnerability_index * 200, // mock mapping
              builtUpDensity: props.ndbi * 100,
              meanLst: props.lst_c,
              ndviScore: props.ndvi,
              trend: 'stable',
              popExposureScore: 50,
              coordinates: { x: 0, y: 0 },
              lat: lat,
              lng: lng,
              radius: 500, // smaller radius for 1km grid
              contributors: {
                lst: 30, humidity: 20, albedoDeficiency: 20, vegetationLack: 20, other: 10
              },
              geoJsonPolygon: feature // Keep the raw feature for the map
            };
          });
          setZones(mappedZones);
          setSelectedZone(mappedZones[0]);
        }
      })
      .catch(err => {
        console.warn('Backend API not reachable. Using mock data. Ensure FastAPI is running.', err);
      });
  }, []);

  const handleSelectZone = async (zone: ZoneData) => {
    setSelectedZone(zone);

    // If we haven't reverse-geocoded this zone yet, do it on demand
    if (zone.name.startsWith('Grid Cell')) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${zone.lat}&lon=${zone.lng}&zoom=14`);
        const data = await res.json();
        
        let realName = zone.name;
        if (data && data.address) {
          const addr = data.address;
          realName = addr.suburb || addr.neighbourhood || addr.city_district || addr.town || addr.village || addr.county || zone.name;
        } else if (data && data.name) {
          realName = data.name;
        }

        if (realName !== zone.name) {
          const updatedZone = { ...zone, name: realName };
          setSelectedZone(updatedZone);
          setZones(prev => prev.map(z => z.id === zone.id ? updatedZone : z));
        }
      } catch (err) {
        console.error("Failed to reverse geocode", err);
      }
    }
  };

  const handleExploreZone = (zone: ZoneData) => {
    handleSelectZone(zone);
    setActiveTab('explore');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F8F4] text-[#1E293B]">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
        unreadAlertsCount={3}
        onOpenAlerts={() => setIsAlertsDrawerOpen(true)}
      />

      {/* Main Content Area Container */}
      <main className="flex-1 px-4 md:px-8 pt-6">
        {activeTab === 'overview' && (
          <OverviewView
            zones={zones}
            onNavigate={setActiveTab}
            onSelectZone={handleSelectZone}
            selectedZone={selectedZone}
            selectedCity={selectedCity}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            zones={zones}
            selectedZone={selectedZone}
            onSelectZone={handleSelectZone}
            onOpenReport={() => setIsReportModalOpen(true)}
            onOpenMethodology={() => setActiveTab('methodology')}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastView
            selectedZone={selectedZone}
            onOpenFullBrief={() => setIsFullBriefModalOpen(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView zones={zones} />
        )}

        {activeTab === 'priority' && (
          <PriorityView
            selectedZone={selectedZone}
            onSelectZone={handleSelectZone}
            onExploreZone={handleExploreZone}
          />
        )}

        {activeTab === 'methodology' && (
          <MethodologyView />
        )}
      </main>

      {/* Report Generation Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        selectedCity={selectedCity}
      />

      {/* Full AI Heat Narrative Brief Modal */}
      <FullBriefModal
        isOpen={isFullBriefModalOpen}
        onClose={() => setIsFullBriefModalOpen(false)}
      />

      {/* Configuration Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        tempUnit={tempUnit}
        onTempUnitChange={setTempUnit}
      />

      {/* Active Heat Advisories Drawer */}
      <AlertsDrawer
        isOpen={isAlertsDrawerOpen}
        onClose={() => setIsAlertsDrawerOpen(false)}
        onSelectZone={(zone) => {
          handleSelectZone(zone);
          setActiveTab('explore');
        }}
      />
    </div>
  );
}
