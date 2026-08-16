export type MainTab = 
  | 'overview' 
  | 'explore' 
  | 'forecast' 
  | 'analytics' 
  | 'priority' 
  | 'methodology';

export type ExploreSubTab = 
  | 'map-layers' 
  | 'time-series' 
  | 'risk-analytics' 
  | 'demographics' 
  | 'interventions' 
  | 'export';

export type MapLayerType = 
  | 'heat-risk' 
  | 'temperature' 
  | 'lst' 
  | 'ndvi' 
  | 'population-density';

export type AnalyticsSubTab = 
  | 'overview' 
  | 'temporal' 
  | 'spatial' 
  | 'environment' 
  | 'exposure';

export interface ZoneData {
  id: string;
  code: string;
  name: string;
  sector: string;
  riskScore: number; // 0-100
  riskCategory: 'Critical' | 'High' | 'Elevated' | 'Moderate' | 'Low';
  airTemp: number; // in °C
  lstTemp: number; // in °C
  humidity: number; // in %
  windSpeed: number; // in m/s
  demographicRisk: number; // 0-100
  infrastructureIndex: number; // 0-100
  greenCoverPct: number; // %
  populationDensity: number; // per sq km
  builtUpDensity: number; // %
  meanLst: number; // °C
  ndviScore: number; // 0 to 1
  trend: 'up' | 'stable' | 'down';
  trendValue?: string;
  alertText?: string;
  popExposureScore: number; // 0-100 for quadrant
  coordinates: { x: number; y: number };
  lat: number;
  lng: number;
  radius?: number;
  contributors: {
    lst: number; // %
    humidity: number;
    albedoDeficiency: number;
    vegetationLack: number;
    other: number;
  };
}

export interface HourlyForecast {
  time: string;
  displayTime: string;
  riskScore: number;
  temperature: number;
  lstTemp: number;
  humidity: number;
  isNow?: boolean;
}

export interface ModelComparison {
  name: string;
  auc: number;
  f1: number;
  inferenceTime: string;
  status: 'Production' | 'Challenger' | 'Baseline';
}

export interface FeatureImportance {
  feature: string;
  weight: number;
  category: string;
}
