export type ActiveTab = 'landing' | 'dashboard' | 'settings';

export type ToolType = 'resize' | 'convert' | 'compress' | 'passport' | 'bg-remover';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  originalUrl: string;
  width: number;
  height: number;
  processedUrl: string | null;
  processedSize: number | null;
  processedWidth: number | null;
  processedHeight: number | null;
  status: 'idle' | 'processing' | 'done' | 'error';
  errorMessage?: string;
  progress: number;
  manualMaskDataUrl?: string; // Stores user manually-edited mask as a base64 string
}

export interface ResizeOptions {
  width: number;
  height: number;
  lockAspectRatio: boolean;
  percentage: number;
  mode: 'custom' | 'percentage' | 'preset';
  preset: string | null;
}

export interface ConvertOptions {
  format: 'jpg' | 'png' | 'webp';
}

export interface CompressOptions {
  quality: number; // 1 - 100
}

export interface PassportOptions {
  size: '2x3' | '3x4' | '4x6';
  autoCenter: boolean;
  backgroundColor: string; // hex color code or 'transparent'
  cropMargin: number; // 0 - 50 percentage
  qualityMode: 'fast' | 'better';
}

export interface BgRemoverOptions {
  backgroundColor: 'transparent' | 'red' | 'blue' | 'white' | 'gray' | 'studio-white' | 'studio-gray' | 'office' | 'corporate';
  qualityMode: 'fast' | 'better';
}

export interface AppSettings {
  language: 'en' | 'id';
  exportPreference: 'individual' | 'zip';
}
