/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  const [selectedZone, setSelectedZone] = useState<ZoneData>(CHENNAI_ZONES[0]);
  const [selectedCity, setSelectedCity] = useState<string>('Chennai Metropolitan Area');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  // Modals & Drawers
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFullBriefModalOpen, setIsFullBriefModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);

  const handleSelectZone = (zone: ZoneData) => {
    setSelectedZone(zone);
  };

  const handleExploreZone = (zone: ZoneData) => {
    setSelectedZone(zone);
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
            onNavigate={setActiveTab}
            onSelectZone={handleSelectZone}
            selectedZone={selectedZone}
            selectedCity={selectedCity}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            selectedZone={selectedZone}
            onSelectZone={handleSelectZone}
            onOpenReport={() => setIsReportModalOpen(true)}
            onOpenMethodology={() => setActiveTab('methodology')}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastView
            onOpenFullBrief={() => setIsFullBriefModalOpen(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView />
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
