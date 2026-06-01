import { create } from 'zustand';
import type { 
  ActiveTab, 
  ToolType, 
  UploadedFile, 
  ResizeOptions, 
  ConvertOptions, 
  CompressOptions, 
  PassportOptions, 
  BgRemoverOptions, 
  AppSettings 
} from '../types';

interface ImageState {
  files: UploadedFile[];
  activeTab: ActiveTab;
  activeTool: ToolType;
  selectedFileId: string | null;
  theme: 'dark' | 'light';
  settings: AppSettings;
  
  // Tool-specific options
  resizeOptions: ResizeOptions;
  convertOptions: ConvertOptions;
  compressOptions: CompressOptions;
  passportOptions: PassportOptions;
  bgRemoverOptions: BgRemoverOptions;
  
  // Setters & Actions
  setTheme: (theme: 'dark' | 'light') => void;
  setActiveTab: (tab: ActiveTab) => void;
  setActiveTool: (tool: ToolType) => void;
  setSelectedFileId: (id: string | null) => void;
  setSettings: (settings: Partial<AppSettings>) => void;
  
  setResizeOptions: (options: Partial<ResizeOptions>) => void;
  setConvertOptions: (options: Partial<ConvertOptions>) => void;
  setCompressOptions: (options: Partial<CompressOptions>) => void;
  setPassportOptions: (options: Partial<PassportOptions>) => void;
  setBgRemoverOptions: (options: Partial<BgRemoverOptions>) => void;
  
  addFiles: (filesList: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateFile: (id: string, updates: Partial<UploadedFile>) => void;
  updateFileProgress: (id: string, progress: number) => void;
}

const initialResizeOptions: ResizeOptions = {
  width: 1920,
  height: 1080,
  lockAspectRatio: true,
  percentage: 100,
  mode: 'custom',
  preset: null,
};

const initialConvertOptions: ConvertOptions = {
  format: 'png',
};

const initialCompressOptions: CompressOptions = {
  quality: 80,
};

const initialPassportOptions: PassportOptions = {
  size: '3x4',
  autoCenter: true,
  backgroundColor: '#3b82f6', // Standard blue background
  cropMargin: 15,
  qualityMode: 'better',
};

const initialBgRemoverOptions: BgRemoverOptions = {
  backgroundColor: 'transparent',
  qualityMode: 'better',
};

const initialSettings: AppSettings = {
  language: 'en', // Default to English
  exportPreference: 'individual',
};

export const useImageStore = create<ImageState>((set, get) => ({
  files: [],
  activeTab: 'landing',
  activeTool: 'resize',
  selectedFileId: null,
  theme: 'light',
  settings: initialSettings,
  
  resizeOptions: initialResizeOptions,
  convertOptions: initialConvertOptions,
  compressOptions: initialCompressOptions,
  passportOptions: initialPassportOptions,
  bgRemoverOptions: initialBgRemoverOptions,
  
  setTheme: (theme) => {
    set({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  
  setActiveTab: (activeTab) => set({ activeTab }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setSelectedFileId: (selectedFileId) => set({ selectedFileId }),
  
  setSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
  
  setResizeOptions: (options) => set((state) => ({
    resizeOptions: { ...state.resizeOptions, ...options }
  })),
  
  setConvertOptions: (options) => set((state) => ({
    convertOptions: { ...state.convertOptions, ...options }
  })),
  
  setCompressOptions: (options) => set((state) => ({
    compressOptions: { ...state.compressOptions, ...options }
  })),
  
  setPassportOptions: (options) => set((state) => ({
    passportOptions: { ...state.passportOptions, ...options }
  })),
  
  setBgRemoverOptions: (options) => set((state) => ({
    bgRemoverOptions: { ...state.bgRemoverOptions, ...options }
  })),
  
  addFiles: async (filesList) => {
    const currentFiles = get().files;
    const newFilesPromises = filesList.map((file) => {
      return new Promise<UploadedFile>((resolve) => {
        const id = Math.random().toString(36).substring(2, 9);
        const originalUrl = URL.createObjectURL(file);
        
        const img = new Image();
        img.onload = () => {
          resolve({
            id,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            originalUrl,
            width: img.naturalWidth,
            height: img.naturalHeight,
            processedUrl: null,
            processedSize: null,
            processedWidth: null,
            processedHeight: null,
            status: 'idle',
            progress: 0,
          });
        };
        img.onerror = () => {
          // Fallback if not an image
          resolve({
            id,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            originalUrl,
            width: 0,
            height: 0,
            processedUrl: null,
            processedSize: null,
            processedWidth: null,
            processedHeight: null,
            status: 'error',
            errorMessage: 'Invalid image file',
            progress: 0,
          });
        };
        img.src = originalUrl;
      });
    });
    
    const parsedFiles = await Promise.all(newFilesPromises);
    const updatedFiles = [...currentFiles, ...parsedFiles];
    
    set({ 
      files: updatedFiles,
      selectedFileId: get().selectedFileId || parsedFiles[0]?.id || null 
    });
  },
  
  removeFile: (id) => {
    const files = get().files;
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.originalUrl);
      if (fileToRemove.processedUrl) {
        URL.revokeObjectURL(fileToRemove.processedUrl);
      }
    }
    
    const updatedFiles = files.filter((f) => f.id !== id);
    const currentSelected = get().selectedFileId;
    
    set({
      files: updatedFiles,
      selectedFileId: currentSelected === id 
        ? (updatedFiles[0]?.id || null) 
        : currentSelected
    });
  },
  
  clearFiles: () => {
    get().files.forEach((file) => {
      URL.revokeObjectURL(file.originalUrl);
      if (file.processedUrl) {
        URL.revokeObjectURL(file.processedUrl);
      }
    });
    set({ files: [], selectedFileId: null });
  },
  
  updateFile: (id, updates) => set((state) => ({
    files: state.files.map((file) => 
      file.id === id ? { ...file, ...updates } : file
    )
  })),
  
  updateFileProgress: (id, progress) => set((state) => ({
    files: state.files.map((file) => 
      file.id === id ? { ...file, progress } : file
    )
  })),
}));
