import React, { useState } from 'react';
import { MainTab } from '../types';
import { Logo } from './Logo';
import { MapPin, Settings, Bell, ChevronDown, Check, Sparkles, ExternalLink, ShieldCheck, Thermometer, Sliders } from 'lucide-react';

interface HeaderProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  onOpenSettings: () => void;
  onOpenReport: () => void;
  unreadAlertsCount?: number;
  onOpenAlerts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  selectedCity,
  onCityChange,
  onOpenSettings,
  onOpenReport,
  unreadAlertsCount = 2,
  onOpenAlerts,
}) => {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const navItems: { id: MainTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'explore', label: 'Explore' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'priority', label: 'Priority' },
    { id: 'methodology', label: 'Methodology' },
  ];

  const cityOptions = [
    'Chennai Metropolitan Area',
    'North Chennai Industrial Corridor',
    'South Chennai & IT Corridor',
    'Central Commercial Core',
    'Western Metropolitan Hub',
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#F1F8F4]/90 backdrop-blur-md border-b border-[#D8E6DE] px-4 md:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Logo
            size="md"
            onClick={() => onTabChange('overview')}
            className="cursor-pointer hover:opacity-90 transition-opacity"
          />

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`text-[15px] font-medium transition-all relative py-1.5 px-1 cursor-pointer ${
                    isActive
                      ? 'text-[#164E35] font-semibold'
                      : 'text-[#4B5E53] hover:text-[#184E32]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1F6E43] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Utility Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location Dropdown Selector */}
          <div className="relative">
            <button
              id="header-location-btn"
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              title="Select Region"
              className="flex items-center gap-1.5 p-2 rounded-full text-[#385143] hover:text-[#164E35] hover:bg-[#E3EEE6] transition-colors cursor-pointer"
            >
              <MapPin className="w-5 h-5 stroke-[1.8]" />
            </button>

            {showCityDropdown && (
              <div
                id="city-dropdown-menu"
                className="absolute right-0 mt-2 w-64 bg-white border border-[#D5E3DB] shadow-lg rounded-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#6B8576] border-b border-[#EAF2ED]">
                  Active Sector
                </div>
                {cityOptions.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onCityChange(city);
                      setShowCityDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                      selectedCity === city
                        ? 'bg-[#EAF5EE] text-[#164E35] font-medium'
                        : 'text-[#2D3E35] hover:bg-[#F3F8F5]'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <Check className="w-3.5 h-3.5 text-[#1F6E43]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            title="System Configuration & Preferences"
            className="p-2 rounded-full text-[#385143] hover:text-[#164E35] hover:bg-[#E3EEE6] transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* Notifications / Alerts Button */}
          <div className="relative">
            <button
              id="header-notifications-btn"
              onClick={onOpenAlerts}
              title="Live Heat Alerts"
              className="relative p-2 rounded-full text-[#385143] hover:text-[#164E35] hover:bg-[#E3EEE6] transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full animate-pulse ring-2 ring-white" />
              )}
            </button>
          </div>

          {/* User Profile Avatar */}
          <div className="relative ml-1">
            <button
              id="header-profile-btn"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-1.5 p-0.5 rounded-full border-2 border-[#1E6B41] hover:ring-2 hover:ring-[#1E6B41]/30 transition-all cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=120&auto=format&fit=crop"
                alt="Dr. Ananya Rao"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>

            {showProfileDropdown && (
              <div
                id="profile-dropdown-menu"
                className="absolute right-0 mt-2 w-64 bg-white border border-[#D5E3DB] shadow-xl rounded-xl p-3 z-50"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-[#EAF2ED]">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=120&auto=format&fit=crop"
                    alt="Dr. Ananya Rao"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#1E6B41]"
                  />
                  <div>
                    <div className="text-sm font-bold text-[#14432A]">Dr. Ananya Rao</div>
                    <div className="text-xs text-[#5D7769]">Lead Heat Resilience Officer</div>
                  </div>
                </div>

                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center justify-between py-1.5 px-2 text-[#465E50]">
                    <span>Workspace</span>
                    <span className="font-semibold text-[#184E32]">GCC Heat Action Cell</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2 text-[#465E50]">
                    <span>Model Engine</span>
                    <span className="font-mono text-[#184E32]">v1.4.2-XGBoost</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#EAF2ED]">
                  <button
                    onClick={() => {
                      onOpenReport();
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-[#184E32] hover:bg-[#EAF5EE] rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Generate City Brief</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#1E6B41]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pt-2.5 pb-1 border-t border-[#E1ECE5] mt-2 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`whitespace-nowrap px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
              activeTab === item.id
                ? 'bg-[#184E32] text-white'
                : 'bg-[#E5F0E9] text-[#2C4135] hover:bg-[#D5E6DC]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
