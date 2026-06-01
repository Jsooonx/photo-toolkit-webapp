import React, { useRef, useState, useEffect } from 'react';
import { useImageStore } from '../store/imageStore';
import { Eraser, Brush, Undo2, Check, X } from 'lucide-react';
import { getTranslation } from '../constants/translations';

interface ManualMaskEditorProps {
  originalUrl: string;
  processedUrl: string; // The cutout image URL
  onSave: (maskDataUrl: string) => void;
  onCancel: () => void;
}

export const ManualMaskEditor: React.FC<ManualMaskEditorProps> = ({
  originalUrl,
  processedUrl,
  onSave,
  onCancel,
}) => {
  const { theme, settings } = useImageStore();
  const t = getTranslation(settings.language);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [brushMode, setBrushMode] = useState<'erase' | 'restore'>('erase');
  const [brushSize, setBrushSize] = useState<number>(30);
  const [zoom, setZoom] = useState<number>(100); // percentage
  const [isDrawing, setIsDrawing] = useState(false);

  // Canvas objects kept in ref
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  // History stack for undo
  const historyRef = useRef<string[]>([]); // stores mask data urls
  const lastCoordsRef = useRef<{ x: number; y: number } | null>(null);

  const pushToHistory = () => {
    if (maskCanvasRef.current) {
      historyRef.current.push(maskCanvasRef.current.toDataURL());
      if (historyRef.current.length > 25) {
        historyRef.current.shift(); // Limit to 25 history steps
      }
    }
  };

  const handleUndo = () => {
    if (historyRef.current.length > 0 && maskCanvasRef.current && maskCtxRef.current) {
      const prevMaskDataUrl = historyRef.current.pop();
      if (prevMaskDataUrl) {
        const img = new Image();
        img.onload = () => {
          maskCtxRef.current?.clearRect(0, 0, maskCanvasRef.current!.width, maskCanvasRef.current!.height);
          maskCtxRef.current?.drawImage(img, 0, 0);
          drawMainComposite();
        };
        img.src = prevMaskDataUrl;
      }
    }
  };

  const drawCheckerboard = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const size = 16;
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        ctx.fillStyle = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0 ? '#ffffff' : '#e5e7eb';
        ctx.fillRect(x, y, size, size);
      }
    }
  };

  // Draw the original image cut by the mask
  const drawMainComposite = () => {
    const mainCanvas = canvasRef.current;
    if (!mainCanvas || !originalImageRef.current || !maskCanvasRef.current) return;

    const ctx = mainCanvas.getContext('2d');
    if (!ctx) return;

    // Clear main canvas
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    // Draw checkerboard background so the user can see transparency
    drawCheckerboard(ctx, mainCanvas.width, mainCanvas.height);

    // Create an alpha mask from the black and white mask canvas
    const alphaMaskCanvas = document.createElement('canvas');
    alphaMaskCanvas.width = mainCanvas.width;
    alphaMaskCanvas.height = mainCanvas.height;
    const aCtx = alphaMaskCanvas.getContext('2d');
    
    if (aCtx && maskCtxRef.current) {
      // Get the black and white mask image data
      const maskImgData = maskCtxRef.current.getImageData(0, 0, alphaMaskCanvas.width, alphaMaskCanvas.height);
      const data = maskImgData.data;

      // Convert black to transparent, white to opaque
      for (let i = 0; i < data.length; i += 4) {
        const val = data[i]; // Grayscale value (white = 255, black = 0)
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = val; // Set alpha matching mask intensity
      }
      aCtx.putImageData(maskImgData, 0, 0);
    }

    // Draw original image cut by the alpha mask
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = mainCanvas.width;
    tempCanvas.height = mainCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(originalImageRef.current, 0, 0);
      tempCtx.globalCompositeOperation = 'destination-in';
      tempCtx.drawImage(alphaMaskCanvas, 0, 0);
      tempCtx.globalCompositeOperation = 'source-over';

      // Draw onto main canvas
      ctx.drawImage(tempCanvas, 0, 0);
    }
  };

  // Set up the canvases
  useEffect(() => {
    const originalImg = new Image();
    const processedImg = new Image();

    originalImg.crossOrigin = 'anonymous';
    processedImg.crossOrigin = 'anonymous';

    originalImg.onload = () => {
      originalImageRef.current = originalImg;

      // Load processed image cutout to generate the initial mask
      processedImg.onload = () => {
        const width = originalImg.naturalWidth;
        const height = originalImg.naturalHeight;

        // Set main display canvas dimensions
        if (canvasRef.current) {
          canvasRef.current.width = width;
          canvasRef.current.height = height;
        }

        // Initialize offscreen mask canvas
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = width;
        maskCanvas.height = height;
        const maskCtx = maskCanvas.getContext('2d');

        if (maskCtx) {
          maskCtxRef.current = maskCtx;
          maskCanvasRef.current = maskCanvas;

          // Draw initial mask: black everywhere, then draw cutout and fill it with white
          maskCtx.fillStyle = '#000000';
          maskCtx.fillRect(0, 0, width, height);

          // Draw the cutout
          maskCtx.drawImage(processedImg, 0, 0);
          maskCtx.globalCompositeOperation = 'source-in';
          maskCtx.fillStyle = '#ffffff';
          maskCtx.fillRect(0, 0, width, height);
          maskCtx.globalCompositeOperation = 'source-over';

          drawMainComposite();
        }
      };
      processedImg.src = processedUrl;
    };
    originalImg.src = originalUrl;
  }, [originalUrl, processedUrl]);

  // Drawing event handlers
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Map screen mouse coordinates back to the actual high-res canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    pushToHistory();
    setIsDrawing(true);
    
    const coords = getCanvasCoords(e);
    lastCoordsRef.current = coords;
    
    drawSingleSpot(coords.x, coords.y);
  };

  const drawSingleSpot = (x: number, y: number) => {
    if (!maskCtxRef.current) return;
    const ctx = maskCtxRef.current;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = brushMode === 'erase' ? '#000000' : '#ffffff';
    ctx.fill();
    ctx.restore();

    drawMainComposite();
  };

  const drawBrushStroke = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !maskCtxRef.current) return;
    e.preventDefault();

    const coords = getCanvasCoords(e);
    const lastCoords = lastCoordsRef.current;
    const ctx = maskCtxRef.current;

    ctx.save();
    ctx.beginPath();
    if (lastCoords) {
      ctx.moveTo(lastCoords.x, lastCoords.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.strokeStyle = brushMode === 'erase' ? '#000000' : '#ffffff';
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    } else {
      ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = brushMode === 'erase' ? '#000000' : '#ffffff';
      ctx.fill();
    }
    ctx.restore();

    lastCoordsRef.current = coords;
    drawMainComposite();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastCoordsRef.current = null;
  };

  const handleApply = () => {
    if (maskCanvasRef.current) {
      onSave(maskCanvasRef.current.toDataURL());
    }
  };

  return (
    <div className={`flex flex-col w-full h-full min-h-0 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
      {/* Editor Controls Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-4 border-b ${
        theme === 'dark' ? 'border-white/5 bg-[#12131a]/60' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center gap-2">
          {/* Tool Modes */}
          <div className="flex p-0.5 bg-black/10 rounded-xl">
            <button
              onClick={() => setBrushMode('erase')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                brushMode === 'erase' ? 'bg-[#ef4444] text-white' : 'text-gray-400 hover:text-white'
              }`}
              title={t.manualMaskEditor.erase}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.manualMaskEditor.erase}</span>
            </button>
            <button
              onClick={() => setBrushMode('restore')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                brushMode === 'restore' ? 'bg-[#10b981] text-white' : 'text-gray-400 hover:text-white'
              }`}
              title={t.manualMaskEditor.restore}
            >
              <Brush className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.manualMaskEditor.restore}</span>
            </button>
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <span className="text-[10px] font-bold text-gray-400 uppercase">{t.manualMaskEditor.brush}: {brushSize}px</span>
            <input
              type="range"
              min="5"
              max="150"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 sm:w-28 h-1 appearance-none cursor-pointer bg-purple-900/20 rounded accent-purple-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom */}
          <div className="flex items-center gap-1 bg-black/10 rounded-xl p-0.5">
            {[100, 150, 200, 300].map((z) => (
              <button
                key={z}
                onClick={() => setZoom(z)}
                className={`px-2 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-colors ${
                  zoom === z
                    ? theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {z}%
              </button>
            ))}
          </div>

          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={historyRef.current.length === 0}
            className="p-2 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-gray-300 disabled:opacity-40 cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Cancel/Save Actions */}
          <div className="flex gap-1">
            <button
              onClick={onCancel}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 cursor-pointer"
              title={t.manualMaskEditor.cancel}
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-lg shadow-purple-600/15"
              title={t.manualMaskEditor.apply}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.manualMaskEditor.apply}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Paint Area */}
      <div 
        ref={containerRef}
        className="flex-1 w-full overflow-auto p-8 flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px] bg-gray-100 dark:bg-[#07080b]"
      >
        <div 
          className="relative max-w-full max-h-full border border-purple-500/30 rounded-xl overflow-hidden shadow-2xl transition-all duration-150"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={drawBrushStroke}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={drawBrushStroke}
            onTouchEnd={stopDrawing}
            className="max-w-full max-h-[55vh] object-contain cursor-crosshair block select-none touch-none bg-black/20"
          />
        </div>
      </div>

      {/* Guide bottom bar */}
      <div className="px-6 py-2.5 bg-black/10 text-center text-[10px] text-gray-500 font-medium animate-pulse">
        {t.manualMaskEditor.guide}
      </div>
    </div>
  );
};
