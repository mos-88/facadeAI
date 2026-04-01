export interface BBox {
  0: number;
  1: number;
  2: number;
  3: number;
}

export interface Measurements {
  width: number;
  height: number;
  area: number;
}

export interface DetectedElement {
  id: number;
  bbox: number[];
  confidence: number;
  label: string;
  measurements: Measurements;
}

export interface FacadeData {
  bbox: number[];
  confidence: number;
  measurements: Measurements;
}

export interface AnalysisSummary {
  totalFacadeArea: number;
  facadeWidth: number;
  facadeHeight: number;
  windowCount: number;
  totalWindowArea: number;
  doorCount: number;
  totalDoorArea: number;
  netFacadeArea: number;
  pixelsPerMeter: number;
}

export interface AnalysisResult {
  facade: FacadeData;
  windows: DetectedElement[];
  doors: DetectedElement[];
  summary: AnalysisSummary;
}

export type ScaleType = 'width' | 'height';

export interface AnalysisState {
  image: string | null;
  imageFile: File | null;
  imageWidth: number;
  imageHeight: number;
  scaleValue: number;
  scaleType: ScaleType;
  confidenceThreshold: number;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
  activeTab: 'upload' | 'results';
  showWindows: boolean;
  showDoors: boolean;
  showFacade: boolean;
}
