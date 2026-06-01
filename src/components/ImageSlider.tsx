import React, { useState } from 'react';
import { useImageStore } from '../store/imageStore';
import { getTranslation } from '../constants/translations';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface ImageSliderProps {
  originalUrl: string;
  processedUrl: string;
  name: string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ originalUrl, processedUrl, name }) => {
  const { theme, settings } = useImageStore();
  const t = getTranslation(settings.language);

  const [sliderPos, setSliderPos] = useState(50);
  const [zoom, setZoom] = useState(1);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Number(e.target.value));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Zoom controls */}
      <div className={`w-full flex items-center justify-between px-4 py-2 border-b text-xs ${
        theme === 'dark' ? 'border-white/5 text-gray-400' : 'border-gray-200 text-gray-500'
      }`}>
        <span className="font-semibold truncate max-w-[200px] sm:max-w-xs">{name}</span>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <ZoomOut className="w-3.5 h-3.5" />
            <input 
              type="range" 
              min="1" 
              max="4" 
              step="0.1" 
              value={zoom} 
              onChange={handleZoomChange}
              className="w-16 sm:w-24 h-1 bg-purple-500/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <ZoomIn className="w-3.5 h-3.5" />
          </div>
          <span className="w-8 text-right font-mono">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={resetZoom}
            title="Reset Zoom"
            className={`p-1 rounded cursor-pointer transition-colors ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'
            }`}
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Slider container */}
      <div className="relative flex-1 w-full flex items-center justify-center p-6 overflow-hidden bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px]">
        
        {/* Frame bounding box */}
        <div 
          className="relative w-full max-w-full aspect-[4/3] max-h-[350px] sm:max-h-[420px] rounded-xl overflow-hidden border shadow-lg transition-all duration-300"
          style={{
            borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
            backgroundColor: theme === 'dark' ? '#0f1015' : '#f8fafc'
          }}
        >
          {/* Zoom wrapper */}
          <div 
            className="absolute inset-0 flex items-center justify-center origin-center transition-transform duration-100"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* The After (Processed) Image - Base Bottom */}
            <img 
              src={processedUrl} 
              alt="Processed output"
              className="absolute max-w-full max-h-full object-contain pointer-events-none select-none"
            />

            {/* The Before (Original) Image - Overlay Top clipped */}
            <div 
              className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img 
                src={originalUrl} 
                alt="Original input"
                className="absolute max-w-none max-h-none object-contain pointer-events-none select-none"
                style={{
                  // The image width and height inside the clipped div must mirror the base image size exactly!
                  // By making this div fill the outer frame and keeping object-fit match, we align the pixels.
                  width: '100%',
                  height: '100%',
                  left: 0,
                  top: 0
                }}
              />
            </div>

            {/* Sliding line indicator */}
            <div 
              className="absolute top-0 bottom-0 w-[1.5px] bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] pointer-events-none z-10"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Slider handle badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg border border-purple-400 text-xs font-bold pointer-events-none">
                ↔
              </div>
            </div>
          </div>

          {/* Invisible interactive input range on top to capture slide events */}
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderPos} 
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />

          {/* Tags */}
          <div className="absolute top-3 left-3 px-2 py-1 text-[10px] font-bold rounded bg-black/60 text-white select-none z-30 pointer-events-none shadow">
            {t.dashboard.before}
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded bg-purple-600/80 text-white select-none z-30 pointer-events-none shadow">
            {t.dashboard.after}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageSlider;
